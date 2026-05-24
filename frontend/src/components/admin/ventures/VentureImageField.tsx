"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { VentureSlug } from "@/lib/data/venture-defaults";

type VentureImageFieldProps = {
  slug: VentureSlug;
  fieldPath: string;
  label: string;
  src: string;
  alt?: string;
  readOnly?: boolean;
  onUploaded: (src: string) => void;
  onStatus: (message: string) => void;
};

export function VentureImageField({
  slug,
  fieldPath,
  label,
  src,
  alt = "",
  readOnly = false,
  onUploaded,
  onStatus,
}: VentureImageFieldProps) {
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

    const res = await fetch(`/api/admin/content/ventures/${slug}/upload`, {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      onStatus(`Upload failed for ${label}.`);
      return;
    }

    const doc = await res.json();
    const parts = fieldPath.split(".");
    let value: unknown = doc.data;
    for (const part of parts) {
      if (value && typeof value === "object") {
        value = Array.isArray(value)
          ? value[Number(part)]
          : (value as Record<string, unknown>)[part];
      }
    }
    const newSrc = typeof value === "string" ? value : src;

    onUploaded(newSrc);
    setUrlDraft(newSrc);
    onStatus(`${label} image updated.`);
    form.reset();
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
      <p className="break-all text-xs text-charcoal/50">{src}</p>

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
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-charcoal/45">
              Or paste image URL
            </label>
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => {
                setUrlDraft(e.target.value);
                onUploaded(e.target.value);
              }}
              className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
            />
          </div>
        </>
      )}
    </div>
  );
}
