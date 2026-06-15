import { Router } from "express";
import * as inquiryController from "../controllers/inquiry.controller.js";
import { requireJwt } from "../middleware/auth.middleware.js";
import { requireAnyInboxRead } from "../middleware/rbac.middleware.js";

const router = Router();

router.post("/", inquiryController.submitInquiry);
router.get("/", requireJwt, requireAnyInboxRead, inquiryController.listInquiries);
router.patch("/:id", requireJwt, requireAnyInboxRead, inquiryController.patchInquiry);
router.delete("/:id", requireJwt, requireAnyInboxRead, inquiryController.deleteInquiry);

export default router;
