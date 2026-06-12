"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types/store-content";

type AddToCartButtonProps = {
  product: Product;
  selectedOptions?: Record<string, string>;
  disabled?: boolean;
  className?: string;
};

export function AddToCartButton({
  product,
  selectedOptions,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (disabled) return;
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay,
      image: product.image,
      selectedOptions,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={
        className ||
        `w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${
          selectedOptions ? "" : "mt-12"
        }`
      }
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
