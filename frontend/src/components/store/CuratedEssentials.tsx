import { ProductCard } from "@/components/store/ProductCard";
import { resolveNewArrivalProducts } from "@/lib/store/new-arrivals";
import { getStoreContent } from "@/services/content/store";

export async function CuratedEssentials() {
  const { newArrivals, products } = await getStoreContent();
  const featured = resolveNewArrivalProducts(newArrivals, products);

  if (featured.length === 0) return null;

  return (
    <section id="products" className="scroll-mt-24 bg-sand-light/50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
            New Arrivals
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {featured.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              variant="curated"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
