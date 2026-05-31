"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { AdminStackStatus } from "@/components/admin/AdminStackStatus";
import { AdminStaffBanner } from "@/components/admin/AdminStaffBanner";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";

type NavLink = { href: string; label: string };

type AdminChromeProps = {
  email: string | null;
  role: Role | null;
  canManageUsers: boolean;
  canViewMessages: boolean;
  navLinks: NavLink[];
  children: React.ReactNode;
};

/** Pages that should render WITHOUT the dashboard header/nav/banner. */
const BARE_PATHS = new Set(["/admin/login", "/admin/forbidden"]);

export function AdminChrome({
  email,
  role,
  canManageUsers,
  canViewMessages,
  navLinks,
  children,
}: AdminChromeProps) {
  const pathname = usePathname();
  const isBare = BARE_PATHS.has(pathname);

  if (isBare) {
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
            <Link href="/" className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-charcoal">
              View site →
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <AdminStackStatus />
          {children}
        </div>
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-beige text-charcoal">
      <header className="border-b border-charcoal/10 bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/admin" className="block">
            <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
              Afari Trails
            </p>
            <h1 className="font-serif text-2xl font-light">Content admin</h1>
          </Link>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em]">
            <Link href="/" className="text-charcoal/55 hover:text-charcoal">
              View site →
            </Link>
            {email && role && (
              <span className="hidden text-charcoal/45 sm:inline">
                {email}
                <span className="ml-2 text-charcoal/35">({ROLE_LABELS[role]})</span>
              </span>
            )}
            <AdminSignOut />
          </div>
        </div>

        <nav className="border-t border-charcoal/10 bg-ivory/60">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-1 px-6 py-2 text-[11px] uppercase tracking-[0.18em]">
            <Link
              href="/admin"
              className={`rounded px-3 py-1.5 hover:bg-charcoal/5 hover:text-gold ${
                isActive("/admin") ? "bg-charcoal/10 text-charcoal" : "text-charcoal/65"
              }`}
            >
              Dashboard
            </Link>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded px-3 py-1.5 hover:bg-charcoal/5 hover:text-gold ${
                  isActive(href) ? "bg-charcoal/10 text-charcoal" : "text-charcoal/65"
                }`}
              >
                {label}
              </Link>
            ))}
            {canViewMessages && (
              <Link
                href="/admin/messages"
                className={`rounded px-3 py-1.5 hover:bg-charcoal/5 hover:text-gold ${
                  isActive("/admin/messages")
                    ? "bg-charcoal/10 text-charcoal"
                    : "text-charcoal/65"
                }`}
              >
                Messages
              </Link>
            )}
            {canManageUsers && (
              <Link
                href="/admin/users"
                className={`ml-1 rounded px-3 py-1.5 ${
                  isActive("/admin/users")
                    ? "bg-charcoal text-ivory"
                    : "bg-charcoal/85 text-ivory hover:bg-charcoal"
                }`}
              >
                Users
              </Link>
            )}
          </div>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <AdminStackStatus />
        {role && email && (
          <AdminStaffBanner role={role} canManageUsers={canManageUsers} />
        )}
        {children}
      </div>
    </div>
  );
}
