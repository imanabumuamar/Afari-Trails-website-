import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import {
  getStoreContentLocal,
  getStoreProduct,
  getStoreRelatedProducts,
} from "@/services/content/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { products } = getStoreContentLocal();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) return { title: "Store" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getStoreProduct(slug);

  if (!product) notFound();

  const related = await getStoreRelatedProducts(product.related);

  return (
    <>
      <section className="relative min-h-[70vh] pt-28 lg:min-h-[80vh]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-matte-black/35" />
      </section>

      <section className="bg-beige py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
          <div className="lg:col-span-5">
            <Link
              href="/store"
              className="text-[10px] uppercase tracking-[0.25em] text-charcoal/45 hover:text-charcoal"
            >
              ← Store
            </Link>
            <h1 className="mt-8 font-serif text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-light text-charcoal/80">
              {product.priceDisplay}
            </p>
            <p className="mt-10 font-serif text-xl font-light leading-relaxed text-charcoal/75">
              {product.story}
            </p>

            <dl className="mt-12 space-y-6 border-t border-charcoal/10 pt-10">
              {[
                ["Fabric", product.fabric],
                ["Fit", product.fit],
                ["Functionality", product.functionality],
                ["Weather", product.weather],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm text-charcoal/70">{value}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              className="mt-12 w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black sm:w-auto"
            >
              Add to Cart
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {product.gallery.map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden bg-sand-light/30 ${
                    i === 0 ? "aspect-[4/5] sm:col-span-2" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-charcoal/8 bg-ivory py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
              Suggested Pairings
            </p>
            <div className="mt-10 grid grid-cols-1 gap-14 sm:grid-cols-3 lg:gap-12">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
