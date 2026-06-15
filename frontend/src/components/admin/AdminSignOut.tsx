"use client";

import { signOut } from "next-auth/react";

type AdminSignOutProps = {
  variant?: "nav" | "header";
};

export function AdminSignOut({ variant = "nav" }: AdminSignOutProps) {
  const className =
    variant === "nav"
      ? "shrink-0 rounded bg-charcoal px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-charcoal/90"
      : "shrink-0 bg-charcoal px-4 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-charcoal/90";

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className={className}
    >
      Sign out
    </button>
  );
}
