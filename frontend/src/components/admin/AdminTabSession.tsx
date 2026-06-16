"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdminTabAuthenticated } from "@/lib/auth/admin-tab-session";

/**
 * Admin is authenticated per browser tab (sessionStorage).
 * A shared cookie alone is not enough — send new tabs to the login page
 * without signing out, so other open admin tabs keep working.
 */
export function AdminTabSession() {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (pathname === "/admin/login" || pathname === "/admin/forbidden") return;
    if (!pathname.startsWith("/admin")) return;

    if (!isAdminTabAuthenticated()) {
      router.replace("/admin/login");
    }
  }, [status, pathname, router]);

  return null;
}
