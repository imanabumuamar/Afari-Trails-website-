import type { Permission } from "@/lib/auth/roles";

/** Longest-prefix wins when matching admin paths. */
export const ADMIN_PAGE_PERMISSIONS: { prefix: string; permission: Permission }[] = [
  { prefix: "/admin/users", permission: "users:read" },
  { prefix: "/admin/homepage", permission: "content:homepage:read" },
  { prefix: "/admin/ventures", permission: "content:ventures:read" },
];

export function permissionForAdminPath(pathname: string): Permission {
  const match = ADMIN_PAGE_PERMISSIONS.find(({ prefix }) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match?.permission ?? "admin:access";
}

export function permissionForAdminApi(pathname: string, method: string): Permission | null {
  if (pathname.startsWith("/api/admin/users")) {
    if (method === "GET") return "users:read";
    if (method === "POST" || method === "PATCH" || method === "DELETE") return "users:write";
    return "users:read";
  }

  if (pathname.startsWith("/api/admin/content/homepage")) {
    if (method === "GET") return "content:homepage:read";
    if (method === "PUT" || method === "POST") return "content:homepage:write";
  }

  if (pathname.startsWith("/api/admin/content/ventures")) {
    if (method === "GET") return "content:ventures:read";
    if (method === "PUT" || method === "POST") return "content:ventures:write";
  }
  return null;
}
