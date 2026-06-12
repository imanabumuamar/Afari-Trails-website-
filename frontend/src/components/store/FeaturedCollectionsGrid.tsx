import Image from "next/image";
import Link from "next/link";
import { CollectionIcon } from "@/components/store/CollectionIcon";
import { visibleStoreCollections } from "@/lib/store/store-visibility";
import { getStoreContent } from "@/services/content/store";

export async function FeaturedCollectionsGrid() {
  const { collections } = await getStoreContent();
  const editorialCollections = visibleStoreCollections(collections);
  return (
    <section id="collections" className="scroll-mt-24 bg-matte-black py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-sand/70">
            Featured Collections
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light text-ivory md:text-5xl">
            Featured Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {editorialCollections.map((col) => (
            <Link
              key={col.slug}
              href={`/store/collections/${col.slug}`}
              className="group flex flex-col overflow-hidden border border-ivory/10 bg-matte-black transition-colors hover:border-gold/40"
            >
              <div className="hover-zoom relative aspect-[3/5] w-full">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col px-4 py-6">
                <CollectionIcon
                  type={col.icon}
                  className="mb-4 h-7 w-7 text-gold"
                />
                <h3 className="font-serif text-lg font-light leading-snug text-ivory">
                  {col.title}
                </h3>
                <p className="mt-3 flex-1 text-[11px] leading-relaxed text-ivory/55">
                  {col.description}
                </p>
                <span className="mt-5 text-[10px] font-medium uppercase tracking-[0.22em] text-sand transition-colors group-hover:text-gold">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
