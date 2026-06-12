"use client";

import { useEffect, useRef, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
import { COMMUNITY_LENS_EDITIONS_HREF } from "@/lib/archive/collection-filter";
import type {
  ArchiveContentData,
  ArchivePageContent,
} from "@/types/archive-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type AfariLensContent = ArchivePageContent["afariLens"];

type ArchiveAfariLensEditorProps = {
  afariLens: AfariLensContent;
  readOnly?: boolean;
  onSave: (afariLens: AfariLensContent) => void;
  onDocumentSynced?: (
    data: ArchiveContentData,
    updatedAt?: string | null,
  ) => void;
  onStatus: (message: string) => void;
};

export function ArchiveAfariLensEditor({
  afariLens,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ArchiveAfariLensEditorProps) {
  const [draft, setDraft] = useState(afariLens);
  const imageRef = useRef(afariLens.image);

  // Merge image from server after upload — never reset the whole form on save.
  useEffect(() => {
    if (afariLens.image !== imageRef.current) {
      imageRef.current = afariLens.image;
      setDraft((prev) => ({ ...prev, image: afariLens.image }));
    }
  }, [afariLens.image]);

  function syncFromDocument(
    data: ArchiveContentData,
    updatedAt?: string | null,
  ) {
    onDocumentSynced?.(data, updatedAt);
    const updated = data.page.afariLens;
    imageRef.current = updated.image;
    setDraft((prev) => ({ ...prev, image: updated.image }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
        onStatus("Photograph of the Month saved.");
        setTimeout(() => onStatus(""), 2500);
      }}
      className="space-y-8"
    >
      <div>
        <h3 className="font-serif text-2xl font-light">Photograph of the Month</h3>
        <p className="mt-2 text-sm text-charcoal/55">
          The spotlight block on the archive page. Uploading a photo also adds it
          to the Community Lens gallery.
        </p>
      </div>

      <div className="space-y-4">
        {(
          [
            ["label", "Eyebrow label"],
            ["heading", "Section heading"],
            ["title", "Photo title"],
            ["photographer", "Photographer name"],
          ] as const
        ).map(([key, label]) => (
          <AdminField key={key} label={label}>
            <input
              className={inputClass}
              value={draft[key]}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({ ...draft, [key]: e.target.value })
              }
            />
          </AdminField>
        ))}

        <AdminField label="Story">
          <textarea
            className={textareaClass}
            rows={4}
            value={draft.story}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, story: e.target.value })
            }
          />
        </AdminField>

        <ArchiveImageField
          fieldPath="afariLens.image"
          label="Spotlight photo"
          src={draft.image}
          alt={draft.title}
          readOnly={readOnly}
          onUploaded={(src) => {
            imageRef.current = src;
            setDraft({ ...draft, image: src });
          }}
          onDocumentSynced={syncFromDocument}
          onStatus={onStatus}
        />
      </div>

      <div className="space-y-4 border-t border-charcoal/10 pt-8">
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Buttons
        </h4>

        <AdminField label="View Community Lens button">
          <input
            className={inputClass}
            value={draft.entriesLabel}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, entriesLabel: e.target.value })
            }
          />
        </AdminField>
        <AdminField label="View Community Lens link">
          <input
            className={inputClass}
            value={draft.entriesHref}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, entriesHref: e.target.value })
            }
          />
        </AdminField>

        <AdminField label="Explore Previous Editions label (below)">
          <input
            className={inputClass}
            value={draft.editionsLabel}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, editionsLabel: e.target.value })
            }
          />
        </AdminField>
        <AdminField label="Explore Previous Editions link">
          <input
            className={inputClass}
            value={draft.editionsHref}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, editionsHref: e.target.value })
            }
          />
          <p className="mt-1 text-[10px] text-charcoal/45">
            Default: {COMMUNITY_LENS_EDITIONS_HREF} (Community Lens gallery)
          </p>
        </AdminField>

        <AdminField label="Submit page link">
          <input
            className={inputClass}
            value={draft.submitHref}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, submitHref: e.target.value })
            }
          />
          <p className="mt-1 text-[10px] text-charcoal/45">
            Used by other archive CTAs that point to the submit form.
          </p>
        </AdminField>
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save Photograph of the Month
        </button>
      )}
    </form>
  );
}
