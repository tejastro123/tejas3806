import { Schema, model } from "mongoose";

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  content: { type: String, required: true },
  avatar_url: { type: String, default: "" },
  is_approved: { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

export const Testimonial = model("Testimonial", testimonialSchema);
