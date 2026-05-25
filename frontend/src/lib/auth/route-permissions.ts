import type { Permission } from "@/lib/auth/roles";

/** Longest-prefix wins when matching admin paths. */
export const ADMIN_PAGE_PERMISSIONS: { prefix: string; permission: Permission }[] = [
  { prefix: "/admin/users", permission: "users:read" },
  { prefix: "/admin/homepage", permission: "content:homepage:read" },
  { prefix: "/admin/ventures", permission: "content:ventures:read" },
  { prefix: "/admin/about", permission: "content:about:read" },
  { prefix: "/admin/store", permission: "content:store:read" },
  { prefix: "/admin/support", permission: "content:support:read" },
  { prefix: "/admin/connect", permission: "content:connect:read" },
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

  if (pathname.startsWith("/api/admin/content/about")) {
    if (method === "GET") return "content:about:read";
    if (method === "PUT" || method === "POST") return "content:about:write";
  }

  if (pathname.startsWith("/api/admin/content/store")) {
    if (method === "GET") return "content:store:read";
    if (method === "PUT" || method === "POST") return "content:store:write";
  }

  if (pathname.startsWith("/api/admin/content/support")) {
    if (method === "GET") return "content:support:read";
    if (method === "PUT" || method === "POST") return "content:support:write";
  }

  if (pathname.startsWith("/api/admin/content/connect")) {
    if (method === "GET") return "content:connect:read";
    if (method === "PUT" || method === "POST") return "content:connect:write";
  }
  return null;
}
