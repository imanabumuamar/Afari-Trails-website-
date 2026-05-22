"use client";

import { journalCategories, type JournalCategory } from "@/lib/data/journal";

type ExploreTopicsProps = {
  active: JournalCategory;
  onChange: (category: JournalCategory) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16 16" />
    </svg>
  );
}

export function ExploreTopics({
  active,
  onChange,
  search,
  onSearchChange,
}: ExploreTopicsProps) {
  return (
    <section id="topics" className="scroll-mt-24 border-b border-charcoal/10 bg-beige py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/50">
              Explore by Topic
            </p>
            <div className="-mb-px flex gap-7 overflow-x-auto pb-px scrollbar-none md:gap-9">
              {journalCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onChange(cat.id)}
                  className={`shrink-0 border-b pb-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    active === cat.id
                      ? "border-charcoal text-charcoal"
                      : "border-transparent text-charcoal/45 hover:text-charcoal/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-xs items-center gap-3 border-b border-charcoal/20 pb-2 lg:w-56">
            <label htmlFor="journal-search" className="sr-only">
              Search journal
            </label>
            <input
              id="journal-search"
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search journal"
              className="min-w-0 flex-1 bg-transparent text-[10px] uppercase tracking-[0.18em] text-charcoal placeholder:text-charcoal/40 focus:outline-none"
            />
            <SearchIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
