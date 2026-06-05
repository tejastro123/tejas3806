import { Schema, model } from "mongoose";

const socialLinkSchema = new Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  icon_name: { type: String, required: true },
  color: { type: String, default: "" },
  sort_order: { type: Number, default: 0 },
});

export const SocialLink = model("SocialLink", socialLinkSchema);
