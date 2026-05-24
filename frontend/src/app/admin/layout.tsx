import type { Metadata } from "next";
import Link from "next/link";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { AdminStaffBanner } from "@/components/admin/AdminStaffBanner";
import { hasPermission } from "@/lib/auth/rbac";
import { ROLE_LABELS } from "@/lib/auth/roles";
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
  const canManageUsers = role ? hasPermission(role, "users:read") : false;

  return (
    <div className="min-h-screen bg-beige text-charcoal">
      <header className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
              Afari Trails
            </p>
            <h1 className="font-serif text-2xl font-light">Content admin</h1>
          </div>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
            <Link href="/admin" className="hover:text-gold">
              Dashboard
            </Link>
            <Link href="/admin/homepage" className="hover:text-gold">
              Homepage
            </Link>
            <Link href="/admin/ventures" className="hover:text-gold">
              Ventures
            </Link>
            {canManageUsers ? (
              <Link
                href="/admin/users"
                className="rounded bg-charcoal px-3 py-1.5 text-ivory hover:bg-charcoal/90"
              >
                Users
              </Link>
            ) : session?.user ? (
              <span className="text-charcoal/35" title="Super admin only">
                Users
              </span>
            ) : null}
            <Link href="/" className="text-charcoal/55 hover:text-charcoal">
              View site →
            </Link>
            {session?.user && role && (
              <span className="text-charcoal/45">
                {session.user.email}
                <span className="ml-2 text-charcoal/35">({ROLE_LABELS[role]})</span>
              </span>
            )}
            <AdminSignOut />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">
        {role && session?.user && <AdminStaffBanner role={role} />}
        {children}
      </div>
    </div>
  );
}
