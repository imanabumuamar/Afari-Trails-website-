"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
import type { ArchiveContentData, ArchiveLatestMoment } from "@/types/archive-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";

type ArchiveLatestMomentsEditorProps = {
  moments: ArchiveLatestMoment[];
  readOnly?: boolean;
  onSave: (moments: ArchiveLatestMoment[]) => void;
  onDocumentSynced?: (data: ArchiveContentData) => void;
  onStatus: (message: string) => void;
};

export function ArchiveLatestMomentsEditor({
  moments,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ArchiveLatestMomentsEditorProps) {
  const [draft, setDraft] = useState(moments);

  useEffect(() => {
    setDraft(moments);
  }, [moments]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
      className="space-y-8"
    >
      <p className="text-sm text-charcoal/60">
        Thumbnail strip in the Latest Moments section.
      </p>
      {draft.map((moment, i) => (
        <div key={moment.id} className="space-y-4 border-t border-charcoal/10 pt-6">
          <p className="text-xs text-charcoal/45">Moment {i + 1}</p>
          <AdminField label="Alt text">
            <input
              className={inputClass}
              value={moment.alt}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...draft];
                next[i] = { ...moment, alt: e.target.value };
                setDraft(next);
              }}
            />
          </AdminField>
          <ArchiveImageField
            fieldPath="image"
            label="Thumbnail"
            src={moment.image}
            alt={moment.alt}
            momentId={moment.id}
            readOnly={readOnly}
            onUploaded={(src) => {
              const next = [...draft];
              next[i] = { ...moment, image: src };
              setDraft(next);
            }}
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      ))}
      {!readOnly && (
        <>
          <button
            type="button"
            className="text-xs uppercase tracking-[0.2em] text-charcoal/55"
            onClick={() =>
              setDraft([
                ...draft,
                {
                  id: `lm-${Date.now()}`,
                  alt: "",
                  image:
                    "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=600&q=85",
                },
              ])
            }
          >
            + Add moment
          </button>
          <button
            type="submit"
            className="ml-4 bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
          >
            Save latest moments
          </button>
        </>
      )}
    </form>
  );
}
