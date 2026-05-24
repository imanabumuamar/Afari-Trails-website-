import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as usersController from "../controllers/users.controller.js";
import { requireJwt } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/rbac.middleware.js";

const router = Router();

router.use(requireJwt);

router.get("/users", requirePermission("users:read"), usersController.list);
router.post(
  "/users",
  requirePermission("users:write"),
  authController.register,
);
router.patch(
  "/users",
  requirePermission("users:write"),
  usersController.update,
);
router.delete(
  "/users/:id",
  requirePermission("users:write"),
  usersController.remove,
);

export default router;
