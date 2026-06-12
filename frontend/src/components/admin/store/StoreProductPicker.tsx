"use client";

import Image from "next/image";
import type { Product } from "@/types/store-content";

type StoreProductPickerProps = {
  products: Product[];
  value: string[];
  readOnly?: boolean;
  onChange: (slugs: string[]) => void;
};

export function StoreProductPicker({
  products,
  value,
  readOnly = false,
  onChange,
}: StoreProductPickerProps) {
  const slugs = value ?? [];

  function toggle(slug: string) {
    if (readOnly) return;
    onChange(
      slugs.includes(slug)
        ? slugs.filter((s) => s !== slug)
        : [...slugs, slug],
    );
  }

  function move(slug: string, dir: -1 | 1) {
    if (readOnly) return;
    const i = slugs.indexOf(slug);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= slugs.length) return;
    const next = [...slugs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  const selected = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((product): product is Product => !!product);

  return (
    <div className="space-y-6">
      {selected.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
            Selected order (shown on store page)
          </p>
          <ol className="space-y-2">
            {selected.map((product, index) => (
              <li
                key={product.slug}
                className="flex flex-wrap items-center gap-3 rounded border border-charcoal/12 bg-ivory px-3 py-2"
              >
                <span className="text-xs text-charcoal/45">#{index + 1}</span>
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-charcoal/10">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : null}
                </span>
                <span className="flex-1 text-sm text-charcoal">
                  <strong className="font-medium">{product.name}</strong>
                  <span className="ml-2 text-charcoal/50">{product.priceDisplay}</span>
                </span>
                {!readOnly && (
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded border border-charcoal/20 px-2 py-1 text-xs"
                      onClick={() => move(product.slug, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded border border-charcoal/20 px-2 py-1 text-xs"
                      onClick={() => move(product.slug, 1)}
                      disabled={index === selected.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="px-2 text-xs text-red-800/80 hover:text-red-900"
                      onClick={() => toggle(product.slug)}
                    >
                      Remove
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          All items
        </p>
        {products.length === 0 ? (
          <p className="text-sm text-charcoal/55">
            Add items first under Store → Items, then pick them here.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {products.map((product) => {
              const checked = slugs.includes(product.slug);
              return (
                <li key={product.slug}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded border px-3 py-2.5 ${
                      checked
                        ? "border-charcoal bg-charcoal text-ivory"
                        : "border-charcoal/12 bg-ivory text-charcoal"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="shrink-0"
                      checked={checked}
                      disabled={readOnly}
                      onChange={() => toggle(product.slug)}
                    />
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-charcoal/10">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block truncate font-medium">{product.name}</span>
                      <span
                        className={`text-xs ${checked ? "text-ivory/60" : "text-charcoal/45"}`}
                      >
                        {product.slug}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
