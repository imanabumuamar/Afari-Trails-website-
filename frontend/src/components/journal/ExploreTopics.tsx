"use client";

import type { JournalCategory, JournalCategoryId } from "@/types/journal-content";

type ExploreTopicsProps = {
  categories: JournalCategory[];
  active: JournalCategoryId;
  onChange: (id: JournalCategoryId) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function ExploreTopics({
  categories,
  active,
  onChange,
  search,
  onSearchChange,
}: ExploreTopicsProps) {
  return (
    <section className="border-b border-charcoal/8 bg-ivory py-10 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/45">
              Explore Topics
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onChange(cat.id)}
                  className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    active === cat.id
                      ? "bg-charcoal text-ivory"
                      : "border border-charcoal/15 text-charcoal/60 hover:border-charcoal/30 hover:text-charcoal"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm">
            <label htmlFor="journal-search" className="sr-only">
              Search journal
            </label>
            <input
              id="journal-search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search journal"
              className="w-full border border-charcoal/15 bg-beige/50 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal/30 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
