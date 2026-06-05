import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireAdmin, requireAuth, AuthenticatedRequest } from "../middleware/auth";

// Models
import { User } from "../models/User";
import { PersonalInfo } from "../models/PersonalInfo";
import { SocialLink } from "../models/SocialLink";
import { About } from "../models/About";
import { Experience } from "../models/Experience";
import { Project } from "../models/Project";
import { Skill } from "../models/Skill";
import { Service } from "../models/Service";
import { BlogPost } from "../models/BlogPost";
import { Testimonial } from "../models/Testimonial";
import { Message } from "../models/Message";
import { AnalyticsEvent } from "../models/AnalyticsEvent";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

// ---------------------------------------------------------
// 1. Authentication Routes
// ---------------------------------------------------------

// Register first admin (or subsequent ones)
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (first user gets admin role automatically)
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
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate Token
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
router.get("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
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

// ---------------------------------------------------------
// 2. Personal Info Routes
// ---------------------------------------------------------
router.get("/personal-info", async (req, res) => {
  try {
    let info = await PersonalInfo.findOne();
    if (!info) {
      // Create a default one if it doesn't exist
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

router.put("/personal-info", requireAdmin, async (req, res) => {
  try {
    const info = await PersonalInfo.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    return res.json(info);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 3. Social Links Routes
// ---------------------------------------------------------
router.get("/social-links", async (req, res) => {
  try {
    const links = await SocialLink.find().sort({ sort_order: 1 });
    return res.json(links);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/social-links", requireAdmin, async (req, res) => {
  try {
    const link = new SocialLink(req.body);
    await link.save();
    return res.status(201).json(link);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/social-links/:id", requireAdmin, async (req, res) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(link);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/social-links/:id", requireAdmin, async (req, res) => {
  try {
    await SocialLink.findByIdAndDelete(req.params.id);
    return res.json({ message: "Social link deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 4. About Routes
// ---------------------------------------------------------
router.get("/about", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({
        heading: "Beyond the Code",
        content: "My journey isn't defined solely by lines of code.",
        fun_facts: [],
      });
      await about.save();
    }
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/about", requireAdmin, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    return res.json(about);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 5. Experience Routes
// ---------------------------------------------------------
router.get("/experience", async (req, res) => {
  try {
    const experience = await Experience.find().sort({ sort_order: 1 });
    return res.json(experience);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/experience", requireAdmin, async (req, res) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    return res.status(201).json(exp);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/experience/:id", requireAdmin, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(exp);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/experience/:id", requireAdmin, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    return res.json({ message: "Experience deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 6. Projects Routes
// ---------------------------------------------------------
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ sort_order: 1 });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/projects", requireAdmin, async (req, res) => {
  try {
    const proj = new Project(req.body);
    await proj.save();
    return res.status(201).json(proj);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  try {
    const proj = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(proj);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/projects/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    return res.json({ message: "Project deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 7. Skills Routes
// ---------------------------------------------------------
router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ sort_order: 1 });
    return res.json(skills);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/skills", requireAdmin, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    return res.status(201).json(skill);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/skills/:id", requireAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(skill);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/skills/:id", requireAdmin, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    return res.json({ message: "Skill group deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 8. Services Routes
// ---------------------------------------------------------
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ sort_order: 1 });
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/services", requireAdmin, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/services/:id", requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    return res.json({ message: "Service deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 9. Blog Routes
// ---------------------------------------------------------
router.get("/blog", async (req, res) => {
  try {
    // If request contains authorization, check if it's admin to show all posts
    const authHeader = req.headers.authorization;
    let isAdmin = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded && decoded.role === "admin") {
          isAdmin = true;
        }
      } catch (err) {
        // Token is invalid/expired, act as public reader
      }
    }

    const query = isAdmin ? {} : { published: true };
    const posts = await BlogPost.find(query).sort({ created_at: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/blog/:slug", async (req, res) => {
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

router.post("/blog", requireAdmin, async (req, res) => {
  try {
    const { title } = req.body;
    let slug = req.body.slug;
    if (!slug && title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const post = new BlogPost({
      ...req.body,
      slug,
      updated_at: new Date(),
    });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/blog/:id", requireAdmin, async (req, res) => {
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

router.delete("/blog/:id", requireAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    return res.json({ message: "Blog post deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 10. Testimonials Routes
// ---------------------------------------------------------
router.get("/testimonials", async (req, res) => {
  try {
    // If admin is requesting, send all. Otherwise, send approved testimonials
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

    const query = isAdmin ? {} : { is_approved: true };
    const testimonials = await Testimonial.find(query).sort({ sort_order: 1 });
    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    const testimonial = new Testimonial({
      ...req.body,
      is_approved: false, // Default requires admin approval
    });
    await testimonial.save();
    return res.status(201).json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.patch("/testimonials/:id/approve", requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { is_approved: true },
      { new: true }
    );
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    return res.json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 11. Messages (Contact Form) Routes
// ---------------------------------------------------------
router.post("/messages", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const newMessage = new Message({
      name,
      email,
      message,
    });
    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/messages", requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ created_at: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.patch("/messages/:id/read", requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );
    return res.json(message);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/messages/:id", requireAdmin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ message: "Message deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 12. Analytics Routes
// ---------------------------------------------------------
router.post("/analytics", async (req, res) => {
  try {
    const event = new AnalyticsEvent(req.body);
    await event.save();
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/analytics", requireAdmin, async (req, res) => {
  try {
    const totalVisits = await AnalyticsEvent.countDocuments({ event_type: "page_view" });
    const totalClicks = await AnalyticsEvent.countDocuments({ event_type: "blog_click" });
    
    // Top visited paths
    const topPaths = await AnalyticsEvent.aggregate([
      { $match: { event_type: "page_view" } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Click events count by label
    const blogClicks = await AnalyticsEvent.aggregate([
      { $match: { event_type: "blog_click" } },
      { $group: { _id: "$event_label", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const recentEvents = await AnalyticsEvent.find().sort({ created_at: -1 }).limit(20);

    return res.json({
      summary: {
        totalVisits,
        totalClicks,
      },
      topPaths,
      blogClicks,
      recentEvents,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ---------------------------------------------------------
// 13. Seeding Route
// ---------------------------------------------------------
router.get("/seed", async (req, res) => {
  try {
    // 0. Seed Admin User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("adminpassword", salt);
      await new User({
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      }).save();
    }

    // 1. Seed Personal Info
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

    // 2. Seed About Section
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

    // 3. Seed Social Links
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

    // 4. Seed Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        {
          type: "work",
          title: "Avionics & Electronics Engineer",
          org: "Vanguard Club (Mars Rover Team)",
          date: "Nov 2024 – Present",
          location: "BITS Pilani",
          description: "Spearheading the electronics architecture for a next-gen Mars Rover prototype.",
          skills: ["Circuit Design", "PCB Layout", "Power Systems", "Embedded C"],
          sort_order: 0
        },
        {
          type: "work",
          title: "Robotics Engineer",
          org: "Robotics Club (ARC)",
          date: "Sep 2023 – Present",
          location: "BITS Pilani",
          description: "Engineered combat-ready robots and precision autonomous bots.",
          skills: ["C++", "Arduino", "Motor Drivers", "Actuators"],
          sort_order: 1
        },
        {
          type: "education",
          title: "M.Sc. Physics + B.E. Computer Science",
          org: "BITS Pilani",
          date: "2023 – 2028 (Expected)",
          location: "Pilani, India",
          description: "Dual Degree Program | CGPA: 8.58/10.0.",
          skills: ["Quantum Computing", "Algorithms", "Mathematics"],
          sort_order: 2
        }
      ]);
    }

    // 5. Seed Projects
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.insertMany([
        {
          title: "QUICKIDE",
          description: "A specialized lightweight GUI IDE designed for writing, visualizing, and simulating quantum programs.",
          tags: ["Python", "Quantum Computing", "Tkinter", "Compiler Design"],
          category: "System Software",
          demo: "#",
          github: "https://github.com/tejastro123/QUICKIDE",
          featured: true,
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
          sort_order: 0
        },
        {
          title: "LIVEMART",
          description: "A comprehensive full-stack e-commerce ecosystem featuring real-time inventory updates.",
          tags: ["React", "Node.js", "Express", "MongoDB"],
          category: "Full Stack",
          demo: "https://livemart-main.vercel.app",
          github: "https://github.com/tejastro123/LIVEMART",
          featured: true,
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000",
          sort_order: 1
        }
      ]);
    }

    // 6. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        {
          title: "Core Programming",
          icon_name: "Code2",
          items: [
            { name: "C++ (STL)", level: 95 },
            { name: "Python", level: 90 },
            { name: "JavaScript/ES6+", level: 85 },
            { name: "TypeScript", level: 80 }
          ],
          sort_order: 0
        },
        {
          title: "Full Stack Development",
          icon_name: "Laptop",
          items: [
            { name: "React.js", level: 85 },
            { name: "Node.js & Express", level: 80 },
            { name: "MongoDB", level: 75 },
            { name: "Django", level: 65 }
          ],
          sort_order: 1
        }
      ]);
    }

    // 7. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        { title: "Full Stack Engineering", description: "Building scalable web applications from scratch using the MERN stack and Django.", icon_name: "Globe", sort_order: 0 },
        { title: "AI ML DS", description: "Building AI, ML, and Data Science models from scratch. Implementing custom algorithms.", icon_name: "Cpu", sort_order: 1 }
      ]);
    }

    // 8. Seed Blog Posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.insertMany([
        {
          title: "From Code to Combat: Building the Monster Robowar Bot",
          slug: "from-code-to-combat-building-the-monster-robowar-bot",
          date: "Feb 12, 2026",
          read_time: "5 min read",
          excerpt: "A deep dive into the motor drivers, power distribution, and structural challenges.",
          link: "#",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
          content: "<p>This is a detailed write-up on constructing the combat bot...</p>",
          published: true
        },
        {
          title: "Simulating Quantum Gates with Python",
          slug: "simulating-quantum-gates-with-python",
          date: "Jan 28, 2026",
          read_time: "8 min read",
          excerpt: "How I built a custom interpreter to visualize quantum superposition.",
          link: "#",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
          content: "<p>Quantum computing simulation is super interesting...</p>",
          published: true
        }
      ]);
    }

    // 9. Seed Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany([
        { name: "Samuel Beckett", role: "Writer", company: "", content: "Ever tried, ever failed, no matter. Try again, fail again, fail better.", is_approved: true, sort_order: 0 },
        { name: "Sir Arthur C. Clarke", role: "Writer", company: "", content: "Only those who will risk going too far can possibly find out how far one can go.", is_approved: true, sort_order: 1 }
      ]);
    }

    return res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
