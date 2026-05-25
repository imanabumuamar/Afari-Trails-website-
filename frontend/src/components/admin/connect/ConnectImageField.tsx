"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import type { ConnectContentData } from "@/types/connect-content";

type ConnectImageFieldProps = {
  fieldPath: string;
  label: string;
  src: string;
  alt?: string;
  readOnly?: boolean;
  onUploaded: (src: string) => void;
  onDocumentSynced?: (data: ConnectContentData) => void;
  onStatus: (message: string) => void;
};

function resolvePath(root: Record<string, unknown>, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc)) return acc[Number(part)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, root);
  return typeof value === "string" ? value : undefined;
}

export function ConnectImageField({
  fieldPath,
  label,
  src,
  alt = "",
  readOnly = false,
  onUploaded,
  onDocumentSynced,
  onStatus,
}: ConnectImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);

  useEffect(() => {
    setUrlDraft(src);
  }, [src]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("field", fieldPath);

    const file = formData.get("image");
    if (!file || !(file instanceof File) || file.size === 0) {
      onStatus("Choose an image file to upload.");
      return;
    }

    setUploading(true);
    onStatus(`Uploading ${label}…`);

    const res = await fetch("/api/admin/content/connect/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      onStatus(`Upload failed for ${label}.`);
      return;
    }

    const doc = await res.json();
    const data = doc.data as ConnectContentData;
    onDocumentSynced?.(data);

    const newSrc =
      resolvePath(data as unknown as Record<string, unknown>, fieldPath) ?? src;
    onUploaded(newSrc);
    setUrlDraft(newSrc);
    onStatus(`${label} image updated.`);
    form.reset();
    setTimeout(() => onStatus(""), 2500);
  }

  return (
    <div className="space-y-4 border-t border-charcoal/10 pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
        {label}
      </p>
      {src && (
        <div className="relative aspect-[16/9] max-h-56 overflow-hidden bg-sand-light/40">
          <Image src={src} alt={alt} fill className="object-cover" sizes="400px" />
        </div>
      )}
      {!readOnly && (
        <>
          <form onSubmit={handleUpload} className="space-y-3">
            <input
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="block w-full text-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-charcoal px-5 py-2 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
          </form>
          <AdminField label="Or paste image URL">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => {
                setUrlDraft(e.target.value);
                onUploaded(e.target.value);
              }}
              className="w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm"
            />
          </AdminField>
        </>
      )}
    </div>
  );
}
