import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.get("/me", requireJwt, authController.me);

export default router;
