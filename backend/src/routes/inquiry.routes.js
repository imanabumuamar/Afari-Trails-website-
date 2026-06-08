import { Router } from "express";
import * as inquiryController from "../controllers/inquiry.controller.js";
import { requireJwt } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";

const router = Router();

router.post("/", inquiryController.submitInquiry);
router.get(
  "/",
  requireJwt,
  requireRole("admin", "super_admin"),
  inquiryController.listInquiries,
);
router.patch(
  "/:id",
  requireJwt,
  requireRole("admin", "super_admin"),
  inquiryController.patchInquiry,
);
router.delete(
  "/:id",
  requireJwt,
  requireRole("admin", "super_admin"),
  inquiryController.deleteInquiry,
);

export default router;
