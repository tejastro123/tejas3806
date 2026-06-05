import http from "http";
import { Kafka } from "kafkajs";

export interface EventEnvelope {
  event: string;
  data: any;
}

const kafkaBrokers = process.env.KAFKA_BROKERS;
let kafkaProducer: any = null;
let kafkaInstance: any = null;

if (kafkaBrokers) {
  console.log(`🔌 [EventBus] Initializing Kafka client with brokers: ${kafkaBrokers}...`);
  try {
    const brokersList = kafkaBrokers.split(",");
    kafkaInstance = new Kafka({
      clientId: "portfolio-platform",
      brokers: brokersList,
      connectionTimeout: 3000,
    });
    kafkaProducer = kafkaInstance.producer();
    kafkaProducer.connect()
      .then(() => console.log("✅ [EventBus] Kafka Producer connected successfully."))
      .catch((err: any) => console.warn("⚠️ [EventBus] Kafka Producer connection failed:", err.message));
  } catch (err: any) {
    console.warn("⚠️ [EventBus] Kafka initialization failed:", err.message);
  }
} else {
  console.log("ℹ️ [EventBus] KAFKA_BROKERS not configured. Using HTTP Event Routing fallback.");
}

export const publishEvent = async (event: string, data: any): Promise<void> => {
  if (kafkaProducer) {
    try {
      const payload = { event, data, timestamp: new Date().toISOString() };
      await kafkaProducer.send({
        topic: "portfolio-events",
        messages: [
          {
            key: event,
            value: JSON.stringify(payload),
          },
        ],
      });
      console.log(`[EventBus] Published event "${event}" to Kafka topic "portfolio-events"`);
      return;
    } catch (err: any) {
      console.error(`[EventBus] Kafka send error: ${err.message}. Falling back to HTTP.`);
    }
  }

  return new Promise((resolve) => {
    const payload = JSON.stringify({ event, data });
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/internal/events",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      res.resume();
      resolve();
    });

    req.on("error", (err) => {
      console.error(`[EventBusClient] Publish error for event "${event}": ${err.message}`);
      resolve();
    });

    req.write(payload);
    req.end();
  });
};

/**
 * Register a listener for background event consumption (useful for Kafka).
 * For HTTP fallback, the express app already listens on "/api/internal/events".
 */
export const registerEventConsumer = async (
  serviceName: string,
  handlers: Record<string, (data: any) => Promise<void> | void>
): Promise<void> => {
  if (kafkaInstance) {
    try {
      const consumer = kafkaInstance.consumer({ groupId: `${serviceName}-group` });
      await consumer.connect();
      await consumer.subscribe({ topic: "portfolio-events", fromBeginning: false });

      console.log(`📥 [EventBus] Kafka Consumer for "${serviceName}" listening on "portfolio-events"...`);

      await consumer.run({
        eachMessage: async ({ message }: any) => {
          try {
            const rawValue = message.value?.toString();
            if (!rawValue) return;

            const envelope = JSON.parse(rawValue);
            const { event, data } = envelope;

            if (handlers[event]) {
              console.log(`[EventBus Kafka] Triggering handler for event "${event}" in service "${serviceName}"`);
              await handlers[event](data);
            }
          } catch (handlerErr: any) {
            console.error(`[EventBus Kafka Consumer] Error executing handler:`, handlerErr.message);
          }
        },
      });
    } catch (err: any) {
      console.error(`⚠️ [EventBus] Failed to initialize Kafka Consumer for "${serviceName}":`, err.message);
    }
  }
};
