import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!req.auth && pathname.startsWith("/admin") && !isLogin) {
    const login = new URL("/admin/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return Response.redirect(login);
  }

  if (!req.auth && isAdminApi) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
