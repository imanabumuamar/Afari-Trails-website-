"use client";

import { signOut } from "next-auth/react";

export function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-charcoal/55 hover:text-charcoal"
    >
      Sign out
    </button>
  );
}
