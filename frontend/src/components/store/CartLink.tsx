"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { ROUTES } from "@/config/routes";

type CartLinkProps = {
  light?: boolean;
};

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M6 7h12l-1 12H7L6 7z" />
      <path d="M9 7V5a3 3 0 016 0v2" />
    </svg>
  );
}

export function CartLink({ light = false }: CartLinkProps) {
  const { itemCount } = useCart();

  return (
    <Link
      href={ROUTES.storeCart}
      className={`relative transition-colors hover:opacity-80 ${
        light ? "text-ivory" : "text-charcoal"
      }`}
      aria-label={`Cart, ${itemCount} items`}
    >
      <BagIcon />
      {itemCount > 0 && (
        <span
          className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-medium ${
            light ? "bg-ivory text-charcoal" : "bg-charcoal text-ivory"
          }`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
