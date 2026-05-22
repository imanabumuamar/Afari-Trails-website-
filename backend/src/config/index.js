import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI ?? "",
  jwt: {
    secret: process.env.JWT_SECRET ?? "dev-only-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  adminSecret: process.env.ADMIN_SECRET ?? "",
};
