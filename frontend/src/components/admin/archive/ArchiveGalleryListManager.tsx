"use client";

import { useMemo, useState } from "react";
import type { ArchiveImageRecord } from "@/types/archive-content";
import { createBlankArchiveImage } from "@/lib/archive/blank-image";

type ArchiveGalleryListManagerProps = {
  images: ArchiveImageRecord[];
  defaultCategory?: string;
  selectedId: string | null;
  readOnly?: boolean;
  onSelect: (id: string) => void;
  onAdd: (image: ArchiveImageRecord) => void;
  onRemove: (id: string) => void;
  onReorder: (id: string, direction: -1 | 1) => void;
  onTogglePublished: (id: string) => void;
};

type ImageFilter = "all" | "published" | "hidden";

function isPublished(img: ArchiveImageRecord): boolean {
  return img.published !== false;
}

export function ArchiveGalleryListManager({
  images,
  defaultCategory = "wildlife",
  selectedId,
  readOnly = false,
  onSelect,
  onAdd,
  onRemove,
  onReorder,
  onTogglePublished,
}: ArchiveGalleryListManagerProps) {
  const [filter, setFilter] = useState<ImageFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = images;
    if (filter === "published") list = list.filter(isPublished);
    if (filter === "hidden") list = list.filter((i) => !isPublished(i));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q),
      );
    }
    return list;
  }, [images, filter, search]);

  const counts = useMemo(
    () => ({
      all: images.length,
      published: images.filter(isPublished).length,
      hidden: images.filter((i) => !isPublished(i)).length,
    }),
    [images],
  );

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-charcoal/55">
        Reorder with ↑↓. Hide photos with the toggle — hidden images stay saved
        but are removed from the public gallery.
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", `All (${counts.all})`],
            ["published", `Published (${counts.published})`],
            ["hidden", `Hidden (${counts.hidden})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${
              filter === id
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/15 text-charcoal/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Search by title or id…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm"
      />

      {!readOnly && (
        <button
          type="button"
          className="w-full border border-dashed border-charcoal/25 py-2 text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:border-charcoal/40"
          onClick={() => {
            const id = `img-${Date.now()}`;
            onAdd(createBlankArchiveImage(id, defaultCategory));
            onSelect(id);
          }}
        >
          + Add gallery image
        </button>
      )}

      <ul className="max-h-[60vh] space-y-1 overflow-y-auto border border-charcoal/10">
        {filtered.map((img) => {
          const index = images.findIndex((i) => i.id === img.id);
          return (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => onSelect(img.id)}
                className={`flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left text-sm ${
                  selectedId === img.id
                    ? "bg-charcoal text-ivory"
                    : "hover:bg-charcoal/5"
                }`}
              >
                <span>
                  <span className="block font-medium">{img.title}</span>
                  <span
                    className={`text-xs ${
                      selectedId === img.id ? "text-ivory/60" : "text-charcoal/45"
                    }`}
                  >
                    {img.id}
                    {!isPublished(img) && " · hidden"}
                  </span>
                </span>
              </button>

              {!readOnly && (
                <div
                  className={`flex flex-wrap items-center gap-2 px-3 pb-2 ${
                    selectedId === img.id ? "text-ivory/70" : "text-charcoal/50"
                  }`}
                >
                  <button
                    type="button"
                    className="border border-current/25 px-2 py-0.5 text-[10px]"
                    disabled={index <= 0}
                    onClick={() => onReorder(img.id, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="border border-current/25 px-2 py-0.5 text-[10px]"
                    disabled={index < 0 || index >= images.length - 1}
                    onClick={() => onReorder(img.id, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-[0.1em] underline-offset-2 hover:underline"
                    onClick={() => onTogglePublished(img.id)}
                  >
                    {isPublished(img) ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-[0.1em] text-red-800/70 hover:text-red-900"
                    onClick={() => {
                      if (
                        window.confirm(`Remove "${img.title}" from the gallery?`)
                      ) {
                        onRemove(img.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
