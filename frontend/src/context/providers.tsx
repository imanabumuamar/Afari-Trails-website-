"use client";

import type { ReactNode } from "react";

/**
 * Root providers for shared client state (auth, theme, etc.).
 * Extend as you add visitor accounts or admin sessions.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
