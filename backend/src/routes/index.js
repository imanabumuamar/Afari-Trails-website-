import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";
import staffRoutes from "./staff.routes.js";

const router = Router();

router.get("/health", async (_req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  let cms = null;

  if (dbOk) {
    const db = mongoose.connection.db;
    const [homepage, expeditions, journal, archive, about, ventures] =
      await Promise.all([
        db.collection("homepagecontents").countDocuments({ slug: "main" }),
        db.collection("expeditioncontents").countDocuments({ key: "main" }),
        db.collection("journalcontents").countDocuments({ key: "main" }),
        db.collection("archivecontents").countDocuments({ key: "main" }),
        db.collection("aboutcontents").countDocuments({ key: "main" }),
        db.collection("venturecontents").countDocuments(),
      ]);

    cms = { homepage, expeditions, journal, archive, about, ventures };
  }

  res.json({
    status: dbOk ? "ok" : "degraded",
    service: "afari-trails-api",
    database: dbOk ? "connected" : "disconnected",
    cms,
  });
});

router.use("/auth", authRoutes);
router.use("/staff", staffRoutes);
router.use("/content", contentRoutes);

export default router;
