"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
      className="space-y-10"
    >
      <p className="text-sm text-charcoal/60">
        Collection cards in the dark &ldquo;Explore Collections&rdquo; section.
      </p>
      {draft.map((col, i) => (
        <div key={col.id} className="space-y-4 border-t border-charcoal/10 pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            {col.title} ({col.id})
          </p>
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
