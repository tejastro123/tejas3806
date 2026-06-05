import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import helmet from "helmet";
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

import { searchEngine, SearchDocument } from "../../shared/searchEngine";
import { traceMiddleware } from "../../shared/middleware/trace";
import { bootstrapObservability } from "../../shared/observability";

dotenv.config();

const app = express();
const PORT = 5002;

app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Apply global request-scoped tracing middleware
app.use(traceMiddleware);

// Bootstrap Observability health check and system performance metrics
bootstrapObservability(app, "Portfolio Service");

connectDB("Portfolio-Service").then(() => {
  setTimeout(reindexSearchData, 6000);
});

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
  console.log(`[Portfolio Service] Running on port ${PORT}`);
});

// Search Engine Reindexing and API Endpoints
async function reindexSearchData() {
  try {
    console.log("[Portfolio Service] Ingesting documents into Search Engine...");
    await searchEngine.clear();

    const documents: SearchDocument[] = [];

    // 1. Projects
    const projects = await Project.find();
    for (const p of projects) {
      documents.push({
        id: `proj_${p._id}`,
        title: p.title,
        content: p.description,
        type: "project",
        url: "/#projects",
      });
    }

    // 2. Experiences
    const experiences = await Experience.find();
    for (const e of experiences) {
      documents.push({
        id: `exp_${e._id}`,
        title: e.title,
        content: `${e.org} - ${e.description}`,
        type: "experience",
        url: "/#about",
      });
    }

    // 3. Blog Posts (only published)
    const blogs = await BlogPost.find({ published: true });
    for (const b of blogs) {
      documents.push({
        id: `blog_${b._id}`,
        title: b.title,
        content: `${b.excerpt || ""} ${b.content || ""}`.replace(/<[^>]*>/g, ""), // strip HTML
        type: "blog",
        url: `/blog/${b.slug}`,
      });
    }

    // 4. Skills
    const skills = await Skill.find();
    for (const s of skills) {
      documents.push({
        id: `skill_${s._id}`,
        title: s.title,
        content: s.items.map((item) => item.name).join(", "),
        type: "skill",
        url: "/#skills",
      });
    }

    await searchEngine.indexDocuments(documents);
    console.log(`[Portfolio Service] Search reindexing complete. Indexed ${documents.length} entries.`);
  } catch (err: any) {
    console.error("[Portfolio Service] Search reindexing failed:", err.message);
  }
}

// Global Search API
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      return res.json([]);
    }
    const results = await searchEngine.search(q, { limit: 10 });
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Re-index Search
app.post("/api/search/reindex", requireAdmin, async (req, res) => {
  try {
    await reindexSearchData();
    return res.json({ success: true, message: "Search index rebuilt successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Internal endpoint to trigger search reindexing
app.post("/api/internal/search-reindex", async (req, res) => {
  try {
    await reindexSearchData();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});
