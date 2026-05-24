import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import {
  canAccessAdmin,
  hasPermission,
  isRole,
  parseRole,
} from "../constants/roles.js";
import { User } from "../models/User.model.js";

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    createdAt: user.createdAt?.toISOString?.() ?? null,
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
}

export async function loginStaff({ email, password }) {
  const normalized = email?.trim().toLowerCase();
  if (!normalized || !password) {
    const err = new Error("Email and password required");
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ email: normalized });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const role = parseRole(user.role);
  if (!canAccessAdmin(role)) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  return { user: sanitizeUser(user), token: signToken(user) };
}

export async function getStaffFromToken(identity) {
  const id = identity?.sub ?? identity?.id;
  if (!id) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }

  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }
  return sanitizeUser(user);
}

export async function registerStaff(actor, { email, password, name, role }) {
  if (!hasPermission(actor.role, "users:write")) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const normalized = email?.trim().toLowerCase();
  if (!normalized || !password) {
    const err = new Error("Email and password required");
    err.status = 400;
    throw err;
  }

  if (password.length < 10) {
    const err = new Error("Password must be at least 10 characters");
    err.status = 400;
    throw err;
  }

  if (!role || !isRole(role)) {
    const err = new Error("Invalid role");
    err.status = 400;
    throw err;
  }

  if (role === "super_admin" && actor.role !== "super_admin") {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const existing = await User.findOne({ email: normalized });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: normalized,
    name: name?.trim() || null,
    passwordHash,
    role,
  });

  return sanitizeUser(user);
}
