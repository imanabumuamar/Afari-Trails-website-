"use client";

import { useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { StoreImageField } from "@/components/admin/store/StoreImageField";
import {
  createBlankStoreCollection,
  slugifyStoreCollectionSlug,
} from "@/lib/store/blank-collection";
import type {
  CollectionIconType,
  EditorialCollection,
  StoreContentData,
} from "@/types/store-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;

const COLLECTION_ICONS: CollectionIconType[] = [
  "giraffe",
  "vehicle",
  "campfire",
  "mountains",
  "trail",
  "book",
];

type StoreCollectionsEditorProps = {
  collections: EditorialCollection[];
  readOnly?: boolean;
  setData: React.Dispatch<React.SetStateAction<StoreContentData | null>>;
  setStatus: (message: string) => void;
  onDocumentSynced: (data: StoreContentData) => void;
  onSave: (collections: EditorialCollection[]) => void;
};

export function StoreCollectionsEditor({
  collections,
  readOnly = false,
  setData,
  setStatus,
  onDocumentSynced,
  onSave,
}: StoreCollectionsEditorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(
    Math.max(selectedIndex, 0),
    Math.max(collections.length - 1, 0),
  );
  const selected = collections[safeIndex];

  function setCollections(next: EditorialCollection[]) {
    setData((prev) => (prev ? { ...prev, collections: next } : prev));
  }

  function updateCollection(index: number, patch: Partial<EditorialCollection>) {
    const next = [...collections];
    next[index] = { ...next[index], ...patch };
    setCollections(next);
  }

  function moveCollection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= collections.length) return;
    const next = [...collections];
    [next[index], next[target]] = [next[target], next[index]];
    setCollections(next);
    setSelectedIndex(target);
  }

  function addCollection() {
    const next = [...collections, createBlankStoreCollection()];
    setCollections(next);
    setSelectedIndex(next.length - 1);
    setStatus("New collection added — edit details and click Save store.");
    setTimeout(() => setStatus(""), 3000);
  }

  function removeCollection(index: number) {
    const col = collections[index];
    if (
      !window.confirm(
        `Remove "${col.title || col.slug}" from the store? Products linked to this collection slug will need updating.`,
      )
    ) {
      return;
    }
    const next = collections.filter((_, i) => i !== index);
    setCollections(next);
    setSelectedIndex((idx) => Math.min(idx, Math.max(next.length - 1, 0)));
  }

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-light">Featured collections</h3>
        <p className="mt-2 text-sm text-charcoal/55">
          Reorder with ↑↓. Hide collections to keep them saved but off the live
          store page. Order here controls the grid on /store.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
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
            {collections.map((col, index) => (
              <li
                key={`${col.slug}-${index}`}
                className={`border-b border-charcoal/8 last:border-b-0 ${
                  safeIndex === index ? "bg-charcoal text-ivory" : "bg-ivory"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left"
                >
                  <span>
                    <span className="block text-sm font-medium">
                      {col.title || col.slug}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-[0.12em] ${
                        safeIndex === index
                          ? "text-ivory/55"
                          : "text-charcoal/45"
                      }`}
                    >
                      {col.slug}
                      {col.hidden === true && " · hidden"}
                    </span>
                  </span>
                </button>

                {!readOnly && (
                  <div
                    className={`flex flex-wrap items-center gap-2 px-3 pb-2.5 ${
                      safeIndex === index
                        ? "text-ivory/70"
                        : "text-charcoal/50"
                    }`}
                  >
                    <button
                      type="button"
                      className="border border-current/25 px-2 py-0.5 text-[10px]"
                      disabled={index === 0}
                      onClick={() => moveCollection(index, -1)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="border border-current/25 px-2 py-0.5 text-[10px]"
                      disabled={index === collections.length - 1}
                      onClick={() => moveCollection(index, 1)}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.1em] underline-offset-2 hover:underline"
                      onClick={() =>
                        updateCollection(index, { hidden: col.hidden !== true })
                      }
                    >
                      {col.hidden === true ? "Show" : "Hide"}
                    </button>
                    {collections.length > 1 && (
                      <button
                        type="button"
                        className="text-[10px] uppercase tracking-[0.1em] text-red-800/80 hover:text-red-900"
                        onClick={() => removeCollection(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <div className="space-y-4 border border-charcoal/15 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                {selected.title || "Untitled collection"}
              </p>
              <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                #{safeIndex + 1} of {collections.length}
              </span>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded border border-charcoal/12 bg-ivory px-4 py-3">
              <input
                type="checkbox"
                className="shrink-0"
                checked={selected.hidden !== true}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(safeIndex, { hidden: !e.target.checked })
                }
              />
              <span className="text-sm text-charcoal">
                Show on live store page
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Slug">
                <input
                  className={inputClass}
                  value={selected.slug}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateCollection(safeIndex, {
                      slug: slugifyStoreCollectionSlug(e.target.value),
                    })
                  }
                />
              </AdminField>
              <AdminField label="Title">
                <input
                  className={inputClass}
                  value={selected.title}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateCollection(safeIndex, { title: e.target.value })
                  }
                />
              </AdminField>
              <AdminField label="Icon">
                <select
                  className={inputClass}
                  value={selected.icon}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateCollection(safeIndex, {
                      icon: e.target.value as CollectionIconType,
                    })
                  }
                >
                  {COLLECTION_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>

            <AdminField label="Description">
              <textarea
                className={textareaClass}
                value={selected.description}
                disabled={readOnly}
                onChange={(e) =>
                  updateCollection(safeIndex, { description: e.target.value })
                }
              />
            </AdminField>

            <StoreImageField
              fieldPath={`collections.${safeIndex}.image`}
              label="Collection image"
              src={selected.image}
              readOnly={readOnly}
              onStatus={setStatus}
              onDocumentSynced={onDocumentSynced}
              onUploaded={(src) => updateCollection(safeIndex, { image: src })}
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
          type="button"
          onClick={() => onSave(collections)}
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save collections
        </button>
      )}
    </section>
  );
}
