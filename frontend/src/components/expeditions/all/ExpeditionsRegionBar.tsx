"use client";

import type { ExpeditionRegion } from "@/lib/data/expeditions-all-page";

type ExpeditionsRegionBarProps = {
  regions: ExpeditionRegion[];
  active: string;
  onChange: (id: string) => void;
};

export function ExpeditionsRegionBar({
  regions,
  active,
  onChange,
}: ExpeditionsRegionBarProps) {
  return (
    <section className="bg-ivory py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
          Browse by region
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => onChange(region.id)}
              className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                active === region.id
                  ? "bg-charcoal text-ivory"
                  : "border border-charcoal/15 text-charcoal/60 hover:border-charcoal/30 hover:text-charcoal"
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
