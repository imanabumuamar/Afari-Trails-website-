"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type { StoreContentData } from "@/types/store-content";

type StoreImageFieldProps = {
  fieldPath: string;
  label: string;
  src: string;
  alt?: string;
  readOnly?: boolean;
  onUploaded: (src: string) => void;
  onDocumentSynced?: (data: StoreContentData) => void;
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

export function StoreImageField({
  fieldPath,
  label,
  src,
  alt = "",
  readOnly = false,
  onUploaded,
  onDocumentSynced,
  onStatus,
}: StoreImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);
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

    setUploading(true);
    onStatus(`Uploading ${label}…`);

    const res = await fetch("/api/admin/content/store/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      onStatus(
        await readAdminApiError(
          res,
          `Upload failed for ${label}. Use a JPG, PNG, or WebP image.`,
        ),
      );
      return;
    }

    const doc = await res.json();
    const data = doc.data as StoreContentData;
    onDocumentSynced?.(data);

    const newSrc =
      resolvePath(data as unknown as Record<string, unknown>, fieldPath) ?? src;
    onUploaded(newSrc);
    setUrlDraft(newSrc);
    onStatus(`${label} updated and saved.`);
    setTimeout(() => onStatus(""), 2500);
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
        <div className="relative aspect-[16/9] max-h-56 overflow-hidden bg-sand-light/40">
          <Image src={src} alt={alt} fill className="object-cover" sizes="400px" />
        </div>
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-charcoal px-5 py-2 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
          >
            {uploading ? "Uploading…" : src ? "Replace image" : "Choose image"}
          </button>
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
