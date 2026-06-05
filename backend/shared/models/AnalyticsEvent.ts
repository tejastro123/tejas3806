import { Schema, model } from "mongoose";

const analyticsEventSchema = new Schema({
  event_type: { type: String, required: true },
  event_label: { type: String, default: "" },
  path: { type: String, default: "" },
  referrer: { type: String, default: "" },
  user_agent: { type: String, default: "" },
  session_id: { type: String, default: "" },
  metadata: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
});

export const AnalyticsEvent = model("AnalyticsEvent", analyticsEventSchema);
