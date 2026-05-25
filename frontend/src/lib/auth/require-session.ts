import { auth } from "@/auth";
import { backendFetch } from "@/lib/api/backend";
import { hasPermission } from "@/lib/auth/rbac";
import type { Permission } from "@/lib/auth/roles";
import { parseRole } from "@/lib/auth/roles";

export class AuthError extends Error {
  readonly status: number;

  constructor(message = "Unauthorized", status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/** @deprecated Use AuthError */
export class AdminAuthError extends AuthError {
  constructor() {
    super("Unauthorized", 401);
    this.name = "AdminAuthError";
  }
}

async function resolveStaff() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new AuthError("Unauthorized", 401);
  }

  if (!session.accessToken) {
    throw new AuthError("Unauthorized", 401);
  }

  const { data, ok, status } = await backendFetch<{
    user: { id: string; email: string; name: string | null; role: string };
  }>("/auth/me", { token: session.accessToken });

  if (status === 503) {
    throw new AuthError(
      "API is not running. From the project root run: npm run dev",
      503,
    );
  }

  if (!ok || !data?.user) {
    throw new AuthError(
      "Session expired. Sign in again at /admin/login.",
      401,
    );
  }

  const role = parseRole(data.user.role);
  return { session, role, token: session.accessToken };
}

export async function requireSession() {
  const { session, role, token } = await resolveStaff();
  if (!hasPermission(role, "admin:access")) {
    throw new AuthError("Forbidden", 403);
  }
  return { session, role, token };
}

export async function requirePermission(permission: Permission) {
  const { session, role, token } = await resolveStaff();
  if (!hasPermission(role, permission)) {
    throw new AuthError("Forbidden", 403);
  }
  return { session, role, token };
}
