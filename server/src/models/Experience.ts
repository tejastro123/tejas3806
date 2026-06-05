import { Schema, model } from "mongoose";

const experienceSchema = new Schema({
  type: { type: String, enum: ["work", "education"], default: "work" },
  title: { type: String, required: true },
  org: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  skills: { type: [String], default: [] },
  sort_order: { type: Number, default: 0 },
});

export const Experience = model("Experience", experienceSchema);
