import type { Metadata } from "next";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { ADMIN_NAV_LINKS } from "@/lib/auth/content-areas";
import { hasPermission, isSuperAdmin } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const email = session?.user?.email ?? null;
  const permissions = session?.user?.permissions;
  const canManageUsers = isSuperAdmin(role);
  const canViewMessages = role
    ? hasPermission(role, "inbox:read", permissions)
    : false;

  const navLinks = role
    ? ADMIN_NAV_LINKS.filter(({ permission }) =>
        hasPermission(role, permission, permissions),
      ).map(({ href, label }) => ({ href, label }))
    : [];

  return (
    <AdminChrome
      email={email}
      role={role}
      canManageUsers={canManageUsers}
      canViewMessages={canViewMessages}
      navLinks={navLinks}
    >
      {children}
    </AdminChrome>
  );
}
