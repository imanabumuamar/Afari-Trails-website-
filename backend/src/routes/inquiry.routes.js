import { Router } from "express";
import * as inquiryController from "../controllers/inquiry.controller.js";
import { requireJwt } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";

const router = Router();

router.post("/", inquiryController.submitInquiry);
router.get(
  "/",
  requireJwt,
  requirePermission("inbox:read"),
  inquiryController.listInquiries,
);
router.patch(
  "/:id",
  requireJwt,
  requirePermission("inbox:write"),
  inquiryController.patchInquiry,
);
router.delete(
  "/:id",
  requireJwt,
  requirePermission("inbox:write"),
  inquiryController.deleteInquiry,
);

export default router;
