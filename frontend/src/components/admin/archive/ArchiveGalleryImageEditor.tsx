"use client";

import { useEffect, useRef, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import {
  ArchiveImageField,
  type ArchiveDocumentSyncedHandler,
} from "@/components/admin/archive/ArchiveImageField";
import { normalizeArchiveImage } from "@/lib/archive/image-categories";
import type {
  ArchiveCollection,
  ArchiveContentData,
  ArchiveImageRecord,
} from "@/types/archive-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type ArchiveGalleryImageEditorProps = {
  image: ArchiveImageRecord;
  collections: ArchiveCollection[];
  readOnly?: boolean;
  onSave: (image: ArchiveImageRecord) => void;
  onDocumentSynced?: ArchiveDocumentSyncedHandler;
  onStatus: (message: string) => void;
};

export function ArchiveGalleryImageEditor({
  image,
  collections,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ArchiveGalleryImageEditorProps) {
  const [draft, setDraft] = useState(() => normalizeArchiveImage(image));
  const idRef = useRef(image.id);

  useEffect(() => {
    if (image.id !== idRef.current) {
      idRef.current = image.id;
      setDraft(normalizeArchiveImage(image));
      return;
    }
    setDraft((prev) => {
      const next = normalizeArchiveImage(image);
      if (
        prev.image === next.image &&
        prev.published === next.published &&
        prev.categories.join() === next.categories.join()
      ) {
        return prev;
      }
      return { ...prev, image: next.image, published: next.published, categories: next.categories };
    });
  }, [image]);

  function toggleCategory(collectionId: string) {
    setDraft((prev) => {
      const has = prev.categories.includes(collectionId);
      if (has && prev.categories.length <= 1) {
        onStatus("Each photo needs at least one collection.");
        setTimeout(() => onStatus(""), 2500);
        return prev;
      }
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((id) => id !== collectionId)
          : [...prev.categories, collectionId],
      };
    });
  }

  function syncFromDocument(
    data: ArchiveContentData,
    updatedAt?: string | null,
  ) {
    onDocumentSynced?.(data, updatedAt);
    const updated = data.images.find((i) => i.id === idRef.current);
    if (updated) {
      setDraft((prev) => ({ ...prev, image: updated.image }));
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const normalized = normalizeArchiveImage(draft);
        if (normalized.categories.length === 0) {
          onStatus("Choose at least one collection.");
          return;
        }
        onSave(normalized);
        onStatus("Image saved.");
        setTimeout(() => onStatus(""), 2500);
      }}
      className="space-y-8"
    >
      <h3 className="font-serif text-2xl font-light">{draft.title}</h3>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.published !== false}
          disabled={readOnly}
          onChange={(e) =>
            setDraft({ ...draft, published: e.target.checked })
          }
        />
        Published (show in gallery)
      </label>

      <AdminField label="ID (slug)">
        <input className={inputClass} value={draft.id} disabled readOnly />
      </AdminField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Title">
          <input
            className={inputClass}
            value={draft.title}
            disabled={readOnly}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </AdminField>
        <AdminField label="Photographer">
          <input
            className={inputClass}
            value={draft.photographer}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, photographer: e.target.value })
            }
          />
        </AdminField>
      </div>

      <AdminField label="Location">
        <input
          className={inputClass}
          value={draft.location}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
        />
      </AdminField>

      <AdminField label="Caption">
        <textarea
          className={textareaClass}
          rows={3}
          value={draft.caption}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
        />
      </AdminField>

      <AdminField label="Collections">
        {collections.length === 0 ? (
          <p className="text-sm text-charcoal/55">Add a collection first.</p>
        ) : (
          <ul className="space-y-2">
            {collections.map((col) => {
              const checked = draft.categories.includes(col.id);
              return (
                <li key={col.id}>
                  <label className="flex cursor-pointer items-center gap-3 rounded border border-charcoal/10 bg-ivory px-3 py-2.5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0"
                      checked={checked}
                      disabled={readOnly}
                      onChange={() => toggleCategory(col.id)}
                    />
                    <span className="text-sm text-charcoal">{col.title}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-[10px] text-charcoal/45">
          Tick every collection this photo should appear in.
        </p>
      </AdminField>

      <AdminField label="Grid span">
        <select
          className={inputClass}
          value={draft.span ?? ""}
          disabled={readOnly}
          onChange={(e) =>
            setDraft({
              ...draft,
              span: (e.target.value || undefined) as "tall" | "wide" | undefined,
            })
          }
        >
          <option value="">Default</option>
          <option value="tall">Tall (2 rows)</option>
          <option value="wide">Wide (2 columns)</option>
        </select>
      </AdminField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Related link label">
          <input
            className={inputClass}
            value={draft.related?.label ?? ""}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({
                ...draft,
                related: e.target.value
                  ? { label: e.target.value, href: draft.related?.href ?? "" }
                  : undefined,
              })
            }
          />
        </AdminField>
        <AdminField label="Related link URL">
          <input
            className={inputClass}
            value={draft.related?.href ?? ""}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({
                ...draft,
                related: draft.related?.label || e.target.value
                  ? {
                      label: draft.related?.label ?? "Learn more",
                      href: e.target.value,
                    }
                  : undefined,
              })
            }
          />
        </AdminField>
      </div>

      <ArchiveImageField
        fieldPath="image"
        label="Gallery image"
        src={draft.image}
        alt={draft.title}
        imageId={draft.id}
        galleryRecord={{
          ...draft,
          published: draft.published !== false,
        }}
        readOnly={readOnly}
        onUploaded={(src) => setDraft((prev) => ({ ...prev, image: src }))}
        onDocumentSynced={syncFromDocument}
        onStatus={onStatus}
      />

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save image
        </button>
      )}
    </form>
  );
}
