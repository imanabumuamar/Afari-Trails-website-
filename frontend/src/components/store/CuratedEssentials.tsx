import { ProductCard } from "@/components/store/ProductCard";
import { curatedEssentials, getProduct } from "@/lib/data/store";

export function CuratedEssentials() {
  return (
    <section id="products" className="scroll-mt-24 bg-sand-light/50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
            Curated Field Essentials
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {curatedEssentials.map((item) => {
            const product = getProduct(item.slug);
            if (!product) return null;
            return (
              <ProductCard
                key={item.slug}
                product={product}
                variant="curated"
                displayName={item.name}
                displayColor={item.color}
                displayPrice={item.priceDisplay}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
