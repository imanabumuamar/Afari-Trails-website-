"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ArchiveContentData } from "@/types/archive-content";

type ArchiveImageFieldProps = {
  fieldPath: string;
  label: string;
  src: string;
  alt?: string;
  imageId?: string;
  collectionId?: string;
  momentId?: string;
  readOnly?: boolean;
  onUploaded: (src: string) => void;
  onDocumentSynced?: (data: ArchiveContentData) => void;
  onStatus: (message: string) => void;
};

export function ArchiveImageField({
  fieldPath,
  label,
  src,
  alt = "",
  imageId,
  collectionId,
  momentId,
  readOnly = false,
  onUploaded,
  onDocumentSynced,
  onStatus,
}: ArchiveImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);
  const [showUrl, setShowUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlDraft(src);
  }, [src]);

  async function uploadFile(file: File) {
    if (file.size === 0) return;
    if (!file.type.startsWith("image/")) {
      onStatus("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    const formData = new FormData();
    formData.set("field", fieldPath);
    formData.set("image", file);
    if (imageId) formData.set("imageId", imageId);
    if (collectionId) formData.set("collectionId", collectionId);
    if (momentId) formData.set("momentId", momentId);

    setUploading(true);
    onStatus(`Uploading ${label}…`);

    const res = await fetch("/api/admin/content/archive/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      onStatus(`Upload failed for ${label}. Use a JPG, PNG, or WebP image.`);
      return;
    }

    const doc = await res.json();
    const data = doc.data as ArchiveContentData;
    onDocumentSynced?.(data);

    let newSrc = src;
    if (imageId) {
      newSrc = data.images.find((i) => i.id === imageId)?.image ?? src;
    } else if (collectionId) {
      newSrc =
        data.collections.find((c) => c.id === collectionId)?.image ?? src;
    } else if (momentId) {
      newSrc =
        data.latestMoments.find((m) => m.id === momentId)?.image ?? src;
    } else {
      newSrc =
        resolvePath(data.page as unknown as Record<string, unknown>, fieldPath) ??
        src;
    }

    onUploaded(newSrc);
    setUrlDraft(newSrc);
    onStatus(`${label} updated and saved.`);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-4 border-t border-charcoal/10 pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
        {label}
      </p>
      {src && (
        <div className="relative aspect-[16/9] max-h-56 overflow-hidden rounded bg-sand-light/40">
          <Image src={src} alt={alt} fill className="object-cover" sizes="400px" />
        </div>
      )}
      {src ? (
        <p className="break-all text-xs text-charcoal/50">{src}</p>
      ) : (
        <p className="text-xs text-charcoal/45">No image yet</p>
      )}

      {!readOnly && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded bg-charcoal px-5 py-2 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
            >
              {uploading ? "Uploading…" : src ? "Replace photo" : "Choose photo"}
            </button>
            <span className="text-xs text-charcoal/55">
              Photos save automatically — no need to click Save.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="text-[10px] uppercase tracking-[0.2em] text-charcoal/45 underline-offset-2 hover:underline"
          >
            {showUrl ? "Hide URL option" : "Or paste an image URL"}
          </button>
          {showUrl && (
            <div>
              <input
                type="url"
                value={urlDraft}
                placeholder="https://…"
                onChange={(e) => {
                  setUrlDraft(e.target.value);
                  onUploaded(e.target.value);
                }}
                className="mt-1 w-full rounded border border-charcoal/20 bg-beige px-3 py-2 text-sm"
              />
              <p className="mt-1 text-[10px] text-charcoal/45">
                After pasting a URL, click the section&apos;s Save button to keep it.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function resolvePath(root: Record<string, unknown>, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc)) return acc[Number(part)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, root);
  return typeof value === "string" ? value : undefined;
}
