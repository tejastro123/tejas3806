import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');

const dirs = [
  'backend/shared/models',
  'backend/shared/middleware',
  'backend/api-gateway',
  'backend/services/auth-service',
  'backend/services/portfolio-service',
  'backend/services/blog-service',
  'backend/services/ai-service',
  'backend/services/analytics-service',
  'backend/services/notification-service'
];

function ensureDir(dir) {
  const abs = path.join(rootDir, dir);
  if (!fs.existsSync(abs)) {
    fs.mkdirSync(abs, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Ensure all dirs exist
dirs.forEach(ensureDir);

// 1. Copy mongoose models
const modelsSrcDir = path.join(rootDir, 'server/src/models');
const modelsDestDir = path.join(rootDir, 'backend/shared/models');
if (fs.existsSync(modelsSrcDir)) {
  const models = fs.readdirSync(modelsSrcDir);
  models.forEach(modelFile => {
    const src = path.join(modelsSrcDir, modelFile);
    const dest = path.join(modelsDestDir, modelFile);
    fs.copyFileSync(src, dest);
    console.log(`Copied model: ${modelFile}`);
  });
}

// 2. Create backend/shared/db.ts
const dbContent = `import mongoose from "mongoose";

export const connectDB = async (serviceName: string) => {
  try {
    const connString = process.env.MONGODB_URI;
    if (!connString) {
      console.error(\`[\${serviceName}] MONGODB_URI is not defined in env.\`);
      process.exit(1);
    }
    const conn = await mongoose.connect(connString);
    console.log(\`[\${serviceName}] MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`[\${serviceName}] MongoDB Connection Error: \${(error as Error).message}\`);
    process.exit(1);
  }
};
`;
fs.writeFileSync(path.join(rootDir, 'backend/shared/db.ts'), dbContent);
console.log('Created backend/shared/db.ts');

// 3. Create backend/shared/middleware/auth.ts
const authContent = `import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Access forbidden. Admin role required." });
      return;
    }
    next();
  });
};
`;
fs.writeFileSync(path.join(rootDir, 'backend/shared/middleware/auth.ts'), authContent);
console.log('Created backend/shared/middleware/auth.ts');

// 4. Create backend/api-gateway/index.ts
const gatewayContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

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
    const options: http.RequestOptions = {
      hostname: "localhost",
      port,
      path: req.originalUrl,
      method: req.method,
      headers: {
        ...req.headers,
        host: \`localhost:\${port}\`
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    if (req.body) {
      proxyReq.write(JSON.stringify(req.body));
    }
    
    proxyReq.on("error", (err) => {
      console.error(\`[Gateway] Proxy error to port \${port}: \${err.message}\`);
      res.status(502).json({ error: "Service currently unavailable." });
    });

    proxyReq.end();
  };
};

// Route requests to appropriate services
Object.entries(SERVICES).forEach(([route, port]) => {
  app.all(\`\${route}*\`, proxyToService(port));
});

// Default root route
app.get("/", (req, res) => {
  res.json({ message: "Project Titan API Gateway is running." });
});

app.listen(PORT, () => {
  console.log(\`[Gateway] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/api-gateway/index.ts'), gatewayContent);
console.log('Created backend/api-gateway/index.ts');

// 5. Create Auth Service: backend/services/auth-service/index.ts
const authServiceContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../shared/db";
import { User } from "../../shared/models/User";
import { requireAuth, AuthenticatedRequest } from "../../shared/middleware/auth";

dotenv.config();

const app = express();
const PORT = 5001;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

app.use(cors());
app.use(express.json());

connectDB("Auth-Service");

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? "admin" : "user";

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully.", role });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Get current user profile
app.get("/api/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(\`[Auth Service] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/services/auth-service/index.ts'), authServiceContent);
console.log('Created backend/services/auth-service/index.ts');

// 6. Create Portfolio Service: backend/services/portfolio-service/index.ts
const portfolioServiceContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../../shared/db";
import { requireAdmin } from "../../shared/middleware/auth";

// Models
import { User } from "../../shared/models/User";
import { PersonalInfo } from "../../shared/models/PersonalInfo";
import { SocialLink } from "../../shared/models/SocialLink";
import { About } from "../../shared/models/About";
import { Experience } from "../../shared/models/Experience";
import { Project } from "../../shared/models/Project";
import { Skill } from "../../shared/models/Skill";
import { Service } from "../../shared/models/Service";
import { BlogPost } from "../../shared/models/BlogPost";
import { Testimonial } from "../../shared/models/Testimonial";
import { Message } from "../../shared/models/Message";

dotenv.config();

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

connectDB("Portfolio-Service");

// Personal Info
app.get("/api/personal-info", async (req, res) => {
  try {
    let info = await PersonalInfo.findOne();
    if (!info) {
      info = new PersonalInfo({
        name: "Mellimpudi Tejas",
        role: "AIMLDS Engineer & Physicist",
        email: "tejas.mellimpudi@gmail.com",
        location: "Hyderabad, India",
        avatar: "https://github.com/tejastro123.png",
        bio_tagline: "Bridging the gap between Theoretical Physics and Computational Reality.",
        bio_short: "Dual Degree scholar at BITS Pilani engineering the future of Robotics, Space Tech, and Full-Stack Systems.",
        bio_long: "I stand at the convergence of hardware and software...",
      });
      await info.save();
    }
    return res.json(info);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/personal-info", requireAdmin, async (req, res) => {
  try {
    const info = await PersonalInfo.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    return res.json(info);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Social Links
app.get("/api/social-links", async (req, res) => {
  try {
    const links = await SocialLink.find().sort({ sort_order: 1 });
    return res.json(links);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/social-links", requireAdmin, async (req, res) => {
  try {
    const link = new SocialLink(req.body);
    await link.save();
    return res.status(201).json(link);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/social-links/:id", requireAdmin, async (req, res) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(link);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/social-links/:id", requireAdmin, async (req, res) => {
  try {
    await SocialLink.findByIdAndDelete(req.params.id);
    return res.json({ message: "Social link deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// About
app.get("/api/about", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({ heading: "Beyond the Code", content: "My journey isn't defined solely by lines of code.", fun_facts: [] });
      await about.save();
    }
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/about", requireAdmin, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Experience
app.get("/api/experience", async (req, res) => {
  try {
    const experience = await Experience.find().sort({ sort_order: 1 });
    return res.json(experience);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/experience", requireAdmin, async (req, res) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    return res.status(201).json(exp);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/experience/:id", requireAdmin, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(exp);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/experience/:id", requireAdmin, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    return res.json({ message: "Experience deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ sort_order: 1 });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/projects", requireAdmin, async (req, res) => {
  try {
    const proj = new Project(req.body);
    await proj.save();
    return res.status(201).json(proj);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const proj = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(proj);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    return res.json({ message: "Project deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Skills
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ sort_order: 1 });
    return res.json(skills);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/skills", requireAdmin, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    return res.status(201).json(skill);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/skills/:id", requireAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(skill);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/skills/:id", requireAdmin, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    return res.json({ message: "Skill group deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Services
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ sort_order: 1 });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/services", requireAdmin, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/services/:id", requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/services/:id", requireAdmin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    return res.json({ message: "Service deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Testimonials
app.get("/api/testimonials", async (req, res) => {
  try {
    const query = { is_approved: true };
    const testimonials = await Testimonial.find(query).sort({ sort_order: 1 });
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/testimonials", async (req, res) => {
  try {
    const testimonial = new Testimonial({ ...req.body, is_approved: false });
    await testimonial.save();
    return res.status(201).json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.patch("/api/testimonials/:id/approve", requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { is_approved: true }, { new: true });
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.put("/api/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    return res.json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Messages
app.post("/api/messages", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ created_at: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.patch("/api/messages/:id/read", requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
    return res.json(message);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.delete("/api/messages/:id", requireAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ message: "Message deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Seed
app.get("/api/seed", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("adminpassword", salt);
      await new User({ email: "admin@example.com", password: hashedPassword, role: "admin" }).save();
    }
    
    // Seed personal info
    const personalCount = await PersonalInfo.countDocuments();
    if (personalCount === 0) {
      await new PersonalInfo({
        name: "Mellimpudi Tejas",
        role: "AIMLDS Engineer & Physicist",
        email: "tejas.mellimpudi@gmail.com",
        location: "Hyderabad, India",
        avatar: "https://github.com/tejastro123.png",
        bio_tagline: "Bridging the gap between Theoretical Physics and Computational Reality.",
        bio_short: "Dual Degree scholar at BITS Pilani engineering the future of Robotics, Space Tech, and Full-Stack Systems.",
        bio_long: "I stand at the convergence of hardware and software. As a Dual Degree student at BITS Pilani, I blend the analytical rigor of Theoretical Physics with the structural precision of Computer Science. Raised in the shadow of launchpads at Sriharikota, my passion for aerospace and robotics is innate. I don't just write code; I build systems that interact with the physical world—from designing Mars Rover avionics to architecting custom Quantum Computing IDEs.",
      }).save();
    }

    // Seed About
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await new About({
        heading: "Beyond the Code",
        content: "My journey isn't defined solely by lines of code. It's about curiosity, endurance, and the pursuit of the unknown.",
        fun_facts: [
          { text: "Sriharikota Native: grew up watching ISRO rocket launches from my backyard.", icon_name: "Rocket" },
          { text: "Hardware Enthusiast: Active core member of the Mars Rover Team & Robotics Club.", icon_name: "Cpu" },
          { text: "Quantum Explorer: Developing custom languages for Quantum simulations.", icon_name: "Terminal" },
          { text: "Sci-Fi Aficionado: Consuming space tech media to fuel real-world innovation.", icon_name: "Globe" },
        ],
      }).save();
    }

    // Seed Social
    const socialCount = await SocialLink.countDocuments();
    if (socialCount === 0) {
      await SocialLink.insertMany([
        { label: "GitHub", href: "https://github.com/tejastro123", icon_name: "Github", color: "hover:text-gray-900 dark:hover:text-white", sort_order: 0 },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/tejas-mellimpudi/", icon_name: "Linkedin", color: "hover:text-[#0077b5]", sort_order: 1 },
        { label: "X (Twitter)", href: "https://x.com/tejas_mellimpudi", icon_name: "X", color: "hover:text-black dark:hover:text-white", sort_order: 2 },
        { label: "Email", href: "mailto:tejas.mellimpudi@gmail.com", icon_name: "Mail", color: "hover:text-red-500", sort_order: 3 },
        { label: "Instagram", href: "https://www.instagram.com/tejas_mellimpudi/", icon_name: "Instagram", color: "hover:text-pink-600", sort_order: 4 },
      ]);
    }

    // Seed Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        { type: "work", title: "Avionics & Electronics Engineer", org: "Vanguard Club (Mars Rover Team)", date: "Nov 2024 – Present", location: "BITS Pilani", description: "Electronics architecture for a Mars Rover prototype.", skills: ["Circuit Design", "PCB Layout", "Power Systems"], sort_order: 0 },
        { type: "education", title: "M.Sc. Physics + B.E. Computer Science", org: "BITS Pilani", date: "2023 – 2028 (Expected)", location: "Pilani, India", description: "Dual Degree Program | CGPA: 8.58/10.0.", skills: ["Quantum Computing", "Algorithms", "Mathematics"], sort_order: 1 }
      ]);
    }

    // Seed Projects
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.insertMany([
        { title: "QUICKIDE", description: "Specialized GUI IDE for quantum programs.", tags: ["Python", "Quantum", "Tkinter"], category: "System Software", demo: "#", github: "https://github.com/tejastro123/QUICKIDE", featured: true, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb", sort_order: 0 }
      ]);
    }

    // Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { title: "Core Programming", icon_name: "Code2", items: [{ name: "C++", level: 95 }, { name: "Python", level: 90 }], sort_order: 0 }
      ]);
    }

    // Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        { title: "Full Stack Engineering", description: "Building scalable web applications from scratch.", icon_name: "Globe", sort_order: 0 }
      ]);
    }

    // Seed Blog
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.insertMany([
        { title: "Quantum Gates Python", slug: "quantum-gates-python", date: "Jan 28, 2026", read_time: "8 min read", excerpt: "Quantum gates simulation.", link: "#", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb", content: "<p>Quantum computing simulation is super interesting...</p>", published: true }
      ]);
    }

    // Seed Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany([
        { name: "Samuel Beckett", role: "Writer", company: "", content: "Ever tried, ever failed, no matter. Try again, fail again, fail better.", is_approved: true, sort_order: 0 }
      ]);
    }

    return res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(\`[Portfolio Service] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/services/portfolio-service/index.ts'), portfolioServiceContent);
console.log('Created backend/services/portfolio-service/index.ts');

// 7. Create Blog Service: backend/services/blog-service/index.ts
const blogServiceContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectDB } from "../../shared/db";
import { requireAdmin } from "../../shared/middleware/auth";
import { BlogPost } from "../../shared/models/BlogPost";

dotenv.config();

const app = express();
const PORT = 5003;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

app.use(cors());
app.use(express.json());

connectDB("Blog-Service");

// Get all blogs
app.get("/api/blog", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let isAdmin = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded && decoded.role === "admin") {
          isAdmin = true;
        }
      } catch (err) {}
    }

    const query = isAdmin ? {} : { published: true };
    const posts = await BlogPost.find(query).sort({ created_at: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Get blog by slug
app.get("/api/blog/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Blog post not found." });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Create blog
app.post("/api/blog", requireAdmin, async (req, res) => {
  try {
    const { title } = req.body;
    let slug = req.body.slug;
    if (!slug && title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const post = new BlogPost({ ...req.body, slug, updated_at: new Date() });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Update blog
app.put("/api/blog/:id", requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Delete blog
app.delete("/api/blog/:id", requireAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    return res.json({ message: "Blog post deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(\`[Blog Service] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/services/blog-service/index.ts'), blogServiceContent);
console.log('Created backend/services/blog-service/index.ts');

// 8. Create AI Service: backend/services/ai-service/index.ts
const aiServiceContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

app.get("/api/ai", (req, res) => {
  res.json({ message: "AI Service running. (Ready for Phase 4 evolution!)" });
});

app.listen(PORT, () => {
  console.log(\`[AI Service] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/services/ai-service/index.ts'), aiServiceContent);
console.log('Created backend/services/ai-service/index.ts');

// 9. Create Analytics Service: backend/services/analytics-service/index.ts
const analyticsServiceContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../../shared/db";
import { requireAdmin } from "../../shared/middleware/auth";
import { AnalyticsEvent } from "../../shared/models/AnalyticsEvent";

dotenv.config();

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());

connectDB("Analytics-Service");

// Track event
app.post("/api/analytics", async (req, res) => {
  try {
    const event = new AnalyticsEvent(req.body);
    await event.save();
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Get analytics dashboard
app.get("/api/analytics", requireAdmin, async (req, res) => {
  try {
    const totalVisits = await AnalyticsEvent.countDocuments({ event_type: "page_view" });
    const totalClicks = await AnalyticsEvent.countDocuments({ event_type: "blog_click" });
    
    const topPaths = await AnalyticsEvent.aggregate([
      { $match: { event_type: "page_view" } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const blogClicks = await AnalyticsEvent.aggregate([
      { $match: { event_type: "blog_click" } },
      { $group: { _id: "$event_label", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const recentEvents = await AnalyticsEvent.find().sort({ created_at: -1 }).limit(20);

    return res.json({
      summary: { totalVisits, totalClicks },
      topPaths,
      blogClicks,
      recentEvents,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(\`[Analytics Service] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/services/analytics-service/index.ts'), analyticsServiceContent);
console.log('Created backend/services/analytics-service/index.ts');

// 10. Create Notification Service: backend/services/notification-service/index.ts
const notificationServiceContent = `import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

app.get("/api/notification", (req, res) => {
  res.json({ message: "Notification Service running. (Ready for event processing!)" });
});

app.listen(PORT, () => {
  console.log(\`[Notification Service] Running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join(rootDir, 'backend/services/notification-service/index.ts'), notificationServiceContent);
console.log('Created backend/services/notification-service/index.ts');

console.log('Backend directory setup completely finished!');
