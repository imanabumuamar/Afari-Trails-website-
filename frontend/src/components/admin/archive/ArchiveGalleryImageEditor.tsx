"use client";

import { useEffect, useRef, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
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
  onDocumentSynced?: (data: ArchiveContentData) => void;
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
  const [draft, setDraft] = useState(image);
  const idRef = useRef(image.id);

  useEffect(() => {
    if (image.id !== idRef.current) {
      idRef.current = image.id;
      setDraft(image);
    }
  }, [image]);

  function syncFromDocument(data: ArchiveContentData) {
    onDocumentSynced?.(data);
    const updated = data.images.find((i) => i.id === idRef.current);
    if (updated) {
      setDraft((prev) => ({ ...prev, image: updated.image }));
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...draft,
          published: draft.published !== false,
        });
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

      <AdminField label="Category">
        <select
          className={inputClass}
          value={
            collections.some((c) => c.id === draft.category)
              ? draft.category
              : (collections[0]?.id ?? "")
          }
          disabled={readOnly || collections.length === 0}
          onChange={(e) =>
            setDraft({
              ...draft,
              category: e.target.value,
            })
          }
        >
          {collections.length === 0 ? (
            <option value="">Add a collection first</option>
          ) : (
            collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))
          )}
        </select>
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
        readOnly={readOnly}
        onUploaded={(src) => setDraft({ ...draft, image: src })}
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
