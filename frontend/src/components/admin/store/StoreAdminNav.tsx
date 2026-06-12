"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/store", label: "Page" },
  { href: "/admin/store/collections", label: "Collections" },
  { href: "/admin/store/new-arrivals", label: "New arrivals" },
  { href: "/admin/store/items", label: "Items" },
] as const;

type StoreAdminNavProps = {
  updatedAt?: string | null;
  status?: string;
};

export function StoreAdminNav({ updatedAt, status }: StoreAdminNavProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 border-b border-charcoal/10 pb-4">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/store"
          target="_blank"
          className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-gold"
        >
          View live store →
        </Link>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && <span className="text-xs text-charcoal/60">{status}</span>}
      </div>

      <nav className="flex flex-wrap gap-2">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin/store"
              ? pathname === "/admin/store"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                active
                  ? "bg-charcoal text-ivory"
                  : "border border-charcoal/20 text-charcoal/70 hover:border-charcoal/35"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
