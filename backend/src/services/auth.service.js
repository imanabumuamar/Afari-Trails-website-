import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import {
  canAccessAdmin,
  hasPermission,
  isRole,
  parseRole,
} from "../constants/roles.js";
import {
  accessLevelFromPermissions,
  CMS_CONTENT_AREAS,
  contentAreasFromPermissions,
  getEffectivePermissions,
  permissionsFromContentAreas,
  validateCustomPermissions,
} from "../constants/permissions.js";
import { User } from "../models/User.model.js";

function sanitizeUser(user) {
  const effective = getEffectivePermissions(user);
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    permissions: effective,
    contentAreas: contentAreasFromPermissions(effective),
    accessLevel: accessLevelFromPermissions(effective, user.role),
    createdAt: user.createdAt?.toISOString?.() ?? null,
  };
}

async function verifyActorPassword(actor, currentPassword) {
  const actorId = actor?.id ?? actor?.sub;
  if (!actorId || !currentPassword) {
    const err = new Error("Current password is required for this action");
    err.status = 400;
    throw err;
  }

  const actorUser = await User.findById(actorId);
  if (!actorUser) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(currentPassword, actorUser.passwordHash);
  if (!valid) {
    const err = new Error("Current password is incorrect");
    err.status = 403;
    throw err;
  }
}

function signToken(user) {
  const permissions = getEffectivePermissions(user);
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions,
    },
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

function resolveStoredPermissions({ role, contentAreas, accessLevel, permissions }) {
  if (role === "super_admin") {
    return [];
  }

  if (Array.isArray(permissions) && permissions.length > 0) {
    return validateCustomPermissions(permissions);
  }

  if (Array.isArray(contentAreas)) {
    const level =
      accessLevel === "view" || role === "viewer" ? "view" : "edit";
    return permissionsFromContentAreas(contentAreas, level);
  }

  return [];
}

export async function registerStaff(
  actor,
  { email, password, name, role, currentPassword, contentAreas, accessLevel, permissions },
) {
  if (!hasPermission(actor.role, "users:write") || actor.role !== "super_admin") {
    const err = new Error("Only super admins can manage users");
    err.status = 403;
    throw err;
  }

  await verifyActorPassword(actor, currentPassword);

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

  if (role !== "super_admin") {
    const areas = contentAreas ?? [];
    if (!areas.length) {
      const err = new Error("Select at least one content area for this user");
      err.status = 400;
      throw err;
    }
  }

  const existing = await User.findOne({ email: normalized });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const storedPermissions = resolveStoredPermissions({
    role,
    contentAreas,
    accessLevel,
    permissions,
  });

  const user = await User.create({
    email: normalized,
    name: name?.trim() || null,
    passwordHash,
    role,
    permissions: storedPermissions,
  });

  return sanitizeUser(user);
}

export { CMS_CONTENT_AREAS };
