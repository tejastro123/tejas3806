import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  icon_name: { type: String, default: "Globe" },
  sort_order: { type: Number, default: 0 },
});

export const Service = model("Service", serviceSchema);
