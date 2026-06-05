import { Schema, model } from "mongoose";

const auditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  email: { type: String, required: false },
  action: { type: String, required: true },
  details: { type: Schema.Types.Mixed, default: {} },
  ip: { type: String, default: "127.0.0.1" },
  userAgent: { type: String, default: "Server" },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLog = model("AuditLog", auditLogSchema);
