import { AuditLog } from "../models/AuditLog";

export interface AuditLogOptions {
  userId?: string;
  email?: string;
  action: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export const logAudit = async (options: AuditLogOptions): Promise<void> => {
  try {
    const log = new AuditLog({
      userId: options.userId,
      email: options.email,
      action: options.action,
      details: options.details || {},
      ip: options.ip || "127.0.0.1",
      userAgent: options.userAgent || "Server",
      timestamp: new Date(),
    });
    await log.save();
    console.log(`🛡️  [Audit Log] ${options.action} - ${options.email || "System"} - ${JSON.stringify(options.details || {})}`);
  } catch (err: any) {
    console.error(`❌ [Audit Logger] Failed to save audit log:`, err.message);
  }
};
