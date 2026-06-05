import { Schema, model } from "mongoose";

const analyticsEventSchema = new Schema({
  event_type: { type: String, required: true }, // "page_view", "click", "session_ping"
  event_label: { type: String, default: "" },
  path: { type: String, default: "" },
  referrer: { type: String, default: "" },
  user_agent: { type: String, default: "" },
  device_type: { type: String, default: "Desktop" },
  geo: {
    country: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },
    countryCode: { type: String, default: "XX" }
  },
  session_id: { type: String, default: "" },
  duration: { type: Number, default: 0 }, // session duration in seconds
  metadata: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
});

export const AnalyticsEvent = model("AnalyticsEvent", analyticsEventSchema);
