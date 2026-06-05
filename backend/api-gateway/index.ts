import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { traceMiddleware } from "../shared/middleware/trace";
import { bootstrapObservability } from "../shared/observability";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Helmet Security Headers
app.use(helmet());

// Configure credential-friendly CORS
app.use(cors({
  origin: true, // reflects origin of the request, required for credentials
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Apply global request-scoped tracing middleware
app.use(traceMiddleware);

// Bootstrap Observability health check and system performance metrics
bootstrapObservability(app, "API Gateway");

// Global Gateway Rate Limiting (max 150 requests per minute)
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
  message: { error: "Too many requests. Please slow down." }
});
app.use(globalLimiter);

const SUBSCRIBERS: Record<string, string[]> = {
  "page_view": ["http://localhost:5005/api/internal/events"],
  "blog_click": ["http://localhost:5005/api/internal/events"],
  "contact_message": ["http://localhost:5006/api/internal/events"],
};

app.post("/api/internal/events", (req, res) => {
  const { event, data } = req.body;
  if (!event) {
    return res.status(400).json({ error: "Missing event name" });
  }

  const urls = SUBSCRIBERS[event] || [];
  urls.forEach((url) => {
    const parsedUrl = new URL(url);
    const payload = JSON.stringify({ event, data });
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const deliveryReq = http.request(options, (deliveryRes) => {
      deliveryRes.resume();
    });

    deliveryReq.on("error", (err) => {
      console.error(`[EventRouter] Delivery failed for "${event}" to ${url}: ${err.message}`);
    });

    deliveryReq.write(payload);
    deliveryReq.end();
  });

  return res.json({ success: true });
});


// Proxy helper mapping routes to microservices ports
const SERVICES: Record<string, number> = {
  "/api/auth": 5001,
  "/api/personal-info": 5002,
  "/api/social-links": 5002,
  "/api/about": 5002,
  "/api/experience": 5002,
  "/api/projects": 5002,
  "/api/skills": 5002,
  "/api/services": 5002,
  "/api/testimonials": 5002,
  "/api/messages": 5002,
  "/api/seed": 5002,
  "/api/search": 5002,
  "/api/blog": 5003,
  "/api/ai": 5004,
  "/api/analytics": 5005,
  "/api/notification": 5006,
};

const proxyToService = (port: number) => {
  return (req: express.Request, res: express.Response) => {
    const bodyData = (req.body && Object.keys(req.body).length > 0 && req.method !== "GET" && req.method !== "DELETE") 
      ? JSON.stringify(req.body) 
      : null;

    const headers: Record<string, any> = {
      ...req.headers,
      host: `localhost:${port}`,
      "x-trace-id": req.headers["x-trace-id"] || res.getHeader("x-trace-id") || ""
    };

    if (bodyData) {
      headers["content-length"] = Buffer.byteLength(bodyData);
      headers["content-type"] = "application/json";
    } else {
      delete headers["content-length"];
      delete headers["content-type"];
    }

    const options: http.RequestOptions = {
      hostname: "localhost",
      port,
      path: req.originalUrl,
      method: req.method,
      headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    if (bodyData) {
      proxyReq.write(bodyData);
    }
    
    proxyReq.on("error", (err) => {
      console.error(`[Gateway] Proxy error to port ${port}: ${err.message}`);
      res.status(502).json({ error: "Service currently unavailable." });
    });

    proxyReq.end();
  };
};

// System Observability Dashboard Health Check aggregator
app.get("/api/observability/status", async (req, res) => {
  const services = {
    auth: 5001,
    portfolio: 5002,
    blog: 5003,
    ai: 5004,
    analytics: 5005,
    notification: 5006
  };

  const statusReports: Record<string, any> = {};

  await Promise.all(
    Object.entries(services).map(async ([name, port]) => {
      try {
        const start = Date.now();
        const response = await fetch(`http://localhost:${port}/health`);
        const latency = Date.now() - start;
        if (response.ok) {
          const details = await response.json().catch(() => ({}));
          statusReports[name] = { status: "up", latency, ...details };
        } else {
          statusReports[name] = { status: "down", error: `HTTP ${response.status}`, latency };
        }
      } catch (err: any) {
        statusReports[name] = { status: "down", error: err.message, latency: 0 };
      }
    })
  );

  res.json({
    gateway: "up",
    timestamp: new Date().toISOString(),
    services: statusReports
  });
});

// Route requests to appropriate services
Object.entries(SERVICES).forEach(([route, port]) => {
  app.all(`${route}*`, proxyToService(port));
});

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Project Titan API Gateway is running." });
  });
}


const server = http.createServer(app);

// Initialize Socket.io server
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let activeVisitors = 0;
const activeUsers = new Map();

io.on("connection", (socket) => {
  activeVisitors++;
  io.emit("visitor_count", activeVisitors);
  console.log(`[Gateway WebSockets] Client connected. Active visitors: ${activeVisitors}`);

  // Typing status forwarding
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", { id: socket.id, ...data });
  });

  // Admin Notification broker forwarding
  socket.on("admin_notification", (notif) => {
    io.emit("admin_notification", notif);
  });

  // Co-Presence / Cursor movement tracking
  socket.on("presence", (presenceData) => {
    activeUsers.set(socket.id, presenceData);
    socket.broadcast.emit("presence_update", {
      id: socket.id,
      ...presenceData
    });
  });

  socket.on("disconnect", () => {
    activeVisitors = Math.max(0, activeVisitors - 1);
    activeUsers.delete(socket.id);
    io.emit("visitor_count", activeVisitors);
    io.emit("presence_offline", socket.id);
    console.log(`[Gateway WebSockets] Client disconnected. Active visitors: ${activeVisitors}`);
  });
});

server.listen(PORT, () => {
  console.log(`[Gateway] Running with WebSockets on port ${PORT}`);
});
