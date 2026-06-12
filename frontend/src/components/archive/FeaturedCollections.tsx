"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CollectionIcon } from "@/components/archive/CollectionIcon";
import { ARCHIVE_COLLECTIONS_PREVIEW_COUNT } from "@/lib/archive/archive-visibility";
import type {
  ArchiveCollection,
  ArchiveGridCategory,
  ArchivePageContent,
} from "@/types/archive-content";

type FeaturedCollectionsProps = {
  collections: ArchiveCollection[];
  section: ArchivePageContent["collectionsSection"];
  onSelect: (id: ArchiveGridCategory) => void;
};

export function FeaturedCollections({
  collections,
  section,
  onSelect,
}: FeaturedCollectionsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = collections;
  const hasMore = visible.length > ARCHIVE_COLLECTIONS_PREVIEW_COUNT;
  const displayed = expanded
    ? visible
    : visible.slice(0, ARCHIVE_COLLECTIONS_PREVIEW_COUNT);

  if (visible.length === 0) return null;

  return (
    <section id="collections" className="scroll-mt-24 bg-matte-black py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-ivory/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-sand">
              {section.label}
            </p>
            <p className="mt-3 text-sm text-ivory/55">{section.heading}</p>
          </div>
          <Link
            href={section.viewAllHref}
            className="shrink-0 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/50 transition-colors hover:text-sand"
          >
            View All Collections →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {displayed.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => {
                onSelect(col.id);
                document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover-zoom group relative min-h-[280px] overflow-hidden text-left lg:min-h-[320px]"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/92 via-matte-black/35 to-matte-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <CollectionIcon type={col.icon} />
                <h2 className="mt-4 font-serif text-xl font-light uppercase tracking-wide text-ivory md:text-2xl">
                  {col.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-ivory/60">
                  {col.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="border border-ivory/35 px-8 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
            >
              {expanded
                ? "Show fewer collections"
                : `Show ${visible.length - ARCHIVE_COLLECTIONS_PREVIEW_COUNT} more collections`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
