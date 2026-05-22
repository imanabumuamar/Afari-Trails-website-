import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data/store";

type ProductCardProps = {
  product: Product;
  variant?: "default" | "curated";
  displayName?: string;
  displayColor?: string;
  displayPrice?: string;
};

export function ProductCard({
  product,
  variant = "default",
  displayName,
  displayColor,
  displayPrice,
}: ProductCardProps) {
  const name = displayName ?? product.name;
  const price = displayPrice ?? product.priceDisplay;

  if (variant === "curated") {
    return (
      <Link href={`/store/${product.slug}`} className="group block text-center">
        <div className="relative mb-4 aspect-square overflow-hidden bg-beige shadow-[0_8px_24px_rgba(58,48,40,0.08)]">
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-[1.2s] group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, 16vw"
          />
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal">
          {name}
        </h3>
        {displayColor && (
          <p className="mt-1 text-xs text-charcoal/50">{displayColor}</p>
        )}
        <p className="mt-1 text-xs text-charcoal/70">{price}</p>
      </Link>
    );
  }

  return (
    <Link href={`/store/${product.slug}`} className="group block">
      <div className="relative mb-5 aspect-[3/4] overflow-hidden bg-sand-light/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
        {product.isNew && (
          <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-charcoal/70">
            New
          </span>
        )}
      </div>
      <h3 className="font-serif text-xl font-light text-charcoal transition-colors group-hover:text-gold-muted">
        {product.name}
      </h3>
      <p className="mt-2 text-sm text-charcoal/55">{product.shortDescription}</p>
      <p className="mt-3 text-sm text-charcoal/80">{product.priceDisplay}</p>
    </Link>
  );
}
