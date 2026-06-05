import { Schema, model } from "mongoose";

const skillSchema = new Schema({
  title: { type: String, required: true },
  icon_name: { type: String, default: "Code2" },
  items: { type: Schema.Types.Mixed, default: [] }, // Array of skill objects or items
  sort_order: { type: Number, default: 0 },
});

export const Skill = model("Skill", skillSchema);
