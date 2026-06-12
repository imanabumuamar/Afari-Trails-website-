"use client";

import { useEffect, useState } from "react";
import { ArchiveGalleryImagePicker } from "@/components/admin/archive/ArchiveGalleryImagePicker";
import type { ArchiveContentData, ArchiveImageRecord } from "@/types/archive-content";

type ArchiveLatestMomentsEditorProps = {
  momentIds: string[];
  galleryImages: ArchiveImageRecord[];
  readOnly?: boolean;
  onSave: (momentIds: string[]) => void;
  onDocumentSynced?: (data: ArchiveContentData) => void;
  onStatus: (message: string) => void;
};

export function ArchiveLatestMomentsEditor({
  momentIds,
  galleryImages,
  readOnly = false,
  onSave,
  onStatus,
}: ArchiveLatestMomentsEditorProps) {
  const [draft, setDraft] = useState(momentIds);

  useEffect(() => {
    setDraft(momentIds);
  }, [momentIds]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
        onStatus("Latest moments saved.");
        setTimeout(() => onStatus(""), 2500);
      }}
      className="space-y-8"
    >
      <p className="text-sm text-charcoal/60">
        Choose photos from the gallery for the Latest Moments strip. Tick photos
        to include them, then reorder the selected list. Alt text comes from each
        photo&apos;s gallery title.
      </p>

      <ArchiveGalleryImagePicker
        images={galleryImages}
        value={draft}
        readOnly={readOnly}
        onChange={setDraft}
      />

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save latest moments
        </button>
      )}
    </form>
  );
}
