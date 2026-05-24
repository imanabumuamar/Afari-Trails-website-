import { requirePermission } from "@/lib/auth/require-session";

/** Requires homepage write access (admin, editor, super_admin). */
export async function requireAdminSession() {
  return requirePermission("content:homepage:write");
}

export { AdminAuthError, AuthError } from "@/lib/auth/require-session";
