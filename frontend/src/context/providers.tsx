"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { AdminTabSession } from "@/components/admin/AdminTabSession";
import { CartProvider } from "@/context/cart-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <AdminTabSession />
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
