import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "afari-trails-api" });
});

router.use("/auth", authRoutes);
router.use("/content", contentRoutes);

export default router;
