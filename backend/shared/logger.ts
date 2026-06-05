import { AsyncLocalStorage } from "async_hooks";

// Context to store request-scoped Trace IDs
export const traceContext = new AsyncLocalStorage<string>();

export const logger = {
  getTraceId(): string | undefined {
    return traceContext.getStore();
  },

  info(message: string, meta: Record<string, any> = {}) {
    this.log("INFO", message, meta);
  },

  warn(message: string, meta: Record<string, any> = {}) {
    this.log("WARN", message, meta);
  },

  error(message: string, error?: Error | unknown, meta: Record<string, any> = {}) {
    const errorMeta = error instanceof Error 
      ? { errorMessage: error.message, errorStack: error.stack } 
      : { error };
    this.log("ERROR", message, { ...meta, ...errorMeta });
  },

  private log(level: "INFO" | "WARN" | "ERROR", message: string, meta: Record<string, any> = {}) {
    const traceId = this.getTraceId();
    const timestamp = new Date().toISOString();
    
    // Structured JSON logging format
    const logPayload = {
      timestamp,
      level,
      traceId: traceId || "system",
      message,
      ...meta
    };

    // Human-readable colored console output in development
    if (process.env.NODE_ENV !== "production") {
      const colors = {
        INFO: "\x1b[36m",  // Cyan
        WARN: "\x1b[33m",  // Yellow
        ERROR: "\x1b[31m"  // Red
      };
      const resetColor = "\x1b[0m";
      const traceTag = traceId ? `[Trace: ${traceId.slice(0, 8)}] ` : "";
      
      console.log(
        `${timestamp} ${colors[level]}${level}${resetColor}: ${traceTag}${message}`,
        Object.keys(meta).length > 0 ? JSON.stringify(meta) : ""
      );
    } else {
      // In production, emit raw JSON for log collectors (Loki/ES/etc)
      console.log(JSON.stringify(logPayload));
    }
  }
};
