import { Router } from "express";
import * as contentController from "../controllers/content.controller.js";
import { requireJwt } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";

const router = Router();

router.get("/homepage", contentController.getHomepage);
router.put(
  "/homepage",
  requireJwt,
  requirePermission("content:homepage:write"),
  contentController.updateHomepage,
);

router.get("/ventures", contentController.listVentures);
router.get("/ventures/:slug", contentController.getVenture);
router.put(
  "/ventures/:slug",
  requireJwt,
  requirePermission("content:ventures:write"),
  contentController.updateVenture,
);

export default router;
