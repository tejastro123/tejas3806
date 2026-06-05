import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

export const User = model("User", userSchema);
