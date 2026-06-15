"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  applyCommunityStoryListingStatus,
  COMMUNITY_STORY_LISTING_OPTIONS,
  getCommunityStoryListingStatus,
  type CommunityArchiveStoryItem,
} from "@/lib/ventures/community-stories-shared";

type ArchiveStory = {
  id: string;
  title: string;
  location: string;
  photographer: string;
  caption: string;
  category: string;
  image: string;
};

type ArchiveStoryPickerProps = {
  value: CommunityArchiveStoryItem[];
  readOnly?: boolean;
  onChange: (items: CommunityArchiveStoryItem[]) => void;
};

export function ArchiveStoryPicker({
  value,
  readOnly = false,
  onChange,
}: ArchiveStoryPickerProps) {
  const [stories, setStories] = useState<ArchiveStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/archive-stories");
        if (!res.ok) throw new Error("Failed to load archive");
        const data = (await res.json()) as { stories: ArchiveStory[] };
        if (active) setStories(data.stories ?? []);
      } catch {
        if (active) setError("Could not load archive stories.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedIds = value.map((item) => item.archiveId);

  function getItem(archiveId: string): CommunityArchiveStoryItem | undefined {
    return value.find((item) => item.archiveId === archiveId);
  }

  function toggle(archiveId: string) {
    if (readOnly) return;
    onChange(
      selectedIds.includes(archiveId)
        ? value.filter((item) => item.archiveId !== archiveId)
        : [...value, { archiveId, published: true }],
    );
  }

  function setItemStatus(
    archiveId: string,
    status: ReturnType<typeof getCommunityStoryListingStatus>,
  ) {
    if (readOnly) return;
    const item = getItem(archiveId);
    if (!item) return;
    onChange(
      value.map((entry) =>
        entry.archiveId === archiveId
          ? applyCommunityStoryListingStatus(entry, status)
          : entry,
      ),
    );
  }

  function move(archiveId: string, dir: -1 | 1) {
    if (readOnly) return;
    const i = value.findIndex((item) => item.archiveId === archiveId);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-4 border-t border-charcoal/10 pt-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Stories from the archive
        </p>
        <p className="mt-2 text-sm text-charcoal/60">
          Select archive photos for this section, set their order, and publish or
          hide each one. If you select none, the default story cards below are
          used instead.
        </p>
      </div>

      {loading && <p className="text-sm text-charcoal/55">Loading archive…</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}

      {!loading && !error && stories.length === 0 && (
        <p className="text-sm text-charcoal/55">No archive entries found.</p>
      )}

      <ul className="space-y-3">
        {stories.map((story) => {
          const item = getItem(story.id);
          const checked = Boolean(item);
          const orderIndex = selectedIds.indexOf(story.id);
          const listingStatus = item
            ? getCommunityStoryListingStatus(item)
            : "hidden";

          return (
            <li
              key={story.id}
              className="rounded border border-charcoal/10 bg-beige/30 px-3 py-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={readOnly}
                    onChange={() => toggle(story.id)}
                    className="h-4 w-4 shrink-0"
                  />
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-charcoal/10">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </span>
                  <span className="text-sm text-charcoal">
                    <strong className="font-medium">{story.title}</strong>
                    <span className="ml-2 text-charcoal/50">{story.location}</span>
                    <span className="ml-2 text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                      {story.category}
                    </span>
                  </span>
                </label>
                {checked && !readOnly && (
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      className="rounded border border-charcoal/20 px-2 py-1 text-xs"
                      onClick={() => move(story.id, -1)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded border border-charcoal/20 px-2 py-1 text-xs"
                      aria-label="Move down"
                      onClick={() => move(story.id, 1)}
                    >
                      ↓
                    </button>
                    <span className="px-1 text-xs text-charcoal/45">
                      #{orderIndex + 1}
                    </span>
                  </span>
                )}
              </div>

              {checked && (
                <div className="mt-3 space-y-2 border-t border-charcoal/10 pt-3">
                  {COMMUNITY_STORY_LISTING_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer gap-3 rounded border px-3 py-2 transition-colors ${
                        listingStatus === option.value
                          ? "border-safari-green/35 bg-ivory"
                          : "border-charcoal/10 bg-ivory/60"
                      } ${readOnly ? "cursor-default" : "hover:border-charcoal/25"}`}
                    >
                      <input
                        type="radio"
                        name={`community-archive-status-${story.id}`}
                        className="mt-0.5 shrink-0"
                        checked={listingStatus === option.value}
                        disabled={readOnly}
                        onChange={() => setItemStatus(story.id, option.value)}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-charcoal">
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-charcoal/50">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
