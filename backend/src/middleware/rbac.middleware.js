import { hasPermission } from "../constants/roles.js";

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
