import { Schema, model } from "mongoose";

const aboutSchema = new Schema({
  heading: { type: String, default: "" },
  content: { type: String, default: "" },
  fun_facts: { type: Schema.Types.Mixed, default: [] }, // Array of strings or objects
  updated_at: { type: Date, default: Date.now },
});

export const About = model("About", aboutSchema);
