"use client";

import Image from "next/image";
import { collections, type ArchiveGridCategory } from "@/lib/data/archive";

type FeaturedCollectionsProps = {
  onSelect: (id: ArchiveGridCategory) => void;
};

export function FeaturedCollections({ onSelect }: FeaturedCollectionsProps) {
  return (
    <section id="collections" className="scroll-mt-24 bg-matte-black">
      {collections.map((col, i) => (
        <button
          key={col.id}
          type="button"
          onClick={() => {
            onSelect(col.id);
            document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hover-zoom group relative block min-h-[55vh] w-full overflow-hidden text-left lg:min-h-[65vh]"
        >
          <Image
            src={col.image}
            alt={col.title}
            fill
            className="object-cover opacity-90 transition-transform duration-[1.4s] group-hover:scale-[1.03]"
            sizes="100vw"
            priority={i < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/35 to-matte-black/15 transition-opacity group-hover:from-matte-black/95" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-14 lg:p-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-sand">
              Collection {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light text-ivory md:text-5xl lg:text-6xl">
              {col.title}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/65 md:text-base">
              {col.description}
            </p>
            <span className="mt-8 inline-block text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/80 group-hover:text-sand">
              View Collection →
            </span>
          </div>
        </button>
      ))}
    </section>
  );
}
