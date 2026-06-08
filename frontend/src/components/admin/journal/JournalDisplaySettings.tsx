"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { JournalStoryRecord } from "@/types/journal-content";
import { HOMEPAGE_JOURNAL_STORY_LIMIT } from "@/lib/journal/helpers";

const inputClass =
  "w-full max-w-[120px] border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";

type JournalDisplaySettingsProps = {
  stories: JournalStoryRecord[];
  latestStorySlugs: string[];
  homepageStorySlugs: string[];
  latestInitialCount: number;
  readOnly?: boolean;
  onSave: (value: {
    latestStorySlugs: string[];
    homepageStorySlugs: string[];
    latestInitialCount: number;
  }) => void;
};

function StorySlugPicker({
  title,
  description,
  stories,
  selectedSlugs,
  maxCount,
  readOnly,
  onChange,
}: {
  title: string;
  description: string;
  stories: JournalStoryRecord[];
  selectedSlugs: string[];
  maxCount?: number;
  readOnly?: boolean;
  onChange: (slugs: string[]) => void;
}) {
  const published = stories.filter((s) => s.published !== false);

  function toggle(slug: string) {
    if (readOnly) return;
    onChange(
      selectedSlugs.includes(slug)
        ? selectedSlugs.filter((s) => s !== slug)
        : maxCount && selectedSlugs.length >= maxCount
          ? selectedSlugs
          : [...selectedSlugs, slug],
    );
  }

  function move(slug: string, dir: -1 | 1) {
    if (readOnly) return;
    const i = selectedSlugs.indexOf(slug);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= selectedSlugs.length) return;
    const next = [...selectedSlugs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-serif text-xl font-light text-charcoal">{title}</h4>
        <p className="mt-2 max-w-2xl text-sm text-charcoal/60">{description}</p>
        {maxCount && (
          <p className="mt-1 text-xs text-charcoal/45">
            Select up to {maxCount} published stories.
          </p>
        )}
      </div>
      <ul className="space-y-2">
        {published.map((story) => {
          const checked = selectedSlugs.includes(story.slug);
          const orderIndex = selectedSlugs.indexOf(story.slug);
          const atMax =
            maxCount !== undefined &&
            selectedSlugs.length >= maxCount &&
            !checked;

          return (
            <li
              key={story.slug}
              className="flex flex-wrap items-center gap-3 rounded border border-charcoal/10 bg-beige/30 px-4 py-3"
            >
              <label
                className={`flex flex-1 items-center gap-3 ${atMax ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={readOnly || atMax}
                  onChange={() => toggle(story.slug)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-charcoal">
                  <strong>{story.title}</strong>
                  <span className="ml-2 text-charcoal/50">
                    {story.categoryLabel}
                  </span>
                </span>
              </label>
              {checked && !readOnly && (
                <span className="flex gap-1">
                  <button
                    type="button"
                    className="border border-charcoal/20 px-2 py-1 text-xs"
                    onClick={() => move(story.slug, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="border border-charcoal/20 px-2 py-1 text-xs"
                    onClick={() => move(story.slug, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <span className="px-2 text-xs text-charcoal/45">
                    #{orderIndex + 1}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {selectedSlugs.length === 0 && (
        <p className="text-xs text-charcoal/45">
          None selected — the site will use automatic defaults (see note above).
        </p>
      )}
    </div>
  );
}

export function JournalDisplaySettings({
  stories,
  latestStorySlugs,
  homepageStorySlugs,
  latestInitialCount,
  readOnly = false,
  onSave,
}: JournalDisplaySettingsProps) {
  const [latestSlugs, setLatestSlugs] = useState(latestStorySlugs);
  const [homeSlugs, setHomeSlugs] = useState(homepageStorySlugs);
  const [initialCount, setInitialCount] = useState(latestInitialCount);

  useEffect(() => {
    setLatestSlugs(latestStorySlugs);
    setHomeSlugs(homepageStorySlugs);
    setInitialCount(latestInitialCount);
  }, [latestStorySlugs, homepageStorySlugs, latestInitialCount]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      latestStorySlugs: latestSlugs,
      homepageStorySlugs: homeSlugs.slice(0, HOMEPAGE_JOURNAL_STORY_LIMIT),
      latestInitialCount: Math.max(1, initialCount),
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-10">
      <p className="max-w-2xl text-sm text-charcoal/60">
        Control which published stories appear in the{" "}
        <strong className="font-medium text-charcoal">Latest Stories</strong>{" "}
        grid on <code className="text-charcoal">/journal</code> and on the{" "}
        <strong className="font-medium text-charcoal">homepage</strong>. Use{" "}
        <strong className="font-medium text-charcoal">Published</strong> on each
        story to hide it entirely.
      </p>

      <AdminFieldRow
        label="Stories shown before “Show more”"
        hint="Visitors click Show more to reveal the rest of your Latest selection."
      >
        <input
          type="number"
          min={1}
          max={24}
          className={inputClass}
          value={initialCount}
          disabled={readOnly}
          onChange={(e) =>
            setInitialCount(Math.max(1, Number(e.target.value) || 4))
          }
        />
      </AdminFieldRow>

      <StorySlugPicker
        title="Latest Stories (journal page)"
        description="Choose and order stories in the Latest Stories grid. Leave empty to show all published stories that are not main/side featured."
        stories={stories}
        selectedSlugs={latestSlugs}
        readOnly={readOnly}
        onChange={setLatestSlugs}
      />

      <StorySlugPicker
        title="Homepage — From the Journal"
        description="Choose up to three stories for the homepage journal section."
        stories={stories}
        selectedSlugs={homeSlugs}
        maxCount={HOMEPAGE_JOURNAL_STORY_LIMIT}
        readOnly={readOnly}
        onChange={setHomeSlugs}
      />

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save display settings
        </button>
      )}
    </form>
  );
}

function AdminFieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
        {label}
      </p>
      {hint && <p className="mt-1 text-sm text-charcoal/55">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}
