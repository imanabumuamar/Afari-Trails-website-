import bcrypt from "bcryptjs";
import {
  accessLevelFromPermissions,
  CMS_CONTENT_AREAS,
  contentAreasFromPermissions,
  getEffectivePermissions,
  permissionsFromContentAreas,
  validateCustomPermissions,
} from "../constants/permissions.js";
import { hasPermission, isRole, ROLES } from "../constants/roles.js";
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
    createdAt: user.createdAt.toISOString(),
  };
}

function assignableRoles(actorRole) {
  if (actorRole === "super_admin") return [...ROLES];
  return [];
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

  return null;
}

export async function listUsers(actor) {
  if (actor.role !== "super_admin") {
    const err = new Error("Only super admins can manage users");
    err.status = 403;
    throw err;
  }

  const users = await User.find().sort({ createdAt: 1 });
  return {
    users: users.map(sanitizeUser),
    assignableRoles: assignableRoles(actor.role),
    contentAreas: CMS_CONTENT_AREAS,
  };
}

export async function updateUser(
  actor,
  {
    id,
    email,
    name,
    role,
    password,
    currentPassword,
    contentAreas,
    accessLevel,
    permissions,
  },
) {
  if (actor.role !== "super_admin") {
    const err = new Error("Only super admins can manage users");
    err.status = 403;
    throw err;
  }

  await verifyActorPassword(actor, currentPassword);

  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (email !== undefined) user.email = email.trim().toLowerCase();
  if (name !== undefined) user.name = name.trim() || null;

  const nextRole = role !== undefined ? role : user.role;

  if (role !== undefined) {
    if (!isRole(role)) {
      const err = new Error("Invalid role");
      err.status = 400;
      throw err;
    }
    if (!assignableRoles(actor.role).includes(role)) {
      const err = new Error("Only super admins can manage users");
      err.status = 403;
      throw err;
    }
    if (actor.id === id && role !== user.role) {
      const err = new Error("You cannot change your own role");
      err.status = 400;
      throw err;
    }
    user.role = role;
  }

  if (nextRole !== "super_admin") {
    const stored = resolveStoredPermissions({
      role: nextRole,
      contentAreas,
      accessLevel,
      permissions,
    });

    if (contentAreas !== undefined || permissions !== undefined || accessLevel !== undefined) {
      if (stored && stored.length > 0) {
        const areas = contentAreasFromPermissions(stored);
        if (!areas.length) {
          const err = new Error("Select at least one content area for this user");
          err.status = 400;
          throw err;
        }
        user.permissions = stored;
      }
    }
  } else {
    user.permissions = [];
  }

  if (password) {
    if (password.length < 10) {
      const err = new Error("Password must be at least 10 characters");
      err.status = 400;
      throw err;
    }
    user.passwordHash = await bcrypt.hash(password, 12);
  }

  await user.save();
  return sanitizeUser(user);
}

export async function deleteUser(actor, id, currentPassword) {
  if (actor.role !== "super_admin") {
    const err = new Error("Only super admins can manage users");
    err.status = 403;
    throw err;
  }

  await verifyActorPassword(actor, currentPassword);

  if (actor.id === id) {
    const err = new Error("You cannot delete your own account");
    err.status = 400;
    throw err;
  }

  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (user.role === "super_admin") {
    const count = await User.countDocuments({ role: "super_admin" });
    if (count <= 1) {
      const err = new Error("Cannot delete the last super admin");
      err.status = 400;
      throw err;
    }
  }

  await User.deleteOne({ _id: id });
  return { ok: true };
}
