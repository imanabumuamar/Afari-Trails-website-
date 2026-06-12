"use client";

import { useEffect, useRef, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
import {
  createBlankArchiveCollection,
  slugifyCollectionId,
} from "@/lib/archive/collection-slug";
import { ARCHIVE_COLLECTIONS_PREVIEW_COUNT } from "@/lib/archive/archive-visibility";
import type { ArchiveCollection, ArchiveContentData } from "@/types/archive-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

const ICON_OPTIONS = [
  "wildlife",
  "landscapes",
  "expedition",
  "culture",
  "lens",
  "behind",
];

type ArchiveCollectionsEditorProps = {
  collections: ArchiveCollection[];
  readOnly?: boolean;
  onSave: (collections: ArchiveCollection[]) => void;
  onDocumentSynced?: (data: ArchiveContentData) => void;
  onStatus: (message: string) => void;
};

function validateCollections(collections: ArchiveCollection[]): string | null {
  if (collections.length === 0) {
    return "Add at least one collection.";
  }

  const seen = new Set<string>();
  for (const col of collections) {
    const id = slugifyCollectionId(col.id);
    if (!id) return "Each collection needs an ID (slug).";
    if (!col.title.trim()) return `Collection "${id}" needs a title.`;
    if (seen.has(id)) return `Duplicate collection ID: ${id}`;
    seen.add(id);
  }
  return null;
}

function mergeSyncedCollections(
  prev: ArchiveCollection[],
  synced: ArchiveCollection[],
): ArchiveCollection[] {
  const syncedIds = new Set(synced.map((c) => c.id));
  const unsaved = prev.filter((c) => !syncedIds.has(c.id));
  const merged = synced.map((remote) => {
    const local = prev.find((c) => c.id === remote.id);
    if (!local) return remote;
    return {
      ...local,
      image: remote.image || local.image,
    };
  });
  return [...merged, ...unsaved];
}

export function ArchiveCollectionsEditor({
  collections,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ArchiveCollectionsEditorProps) {
  const [draft, setDraft] = useState(collections);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAllInList, setShowAllInList] = useState(false);
  const collectionsRef = useRef(collections);

  useEffect(() => {
    if (collectionsRef.current === collections) return;
    collectionsRef.current = collections;
    setDraft((prev) => mergeSyncedCollections(prev, collections));
    setSelectedIndex((idx) => Math.min(idx, Math.max(collections.length - 1, 0)));
  }, [collections]);

  function updateCollection(index: number, patch: Partial<ArchiveCollection>) {
    const next = [...draft];
    next[index] = { ...next[index], ...patch };
    setDraft(next);
  }

  function moveCollection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[index], next[target]] = [next[target], next[index]];
    setDraft(next);
    setSelectedIndex(target);
  }

  function addCollection() {
    const next = [...draft, createBlankArchiveCollection()];
    setDraft(next);
    setSelectedIndex(next.length - 1);
    setShowAllInList(true);
    onStatus("New collection added — fill in details and click Save collections.");
    setTimeout(() => onStatus(""), 3000);
  }

  function removeCollection(index: number) {
    const col = draft[index];
    if (
      !window.confirm(
        `Remove "${col.title || col.id}"? Gallery images in this category will need updating.`,
      )
    ) {
      return;
    }
    const next = draft.filter((_, idx) => idx !== index);
    setDraft(next);
    setSelectedIndex((idx) => Math.min(idx, Math.max(next.length - 1, 0)));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = draft.map((col) => ({
      ...col,
      id: slugifyCollectionId(col.id),
      title: col.title.trim(),
      description: col.description.trim(),
      hidden: col.hidden === true,
    }));
    const error = validateCollections(normalized);
    if (error) {
      onStatus(error);
      return;
    }
    setDraft(normalized);
    onSave(normalized);
  }

  const selected = draft[selectedIndex];
  const listVisibleCount = showAllInList
    ? draft.length
    : Math.min(ARCHIVE_COLLECTIONS_PREVIEW_COUNT, draft.length);
  const hiddenListCount = Math.max(draft.length - listVisibleCount, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-sm text-charcoal/60">
        Reorder, hide, add, or remove collections. Order here controls the
        archive page. Hidden collections stay saved but are removed from the
        live site. The public page shows six collection cards with a show-more
        option for the rest.
      </p>

      <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          {!readOnly && (
            <button
              type="button"
              className="w-full border border-dashed border-charcoal/25 py-2.5 text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:border-charcoal/40"
              onClick={addCollection}
            >
              + Add collection
            </button>
          )}

          <ul className="space-y-1 border border-charcoal/10">
            {draft.slice(0, listVisibleCount).map((col, i) => (
              <CollectionListItem
                key={`${col.id}-${i}`}
                col={col}
                index={i}
                total={draft.length}
                selected={selectedIndex === i}
                readOnly={readOnly}
                onSelect={() => setSelectedIndex(i)}
                onMove={moveCollection}
                onToggleHidden={() =>
                  updateCollection(i, { hidden: col.hidden !== true })
                }
                onRemove={() => removeCollection(i)}
              />
            ))}
          </ul>

          {hiddenListCount > 0 && (
            <button
              type="button"
              className="w-full border border-charcoal/15 py-2 text-xs uppercase tracking-[0.18em] text-charcoal/55 hover:border-charcoal/30"
              onClick={() => setShowAllInList(true)}
            >
              Show {hiddenListCount} more
            </button>
          )}

          {showAllInList && draft.length > ARCHIVE_COLLECTIONS_PREVIEW_COUNT && (
            <button
              type="button"
              className="w-full py-1 text-xs uppercase tracking-[0.18em] text-charcoal/45 hover:text-charcoal/70"
              onClick={() => setShowAllInList(false)}
            >
              Show fewer
            </button>
          )}
        </div>

        {selected ? (
          <div className="space-y-6 border border-charcoal/10 bg-beige/15 p-5 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                {selected.title || "Untitled collection"}
              </p>
              <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                #{selectedIndex + 1} of {draft.length}
              </span>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded border border-charcoal/12 bg-ivory px-4 py-3">
              <input
                type="checkbox"
                className="shrink-0"
                checked={selected.hidden !== true}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(selectedIndex, { hidden: !e.target.checked })
                }
              />
              <span className="text-sm text-charcoal">
                Show on live archive page
              </span>
            </label>

            <AdminField label="ID (slug)">
              <input
                className={inputClass}
                value={selected.id}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(selectedIndex, {
                    id: slugifyCollectionId(e.target.value),
                  })
                }
              />
              <p className="mt-1 text-[10px] text-charcoal/45">
                Lowercase letters, numbers, and hyphens only.
              </p>
            </AdminField>

            <AdminField label="Title">
              <input
                className={inputClass}
                value={selected.title}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(selectedIndex, { title: e.target.value })
                }
              />
            </AdminField>

            <AdminField label="Description">
              <textarea
                className={textareaClass}
                rows={2}
                value={selected.description}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(selectedIndex, { description: e.target.value })
                }
              />
            </AdminField>

            <AdminField label="Icon">
              <select
                className={inputClass}
                value={selected.icon}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(selectedIndex, { icon: e.target.value })
                }
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </AdminField>

            <p className="text-xs text-charcoal/50">
              Save this collection before uploading a card image for new
              collections.
            </p>

            <ArchiveImageField
              fieldPath="image"
              label="Card image"
              src={selected.image}
              collectionId={selected.id}
              readOnly={readOnly}
              onUploaded={(src) =>
                updateCollection(selectedIndex, { image: src })
              }
              onDocumentSynced={onDocumentSynced}
              onStatus={onStatus}
            />
          </div>
        ) : (
          <p className="text-sm text-charcoal/60">
            Add a collection or select one from the list.
          </p>
        )}
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save collections
        </button>
      )}
    </form>
  );
}

function CollectionListItem({
  col,
  index,
  total,
  selected,
  readOnly,
  onSelect,
  onMove,
  onToggleHidden,
  onRemove,
}: {
  col: ArchiveCollection;
  index: number;
  total: number;
  selected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggleHidden: () => void;
  onRemove: () => void;
}) {
  return (
    <li
      className={`border-b border-charcoal/8 last:border-b-0 ${
        selected ? "bg-charcoal text-ivory" : "bg-ivory"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span>
          <span className="block text-sm font-medium">{col.title || col.id}</span>
          <span
            className={`text-[10px] uppercase tracking-[0.12em] ${
              selected ? "text-ivory/55" : "text-charcoal/45"
            }`}
          >
            {col.id}
            {col.hidden === true && " · hidden"}
          </span>
        </span>
      </button>

      {!readOnly && (
        <div
          className={`flex flex-wrap items-center gap-2 px-3 pb-2.5 ${
            selected ? "text-ivory/70" : "text-charcoal/50"
          }`}
        >
          <button
            type="button"
            className="border border-current/25 px-2 py-0.5 text-[10px] uppercase"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="border border-current/25 px-2 py-0.5 text-[10px] uppercase"
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            className="text-[10px] uppercase tracking-[0.1em] underline-offset-2 hover:underline"
            onClick={onToggleHidden}
          >
            {col.hidden === true ? "Show" : "Hide"}
          </button>
          {total > 1 && (
            <button
              type="button"
              className="text-[10px] uppercase tracking-[0.1em] text-red-800/80 hover:text-red-900"
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </li>
  );
}
