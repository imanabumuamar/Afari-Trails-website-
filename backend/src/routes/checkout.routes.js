import { Router } from "express";
import * as checkoutController from "../controllers/checkout.controller.js";

const router = Router();

router.get("/status", checkoutController.getCheckoutStatus);
router.post("/session", checkoutController.createSession);

export default router;
