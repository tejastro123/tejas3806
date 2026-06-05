import { Express } from "express";
import mongoose from "mongoose";
import { logger } from "./logger";

let requestCount = 0;
let errorCount = 0;

export const bootstrapObservability = (app: Express, serviceName: string) => {
  // Global request metrics interceptor
  app.use((req, res, next) => {
    requestCount++;
    res.on("finish", () => {
      if (res.statusCode >= 400) {
        errorCount++;
      }
    });
    next();
  });

  // Uptime & Health endpoint
  app.get("/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = ["disconnected", "connected", "connecting", "disconnecting"];
    
    const isHealthy = dbState === 1 || dbState === 2 || serviceName === "API Gateway";

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "healthy" : "unhealthy",
      service: serviceName,
      timestamp: new Date().toISOString(),
      database: serviceName !== "API Gateway" ? dbStatusMap[dbState] : undefined,
      uptime: process.uptime()
    });
  });

  // Real-time system performance telemetry endpoint
  app.get("/metrics", (req, res) => {
    const memory = process.memoryUsage();
    res.json({
      service: serviceName,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      requests: {
        total: requestCount,
        errors: errorCount
      },
      system: {
        cpu: process.cpuUsage(),
        memory: {
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100, // MB
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100, // MB
          rss: Math.round(memory.rss / 1024 / 1024 * 100) / 100 // MB
        }
      }
    });
  });

  logger.info(`Observability endpoints bootstrapped on ${serviceName} (/health, /metrics)`);
};
