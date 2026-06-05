import express from "express";
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
  console.log(`[Analytics Service] Running on port ${PORT}`);
});
