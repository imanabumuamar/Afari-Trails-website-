"use client";

import { useMemo, useState } from "react";
import { ExploreTopics } from "@/components/journal/ExploreTopics";
import { JournalHero } from "@/components/journal/JournalHero";
import { JournalNewsletter } from "@/components/journal/JournalNewsletter";
import { StoriesGrid } from "@/components/journal/StoriesGrid";
import { getPublishedStories } from "@/lib/journal/helpers";
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

  const isSearching = search.trim().length > 0;

  const filteredStories = useMemo(() => {
    const q = search.trim().toLowerCase();
    let stories =
      active === "all"
        ? published
        : published.filter((s) => s.category === active);

    if (!q) return stories;

    return stories.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        (s.body?.toLowerCase().includes(q) ?? false),
    );
  }, [active, search, published]);

  const gridHeading =
    active === "all"
      ? "All Stories"
      : (content.page.categories.find((c) => c.id === active)?.label ??
        "Stories");

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
      <section id="stories" className="scroll-mt-24 bg-beige py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <StoriesGrid
            stories={filteredStories}
            heading={gridHeading}
            showViewAll={false}
            initialCount={filteredStories.length}
            isSearchActive={isSearching}
          />
        </div>
      </section>
      <JournalNewsletter newsletter={content.page.newsletter} />
    </>
  );
}
