import mongoose from "mongoose";
import { config } from "./index.js";

export async function connectDatabase() {
  if (!config.mongodbUri) {
    console.warn("[db] MONGODB_URI not set — API runs without database");
    return null;
  }

  await mongoose.connect(config.mongodbUri);
  console.log("[db] Connected to MongoDB");
  return mongoose.connection;
}
