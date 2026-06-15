import { hasEffectivePermission, hasAnyInboxRead } from "../constants/permissions.js";

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!hasEffectivePermission(req.user, permission)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function requireSuperAdmin(req, res, next) {
  if (!req.user?.role) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.role !== "super_admin") {
    return res.status(403).json({ error: "Only super admins can manage users" });
  }
  next();
}

export function requireAnyInboxRead(req, res, next) {
  if (!req.user?.role) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!hasAnyInboxRead(req.user)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
