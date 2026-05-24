"use client";

import { useMemo, useState } from "react";
import { ExploreTopics } from "@/components/journal/ExploreTopics";
import { FeaturedStories } from "@/components/journal/FeaturedStories";
import { JournalHero } from "@/components/journal/JournalHero";
import { JournalNewsletter } from "@/components/journal/JournalNewsletter";
import { StoriesGrid } from "@/components/journal/StoriesGrid";
import {
  getFeaturedSideStories,
  getFeaturedStory,
  getLatestStories,
  getPublishedStories,
} from "@/lib/journal/helpers";
import type { JournalCategoryId, JournalContentData } from "@/types/journal-content";

type JournalPageContentProps = {
  content: JournalContentData;
};

export function JournalPageContent({ content }: JournalPageContentProps) {
  const [active, setActive] = useState<JournalCategoryId>("all");
  const [search, setSearch] = useState("");

  const published = useMemo(
    () => getPublishedStories(content.stories),
    [content.stories],
  );

  const featuredStory = useMemo(
    () => getFeaturedStory(content.stories),
    [content.stories],
  );

  const featuredSideStories = useMemo(
    () => getFeaturedSideStories(content.stories),
    [content.stories],
  );

  const latestStories = useMemo(
    () => getLatestStories(content.stories),
    [content.stories],
  );

  const filteredLatest = useMemo(() => {
    let pool =
      active === "all"
        ? latestStories
        : published.filter(
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
  }, [active, search, latestStories, published]);

  const showFeatured =
    active === "all" && !search.trim() && featuredStory;

  return (
    <>
      <JournalHero hero={content.page.hero} />
      <ExploreTopics
        categories={content.page.categories}
        active={active}
        onChange={setActive}
        search={search}
        onSearchChange={setSearch}
      />
      {showFeatured && (
        <FeaturedStories
          featuredStory={featuredStory}
          featuredSideStories={featuredSideStories}
        />
      )}
      <section id="stories" className="scroll-mt-24 bg-beige py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <StoriesGrid
            stories={filteredLatest}
            showViewAll={active === "all" && !search.trim()}
          />
        </div>
      </section>
      <JournalNewsletter newsletter={content.page.newsletter} />
    </>
  );
}
