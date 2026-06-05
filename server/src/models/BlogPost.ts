import { Schema, model } from "mongoose";

const blogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, default: "" },
  read_time: { type: String, default: "" },
  excerpt: { type: String, default: "" },
  link: { type: String, default: "#" },
  image: { type: String, default: "" },
  content: { type: String, default: "" },
  published: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const BlogPost = model("BlogPost", blogPostSchema);
