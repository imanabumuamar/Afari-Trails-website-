"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
import {
  createBlankArchiveCollection,
  slugifyCollectionId,
} from "@/lib/archive/collection-slug";
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

export function ArchiveCollectionsEditor({
  collections,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ArchiveCollectionsEditorProps) {
  const [draft, setDraft] = useState(collections);

  useEffect(() => {
    setDraft(collections);
  }, [collections]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = draft.map((col) => ({
      ...col,
      id: slugifyCollectionId(col.id),
      title: col.title.trim(),
      description: col.description.trim(),
    }));
    const error = validateCollections(normalized);
    if (error) {
      onStatus(error);
      return;
    }
    setDraft(normalized);
    onSave(normalized);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-charcoal/60">
          Collection cards in the dark &ldquo;Explore Collections&rdquo; section.
          New collections also appear in the gallery filter and image category list.
        </p>
        {!readOnly && (
          <button
            type="button"
            className="shrink-0 border border-charcoal/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-charcoal/70 hover:border-charcoal/50"
            onClick={() => setDraft([...draft, createBlankArchiveCollection()])}
          >
            + Add collection
          </button>
        )}
      </div>

      {draft.map((col, i) => (
        <div key={`${col.id}-${i}`} className="space-y-4 border-t border-charcoal/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
              {col.title || "Untitled collection"}
            </p>
            {!readOnly && draft.length > 1 && (
              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.12em] text-red-800/70 hover:text-red-900"
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove "${col.title || col.id}"? Gallery images assigned to this collection will need a new category.`,
                    )
                  ) {
                    setDraft(draft.filter((_, idx) => idx !== i));
                  }
                }}
              >
                Remove
              </button>
            )}
          </div>

          <AdminField label="ID (slug)">
            <input
              className={inputClass}
              value={col.id}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...draft];
                next[i] = { ...col, id: slugifyCollectionId(e.target.value) };
                setDraft(next);
              }}
            />
            <p className="mt-1 text-[10px] text-charcoal/45">
              Used in URLs and image folders. Lowercase letters, numbers, and hyphens only.
            </p>
          </AdminField>

          <AdminField label="Title">
            <input
              className={inputClass}
              value={col.title}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...draft];
                next[i] = { ...col, title: e.target.value };
                setDraft(next);
              }}
            />
          </AdminField>

          <AdminField label="Description">
            <textarea
              className={textareaClass}
              rows={2}
              value={col.description}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...draft];
                next[i] = { ...col, description: e.target.value };
                setDraft(next);
              }}
            />
          </AdminField>

          <AdminField label="Icon">
            <select
              className={inputClass}
              value={col.icon}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...draft];
                next[i] = { ...col, icon: e.target.value };
                setDraft(next);
              }}
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </AdminField>

          <ArchiveImageField
            fieldPath="image"
            label="Card image"
            src={col.image}
            collectionId={col.id}
            readOnly={readOnly}
            onUploaded={(src) => {
              const next = [...draft];
              next[i] = { ...col, image: src };
              setDraft(next);
            }}
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      ))}

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
