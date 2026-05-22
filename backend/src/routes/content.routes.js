import { Router } from "express";
import * as contentController from "../controllers/content.controller.js";
import { requireAdminSecret } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/homepage", contentController.getHomepage);
router.put("/homepage", requireAdminSecret, contentController.updateHomepage);

export default router;
