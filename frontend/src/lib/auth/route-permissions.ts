import type { Permission } from "@/lib/auth/roles";

/**
 * Longest-prefix wins — keep more specific paths first (or use sorted lookup below).
 */
export const ADMIN_PAGE_PERMISSIONS: { prefix: string; permission: Permission }[] = [
  { prefix: "/admin/users", permission: "users:read" },
  { prefix: "/admin/homepage", permission: "content:homepage:read" },
  { prefix: "/admin/expeditions", permission: "content:expeditions:read" },
  { prefix: "/admin/ventures", permission: "content:ventures:read" },
  { prefix: "/admin/journal", permission: "content:journal:read" },
  { prefix: "/admin/archive", permission: "content:archive:read" },
  { prefix: "/admin/about", permission: "content:about:read" },
  { prefix: "/admin/store", permission: "content:store:read" },
  { prefix: "/admin/support", permission: "content:support:read" },
  { prefix: "/admin/connect", permission: "content:connect:read" },
];

const PAGE_PERMISSIONS_SORTED = [...ADMIN_PAGE_PERMISSIONS].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

export function permissionForAdminPath(pathname: string): Permission {
  const match = PAGE_PERMISSIONS_SORTED.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match?.permission ?? "admin:access";
}

export function permissionForAdminApi(
  pathname: string,
  method: string,
): Permission | null {
  if (pathname.startsWith("/api/admin/users")) {
    if (method === "GET") return "users:read";
    if (method === "POST" || method === "PATCH" || method === "DELETE") {
      return "users:write";
    }
    return "users:read";
  }

  const contentRoutes: { prefix: string; read: Permission; write: Permission }[] =
    [
      {
        prefix: "/api/admin/content/homepage",
        read: "content:homepage:read",
        write: "content:homepage:write",
      },
      {
        prefix: "/api/admin/content/ventures",
        read: "content:ventures:read",
        write: "content:ventures:write",
      },
      {
        prefix: "/api/admin/content/expeditions",
        read: "content:expeditions:read",
        write: "content:expeditions:write",
      },
      {
        prefix: "/api/admin/content/journal",
        read: "content:journal:read",
        write: "content:journal:write",
      },
      {
        prefix: "/api/admin/content/archive",
        read: "content:archive:read",
        write: "content:archive:write",
      },
      {
        prefix: "/api/admin/content/about",
        read: "content:about:read",
        write: "content:about:write",
      },
      {
        prefix: "/api/admin/content/store",
        read: "content:store:read",
        write: "content:store:write",
      },
      {
        prefix: "/api/admin/content/support",
        read: "content:support:read",
        write: "content:support:write",
      },
      {
        prefix: "/api/admin/content/connect",
        read: "content:connect:read",
        write: "content:connect:write",
      },
    ];

  for (const { prefix, read, write } of contentRoutes) {
    if (pathname.startsWith(prefix)) {
      if (method === "GET") return read;
      if (method === "PUT" || method === "POST") return write;
    }
  }

  return null;
}
