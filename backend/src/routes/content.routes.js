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

router.get("/expeditions", contentController.getExpeditions);
router.put(
  "/expeditions",
  requireJwt,
  requirePermission("content:expeditions:write"),
  contentController.updateExpeditions,
);

router.get("/journal", contentController.getJournal);
router.put(
  "/journal",
  requireJwt,
  requirePermission("content:journal:write"),
  contentController.updateJournal,
);

router.get("/archive", contentController.getArchive);
router.put(
  "/archive",
  requireJwt,
  requirePermission("content:archive:write"),
  contentController.updateArchive,
);

router.get("/about", contentController.getAbout);
router.put(
  "/about",
  requireJwt,
  requirePermission("content:about:write"),
  contentController.updateAbout,
);

router.get("/store", contentController.getStore);
router.put(
  "/store",
  requireJwt,
  requirePermission("content:store:write"),
  contentController.updateStore,
);

router.get("/support", contentController.getSupport);
router.put(
  "/support",
  requireJwt,
  requirePermission("content:support:write"),
  contentController.updateSupport,
);

router.get("/connect", contentController.getConnect);
router.put(
  "/connect",
  requireJwt,
  requirePermission("content:connect:write"),
  contentController.updateConnect,
);

export default router;
