"use client";

import { useMemo, useState } from "react";
import { ExploreTopics } from "@/components/journal/ExploreTopics";
import { FeaturedStories } from "@/components/journal/FeaturedStories";
import { JournalHero } from "@/components/journal/JournalHero";
import { JournalNewsletter } from "@/components/journal/JournalNewsletter";
import { StoriesGrid } from "@/components/journal/StoriesGrid";
import { journalStories, latestStories, type JournalCategory } from "@/lib/data/journal";

export function JournalPageContent() {
  const [active, setActive] = useState<JournalCategory>("all");
  const [search, setSearch] = useState("");

  const filteredLatest = useMemo(() => {
    let pool =
      active === "all"
        ? latestStories
        : journalStories.filter(
            (s) =>
              !s.featured &&
              !s.featuredSide &&
              s.category === active,
          );

    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.excerpt.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q),
      );
    }

    return pool;
  }, [active, search]);

  return (
    <>
      <JournalHero />
      <ExploreTopics
        active={active}
        onChange={setActive}
        search={search}
        onSearchChange={setSearch}
      />
      {active === "all" && !search.trim() && <FeaturedStories />}
      <section id="stories" className="scroll-mt-24 bg-beige py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <StoriesGrid
            stories={filteredLatest}
            showViewAll={active === "all" && !search.trim()}
          />
        </div>
      </section>
      <JournalNewsletter />
    </>
  );
}
