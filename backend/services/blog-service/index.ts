import express from "express";
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
  console.log(`[Blog Service] Running on port ${PORT}`);
});
