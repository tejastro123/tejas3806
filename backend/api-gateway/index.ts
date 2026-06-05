import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  credentials: true
}));

// We parse JSON only for routes that don't need to be proxied directly as streams
// Or we parse it and stringify it back when proxying
app.use(express.json());

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
      host: `localhost:${port}`
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


app.listen(PORT, () => {
  console.log(`[Gateway] Running on port ${PORT}`);
});
