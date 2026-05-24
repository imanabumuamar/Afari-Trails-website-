import bcrypt from "bcryptjs";
import { hasPermission, isRole, ROLES } from "../constants/roles.js";
import { User } from "../models/User.model.js";

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

function assignableRoles(actorRole) {
  if (actorRole === "super_admin") return [...ROLES];
  return [];
}

export async function listUsers(actor) {
  if (!hasPermission(actor.role, "users:read")) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const users = await User.find().sort({ createdAt: 1 });
  return {
    users: users.map(sanitizeUser),
    assignableRoles: assignableRoles(actor.role),
  };
}

export async function updateUser(actor, { id, email, name, role, password }) {
  if (!hasPermission(actor.role, "users:write")) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  if (email !== undefined) user.email = email.trim().toLowerCase();
  if (name !== undefined) user.name = name.trim() || null;

  if (role !== undefined) {
    if (!isRole(role)) {
      const err = new Error("Invalid role");
      err.status = 400;
      throw err;
    }
    if (!assignableRoles(actor.role).includes(role)) {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    if (role === "super_admin" && actor.role !== "super_admin") {
      const err = new Error("Forbidden");
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

export async function deleteUser(actor, id) {
  if (!hasPermission(actor.role, "users:write")) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

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
