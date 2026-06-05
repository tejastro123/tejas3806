import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { traceContext, logger } from "../logger";

export const traceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Extract trace ID from request headers or generate a new one
  const traceId = (req.headers["x-trace-id"] as string) || crypto.randomUUID();

  // Expose trace ID back in the response headers
  res.setHeader("x-trace-id", traceId);

  // Run the request execution path inside the AsyncLocalStorage scope
  traceContext.run(traceId, () => {
    logger.info(`Started ${req.method} ${req.originalUrl || req.url}`, {
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"]
    });

    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(`Finished ${req.method} ${req.originalUrl || req.url} - Status ${res.statusCode}`, {
        durationMs: duration,
        status: res.statusCode
      });
    });

    next();
  });
};
