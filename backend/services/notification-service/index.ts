import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { traceMiddleware } from "../../shared/middleware/trace";
import { bootstrapObservability } from "../../shared/observability";

dotenv.config();

const app = express();
const PORT = 5006;

app.use(cors());
app.use(express.json());

// Apply global request-scoped tracing middleware
app.use(traceMiddleware);

// Bootstrap Observability health check and system performance metrics
bootstrapObservability(app, "Notification Service");

app.get("/api/notification", (req, res) => {
  res.json({ message: "Notification Service running. (Ready for event processing!)" });
});

// Internal endpoint to consume published event bus events
app.post("/api/internal/events", async (req, res) => {
  try {
    const { event, data } = req.body;
    console.log(`[Notification Service Event Handler] Received event "${event}"`);

    if (event === "contact_message") {
      const { name, email, message } = data;
      console.log(`\n======================================================`);
      console.log(`[Notification Service] 📧 SIMULATED CONTACT FORM EMAIL`);
      console.log(`======================================================`);
      console.log(`To: Owner <tejas.mellimpudi@gmail.com>`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: New Portfolio Contact Form Submission`);
      console.log(`Message:\n"${message}"`);
      console.log(`======================================================\n`);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(`[Notification Service] Error processing event: ${(error as Error).message}`);
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`[Notification Service] Running on port ${PORT}`);
});

// Kafka Consumer Integration
import { registerEventConsumer } from "../../shared/eventBus";

const eventHandlers = {
  contact_message: async (data: any) => {
    try {
      const { name, email, message } = data;
      console.log(`\n======================================================`);
      console.log(`[Notification Service Kafka Handler] 📧 KAFKA CONTACT FORM EMAIL`);
      console.log(`======================================================`);
      console.log(`To: Owner <tejas.mellimpudi@gmail.com>`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: New Portfolio Contact Form Submission`);
      console.log(`Message:\n"${message}"`);
      console.log(`======================================================\n`);
    } catch (err: any) {
      console.error("[Notification Service Kafka Handler] Error executing handler:", err.message);
    }
  }
};

registerEventConsumer("notification-service", eventHandlers);

