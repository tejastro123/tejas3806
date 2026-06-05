import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connectDB } from "../../shared/db";
import { requireAdmin, AuthenticatedRequest } from "../../shared/middleware/auth";
import { BlogPost } from "../../shared/models/BlogPost";
import { cache } from "../../shared/cache";
import { publishEvent } from "../../shared/eventBus";
import { logAudit } from "../../shared/utils/auditLogger";
import { traceMiddleware } from "../../shared/middleware/trace";
import { bootstrapObservability } from "../../shared/observability";

dotenv.config();

const app = express();
const PORT = 5003;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

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
bootstrapObservability(app, "Blog Service");

connectDB("Blog-Service");

// Get all blogs
app.get("/api/blog", async (req, res) => {
  try {
    let token = req.cookies?.accessToken;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }
    let isAdmin = false;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded && decoded.role === "admin") {
          isAdmin = true;
        }
      } catch (err) {}
    }

    const cacheKey = `blog:list:${isAdmin}`;
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(cached);

    const query = isAdmin ? {} : { published: true };
    const posts = await BlogPost.find(query).sort({ created_at: -1 });
    await cache.set(cacheKey, posts, 1800); // 30 minutes
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Get blog by slug
app.get("/api/blog/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `blog:post:${slug}`;
    const cached = await cache.get<any>(cacheKey);
    
    let post = cached;
    if (!post) {
      post = await BlogPost.findOne({ slug });
      if (!post) {
        return res.status(404).json({ error: "Blog post not found." });
      }
      await cache.set(cacheKey, post, 1800);
    }

    // Publish view and click events
    publishEvent("page_view", { path: `/blog/${slug}`, referrer: req.headers.referer || "" });
    publishEvent("blog_click", { slug, title: post.title });

    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

const triggerSearchReindex = async () => {
  try {
    const res = await fetch("http://localhost:5002/api/internal/search-reindex", {
      method: "POST"
    });
    if (res.ok) {
      console.log("[Blog Service] Successfully requested global search index rebuild.");
    }
  } catch (err: any) {
    console.error("[Blog Service] Failed to trigger global search index rebuild:", err.message);
  }
};

// Create blog
app.post("/api/blog", requireAdmin, async (req: AuthenticatedRequest, res) => {
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
    
    // Clear cache
    await cache.del("blog:list:true");
    await cache.del("blog:list:false");
    
    await logAudit({
      action: "BLOG_CREATE",
      userId: req.user?.id,
      email: req.user?.email,
      details: { id: post._id, title: post.title, slug: post.slug },
      ip: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "Unknown"
    });

    triggerSearchReindex();

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Update blog
app.put("/api/blog/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (post) {
      // Clear cache
      await cache.del("blog:list:true");
      await cache.del("blog:list:false");
      await cache.del(`blog:post:${post.slug}`);

      await logAudit({
        action: "BLOG_UPDATE",
        userId: req.user?.id,
        email: req.user?.email,
        details: { id: post._id, title: post.title, slug: post.slug },
        ip: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Unknown"
      });

      triggerSearchReindex();
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Delete blog
app.delete("/api/blog/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (post) {
      // Clear cache
      await cache.del("blog:list:true");
      await cache.del("blog:list:false");
      await cache.del(`blog:post:${post.slug}`);

      await logAudit({
        action: "BLOG_DELETE",
        userId: req.user?.id,
        email: req.user?.email,
        details: { id: post._id, title: post.title },
        ip: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Unknown"
      });

      triggerSearchReindex();
    }
    return res.json({ message: "Blog post deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[Blog Service] Running on port ${PORT}`);
});
