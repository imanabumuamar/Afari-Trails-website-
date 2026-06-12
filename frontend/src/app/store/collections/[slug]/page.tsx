import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { isStoreCollectionVisible } from "@/lib/store/store-visibility";
import {
  getStoreContent,
  getStoreContentLocal,
} from "@/services/content/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { collections } = getStoreContentLocal();
  return collections
    .filter(isStoreCollectionVisible)
    .map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const { collections, products } = await getStoreContent();
  const collection = collections.find((c) => c.slug === slug);

  if (!collection || !isStoreCollectionVisible(collection)) notFound();

  const collectionProducts = products.filter((p) => p.collection === slug);

  return (
    <>
      <section className="relative min-h-[50vh] pt-28">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-matte-black/45" />
        <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-[1400px] flex-col justify-end px-6 pb-14 lg:px-10">
          <Link
            href="/store"
            className="text-[10px] uppercase tracking-[0.25em] text-sand"
          >
            ← Store
          </Link>
          <h1 className="mt-6 font-serif text-5xl font-light text-ivory md:text-6xl">
            {collection.title}
          </h1>
          <p className="mt-4 max-w-lg text-sm text-ivory/70">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
            {collectionProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {collectionProducts.length === 0 && (
            <p className="text-center text-sm text-charcoal/50">
              Pieces arriving soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
