"use client";

import { useEffect } from "react";
import { useCart } from "@/context/cart-context";

export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
