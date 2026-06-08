"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
  value: string[];
  readOnly?: boolean;
  onChange: (ids: string[]) => void;
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

  function toggle(id: string) {
    if (readOnly) return;
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id],
    );
  }

  function move(id: string, dir: -1 | 1) {
    if (readOnly) return;
    const i = value.indexOf(id);
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
          Tick the archive photos to feature here. Use the arrows to set their
          order. If you select none, the default cards above show instead.
        </p>
      </div>

      {loading && <p className="text-sm text-charcoal/55">Loading archive…</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}

      {!loading && !error && stories.length === 0 && (
        <p className="text-sm text-charcoal/55">No archive entries found.</p>
      )}

      <ul className="space-y-2">
        {stories.map((story) => {
          const checked = value.includes(story.id);
          const orderIndex = value.indexOf(story.id);
          return (
            <li
              key={story.id}
              className="flex flex-wrap items-center gap-3 rounded border border-charcoal/10 bg-beige/30 px-3 py-2"
            >
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
                    onClick={() => move(story.id, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <span className="px-1 text-xs text-charcoal/45">
                    #{orderIndex + 1}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
