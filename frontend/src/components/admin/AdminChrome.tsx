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

const BARE_PATHS = new Set(["/admin/login", "/admin/forbidden"]);

function AdminTopBar({
  email,
  role,
  titleHref,
  showSignOut = false,
}: {
  email: string | null;
  role: Role | null;
  titleHref?: string;
  showSignOut?: boolean;
}) {
  const title = (
    <>
      <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
        Afari Trails
      </p>
      <h1 className="font-serif text-2xl font-light">Content admin</h1>
    </>
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      {titleHref ? (
        <Link href={titleHref} className="block">
          {title}
        </Link>
      ) : (
        <div>{title}</div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-charcoal"
        >
          View site →
        </Link>
        {email && role && (
          <span className="hidden max-w-[220px] truncate text-xs text-charcoal/45 sm:inline">
            {email}
            <span className="ml-2 text-charcoal/35">({ROLE_LABELS[role]})</span>
          </span>
        )}
        {showSignOut && email && <AdminSignOut variant="header" />}
      </div>
    </div>
  );
}

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
          <AdminTopBar email={email} role={role} showSignOut />
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
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-ivory">
        <AdminTopBar email={email} role={role} titleHref="/admin" />

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
            {email && (
              <span className="ml-1">
                <AdminSignOut />
              </span>
            )}
          </div>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <AdminStackStatus />
        {role && email && (
          <AdminStaffBanner role={role} />
        )}
        {children}
      </div>
    </div>
  );
}
