import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";
import staffRoutes from "./staff.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "afari-trails-api",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

router.use("/auth", authRoutes);
router.use("/staff", staffRoutes);
router.use("/content", contentRoutes);

export default router;
