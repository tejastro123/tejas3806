import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
  category: { type: String, default: "" },
  demo: { type: String, default: "#" },
  github: { type: String, default: "" },
  image: { type: String, default: "" },
  featured: { type: Boolean, default: false },
  sort_order: { type: Number, default: 0 },
});

export const Project = model("Project", projectSchema);
