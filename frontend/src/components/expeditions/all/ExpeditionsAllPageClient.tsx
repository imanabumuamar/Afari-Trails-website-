"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExpeditionsRegionBar } from "@/components/expeditions/all/ExpeditionsRegionBar";
import { ROUTES } from "@/config/routes";
import type { ExpeditionsAllPageContent } from "@/lib/data/expedition-defaults";
import type { ExpeditionCatalogItem } from "@/types/expeditions-content";

type ExpeditionsAllPageClientProps = {
  expeditions: ExpeditionCatalogItem[];
  allPage: ExpeditionsAllPageContent;
};

export function ExpeditionsAllPageClient({
  expeditions,
  allPage,
}: ExpeditionsAllPageClientProps) {
  const [activeRegion, setActiveRegion] = useState("all");
  const { cta, regions } = allPage;

  const filtered = useMemo(() => {
    if (activeRegion === "all") return expeditions;
    return expeditions.filter((exp) => exp.regionId === activeRegion);
  }, [activeRegion, expeditions]);

  return (
    <>
      <ExpeditionsRegionBar
        regions={regions}
        active={activeRegion}
        onChange={setActiveRegion}
      />

      <section className="bg-ivory pb-20 pt-10 lg:pb-28 lg:pt-12">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-charcoal/50">
              No expeditions in this region yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filtered.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/expeditions/${exp.id}`}
                  className="group"
                >
                  <div className="hover-zoom relative aspect-[4/5] overflow-hidden bg-charcoal/10">
                    <Image
                      src={exp.heroImage}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-matte-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/55">
                        {exp.comingSoon ? "Coming soon" : exp.location}
                      </p>
                      <h2 className="mt-2 font-serif text-xl font-light text-ivory md:text-2xl">
                        {exp.name}
                      </h2>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm leading-relaxed text-charcoal/60">
                      {exp.tagline}
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/45 transition-colors group-hover:text-gold">
                      {exp.comingSoon ? "Preview journey" : exp.duration}
                      <span className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-24 border-t border-charcoal/10 pt-16 text-center">
            <p className="font-serif text-2xl font-light text-charcoal md:text-3xl">
              {cta.heading}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-charcoal/60">
              {cta.body}
            </p>
            <Link
              href={ROUTES.expeditionsConnect}
              className="mt-10 inline-block border border-charcoal/25 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-gold hover:text-gold"
            >
              {cta.buttonLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
