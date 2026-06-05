import mongoose from "mongoose";

export const connectDB = async (serviceName: string) => {
  try {
    const connString = process.env.MONGODB_URI;
    if (!connString) {
      console.error(`[${serviceName}] MONGODB_URI is not defined in env.`);
      process.exit(1);
    }
    const conn = await mongoose.connect(connString);
    console.log(`[${serviceName}] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[${serviceName}] MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
