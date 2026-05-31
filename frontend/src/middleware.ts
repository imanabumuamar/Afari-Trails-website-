import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { hasPermission, isSuperAdmin } from "@/lib/auth/rbac";
import {
  permissionForAdminApi,
  permissionForAdminPath,
} from "@/lib/auth/route-permissions";
import type { Permission } from "@/lib/auth/roles";
import { parseRole } from "@/lib/auth/roles";

const { auth } = NextAuth(authConfig);

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forbidden"]);

/**
 * Edge middleware: login required + permission checks on admin pages and APIs.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!req.auth) {
    if (isAdminPage && !isLogin) {
      const login = new URL("/admin/login", req.nextUrl.origin);
      login.searchParams.set("callbackUrl", pathname);
      return Response.redirect(login);
    }
    if (isAdminApi) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return;
  }

  const role = parseRole(req.auth.user?.role as string | undefined, "viewer");
  const permissions = req.auth.user?.permissions as Permission[] | undefined;

  if (!hasPermission(role, "admin:access", permissions)) {
    if (isAdminPage && !PUBLIC_ADMIN_PATHS.has(pathname)) {
      return Response.redirect(new URL("/admin/forbidden", req.nextUrl.origin));
    }
    if (isAdminApi) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    return;
  }

  if (
    isAdminPage &&
    (pathname === "/admin/users" || pathname.startsWith("/admin/users/")) &&
    !isSuperAdmin(role)
  ) {
    return Response.redirect(new URL("/admin/forbidden", req.nextUrl.origin));
  }

  if (isAdminPage && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const required = permissionForAdminPath(pathname);
    if (!hasPermission(role, required, permissions)) {
      return Response.redirect(new URL("/admin/forbidden", req.nextUrl.origin));
    }
  }

  if (isAdminApi) {
    const required = permissionForAdminApi(pathname, req.method);
    if (required && !hasPermission(role, required, permissions)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
