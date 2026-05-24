import mongoose from "mongoose";
import { config } from "./index.js";

export async function connectDatabase() {
  if (!config.mongodbUri) {
    throw new Error(
      "MONGODB_URI is not set. Copy backend/.env.example to backend/.env and start MongoDB.",
    );
  }

  await mongoose.connect(config.mongodbUri);
  console.log("[db] Connected to MongoDB");
  return mongoose.connection;
}
