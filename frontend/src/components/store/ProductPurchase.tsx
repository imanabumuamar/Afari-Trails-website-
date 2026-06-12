"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import type { Product } from "@/types/store-content";

type ProductPurchaseProps = {
  product: Product;
};

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const options = product.options ?? [];
  const [selected, setSelected] = useState<Record<string, string>>({});

  const allSelected = useMemo(
    () => options.every((option) => selected[option.name]),
    [options, selected],
  );

  if (options.length === 0) {
    return <AddToCartButton product={product} />;
  }

  return (
    <div className="mt-12 space-y-8">
      {options.map((option) => (
        <div key={option.name}>
          <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
            {option.name}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const active = selected[option.name] === value;
              return (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((prev) => ({ ...prev, [option.name]: value }))
                    }
                    className={`min-w-[3rem] border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "border-charcoal bg-charcoal text-ivory"
                        : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/40"
                    }`}
                  >
                    {value}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <AddToCartButton
        product={product}
        selectedOptions={allSelected ? selected : undefined}
        disabled={!allSelected}
      />
    </div>
  );
}
