import { Schema, model } from "mongoose";

const personalInfoSchema = new Schema({
  name: { type: String, default: "" },
  role: { type: String, default: "" },
  email: { type: String, default: "" },
  location: { type: String, default: "" },
  avatar: { type: String, default: "" },
  bio_tagline: { type: String, default: "" },
  bio_short: { type: String, default: "" },
  bio_long: { type: String, default: "" },
  updated_at: { type: Date, default: Date.now },
});

export const PersonalInfo = model("PersonalInfo", personalInfoSchema);
