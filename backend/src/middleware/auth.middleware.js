import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function requireAdminSecret(req, res, next) {
  const secret = req.headers["x-admin-secret"];
  if (!config.adminSecret || secret !== config.adminSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function requireJwt(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
