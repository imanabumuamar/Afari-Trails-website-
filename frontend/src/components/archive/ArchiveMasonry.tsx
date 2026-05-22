"use client";

import Image from "next/image";
import { archiveImages, collections, type ArchiveGridCategory } from "@/lib/data/archive";
import type { ArchiveImage } from "@/lib/data/archive";

type ArchiveMasonryProps = {
  active: ArchiveGridCategory;
  onSelect: (item: ArchiveImage) => void;
  onFilterChange: (id: ArchiveGridCategory) => void;
};

export function ArchiveMasonry({
  active,
  onSelect,
  onFilterChange,
}: ArchiveMasonryProps) {
  const filtered =
    active === "all"
      ? archiveImages
      : archiveImages.filter((img) => img.category === active);

  const activeLabel =
    active === "all"
      ? "All Moments"
      : collections.find((c) => c.id === active)?.title ?? "Collection";

  return (
    <section id="grid" className="scroll-mt-24 bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
              Gallery
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light text-charcoal md:text-4xl">
              {activeLabel}
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className={`text-[10px] uppercase tracking-[0.2em] ${
                active === "all" ? "text-charcoal" : "text-charcoal/45 hover:text-charcoal/70"
              }`}
            >
              All
            </button>
            {collections.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onFilterChange(c.id)}
                className={`text-[10px] uppercase tracking-[0.2em] ${
                  active === c.id
                    ? "text-charcoal"
                    : "text-charcoal/45 hover:text-charcoal/70"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-sm text-charcoal/50">
            No images in this collection yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:auto-rows-[200px] sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[220px] lg:gap-6">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`hover-zoom group relative min-h-[280px] overflow-hidden bg-charcoal/5 text-left sm:min-h-0 ${
                  item.span === "tall" ? "sm:row-span-2" : ""
                } ${item.span === "wide" ? "sm:col-span-2" : ""}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                  sizes={
                    item.span === "wide"
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, 33vw"
                  }
                />
                <div className="absolute inset-0 bg-matte-black/0 transition-colors duration-500 group-hover:bg-matte-black/25" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-serif text-lg font-light text-ivory">{item.title}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-ivory/60">
                    {item.photographer}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
