"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types/store-content";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

export function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "mt-12 w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black sm:w-auto"
      }
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
