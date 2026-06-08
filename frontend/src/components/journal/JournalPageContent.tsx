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
  getLatestStoriesForGrid,
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
    () =>
      getLatestStoriesForGrid(content.stories, content.latestStorySlugs),
    [content.stories, content.latestStorySlugs],
  );

  const isSearching = search.trim().length > 0;

  const filteredLatest = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (q) {
      return published.filter((s) => {
        if (active !== "all" && s.category !== active) return false;
        return (
          s.title.toLowerCase().includes(q) ||
          s.excerpt.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q) ||
          (s.body?.toLowerCase().includes(q) ?? false)
        );
      });
    }

    if (active === "all") {
      return latestStories;
    }

    return published.filter(
      (s) =>
        !s.featured &&
        !s.featuredSide &&
        s.category === active,
    );
  }, [active, search, latestStories, published]);

  const showFeatured =
    active === "all" && !isSearching && featuredStory;

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
            showViewAll={active === "all" && !isSearching}
            initialCount={content.page.latestInitialCount}
            isSearchActive={isSearching}
          />
        </div>
      </section>
      <JournalNewsletter newsletter={content.page.newsletter} />
    </>
  );
}
