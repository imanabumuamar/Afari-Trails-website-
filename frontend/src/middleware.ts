import NextAuth from "next-auth";
import { NextResponse } from "next/server";
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

function withNoStore(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  response.headers.set("Pragma", "no-cache");
  return response;
}

/**
 * Edge middleware: login required + permission checks on admin pages and APIs.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Let the client decide: each tab must sign in separately (sessionStorage).
  if (req.auth && isLogin) {
    return withNoStore(NextResponse.next());
  }

  if (!req.auth) {
    if (isAdminPage && !isLogin) {
      const login = new URL("/admin/login", req.nextUrl.origin);
      return withNoStore(NextResponse.redirect(login));
    }
    if (isAdminApi) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (isAdminPage && isLogin) {
      return withNoStore(NextResponse.next());
    }
    return;
  }

  const role = parseRole(req.auth.user?.role as string | undefined, "viewer");
  const permissions = req.auth.user?.permissions as Permission[] | undefined;

  if (!hasPermission(role, "admin:access", permissions)) {
    if (isAdminPage && !PUBLIC_ADMIN_PATHS.has(pathname)) {
      return withNoStore(
        NextResponse.redirect(new URL("/admin/forbidden", req.nextUrl.origin)),
      );
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
    return withNoStore(
      NextResponse.redirect(new URL("/admin/forbidden", req.nextUrl.origin)),
    );
  }

  if (isAdminPage && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const required = permissionForAdminPath(pathname);
    if (!hasPermission(role, required, permissions)) {
      return withNoStore(
        NextResponse.redirect(new URL("/admin/forbidden", req.nextUrl.origin)),
      );
    }
  }

  if (isAdminApi) {
    const required = permissionForAdminApi(pathname, req.method);
    if (required && !hasPermission(role, required, permissions)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (isAdminPage) {
    return withNoStore(NextResponse.next());
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
