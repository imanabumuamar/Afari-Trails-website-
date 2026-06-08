"use client";

import { useMemo, useState } from "react";
import type { JournalStoryRecord } from "@/types/journal-content";
import { createBlankStory } from "@/lib/journal/blank-story";

type JournalStoriesListManagerProps = {
  stories: JournalStoryRecord[];
  selectedSlug: string | null;
  readOnly?: boolean;
  onSelect: (slug: string) => void;
  onAdd: (story: JournalStoryRecord) => void;
  onRemove: (slug: string) => void;
};

type StoryFilter = "all" | "published" | "drafts";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublished(story: JournalStoryRecord): boolean {
  return story.published !== false;
}

export function JournalStoriesListManager({
  stories,
  selectedSlug,
  readOnly = false,
  onSelect,
  onAdd,
  onRemove,
}: JournalStoriesListManagerProps) {
  const [newTitle, setNewTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<StoryFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = stories;
    if (filter === "published") {
      list = list.filter(isPublished);
    } else if (filter === "drafts") {
      list = list.filter((s) => !isPublished(s));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q),
      );
    }
    return list;
  }, [stories, filter, search]);

  const counts = useMemo(
    () => ({
      all: stories.length,
      published: stories.filter(isPublished).length,
      drafts: stories.filter((s) => !isPublished(s)).length,
    }),
    [stories],
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(newTitle);
    if (!slug) return;
    onAdd(createBlankStory(slug, newTitle.trim() || "New Story"));
    setNewTitle("");
    setShowAdd(false);
    setFilter("drafts");
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          All stories ({counts.all})
        </h3>
        <p className="mt-1 text-xs text-charcoal/45">
          Select a story in this list to edit it. Scroll if you don&apos;t see
          every title.
        </p>
        {filtered.length !== stories.length && (
          <p className="mt-2 text-xs text-gold-muted">
            Showing {filtered.length} of {stories.length}
            {search.trim() ? " (search active)" : ` (${filter} filter)`}.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {(
          [
            ["all", `All (${counts.all})`],
            ["published", `Published (${counts.published})`],
            ["drafts", `Drafts (${counts.drafts})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] ${
              filter === id
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/15 text-charcoal/55"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search stories…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-charcoal/20 px-3 py-2 text-sm"
      />

      <ul className="max-h-[min(70vh,640px)] min-h-[200px] space-y-1 overflow-y-auto border border-charcoal/10 bg-ivory/50">
        {filtered.length === 0 ? (
          <li className="space-y-3 px-3 py-6 text-sm text-charcoal/50">
            <p>No stories match this filter.</p>
            {stories.length > 0 && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-charcoal underline-offset-2 hover:underline"
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
              >
                Show all {counts.all} stories
              </button>
            )}
            {selectedSlug &&
              !filtered.some((s) => s.slug === selectedSlug) &&
              stories.some((s) => s.slug === selectedSlug) && (
                <p className="text-xs text-charcoal/45">
                  The story you&apos;re editing is hidden by the current filter.
                </p>
              )}
          </li>
        ) : (
          filtered.map((story) => (
            <li key={story.slug}>
              <button
                type="button"
                onClick={() => onSelect(story.slug)}
                className={`w-full px-3 py-2.5 text-left text-sm transition ${
                  selectedSlug === story.slug
                    ? "bg-charcoal text-ivory"
                    : "hover:bg-charcoal/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="block font-medium">{story.title}</span>
                  {isPublished(story) ? (
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${
                        selectedSlug === story.slug
                          ? "bg-ivory/15 text-ivory/80"
                          : "bg-safari-green-deep/10 text-safari-green-deep"
                      }`}
                    >
                      Live
                    </span>
                  ) : (
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${
                        selectedSlug === story.slug
                          ? "bg-ivory/15 text-ivory/70"
                          : "bg-charcoal/8 text-charcoal/45"
                      }`}
                    >
                      Draft
                    </span>
                  )}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    selectedSlug === story.slug ? "text-ivory/70" : "text-charcoal/45"
                  }`}
                >
                  {story.slug}
                  {story.featured ? " · main featured" : ""}
                  {story.featuredSide ? " · side featured" : ""}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>

      {!readOnly && (
        <div className="space-y-3 border-t border-charcoal/10 pt-4">
          {showAdd ? (
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                className="w-full border border-charcoal/20 px-3 py-2 text-sm"
                placeholder="Story title (used for URL slug)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-charcoal py-2 text-xs uppercase tracking-wider text-ivory"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="border border-charcoal/20 px-3 py-2 text-xs"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="w-full border border-dashed border-charcoal/25 py-2 text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:border-charcoal/40"
              onClick={() => setShowAdd(true)}
            >
              + Add story
            </button>
          )}
          {selectedSlug && (
            <button
              type="button"
              className="w-full py-2 text-xs text-red-800/80 hover:underline"
              onClick={() => {
                if (confirm(`Delete "${selectedSlug}"? This cannot be undone.`)) {
                  onRemove(selectedSlug);
                }
              }}
            >
              Delete selected
            </button>
          )}
        </div>
      )}
    </div>
  );
}
