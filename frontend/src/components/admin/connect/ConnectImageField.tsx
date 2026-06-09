"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

    setUploading(true);
    onStatus(`Uploading ${label}…`);

    const res = await fetch("/api/admin/content/connect/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    const doc = (await res.json()) as {
      data?: ConnectContentData;
      error?: string;
      warning?: string;
    };

    if (!res.ok || !doc.data) {
      onStatus(
        doc.error ??
          `Upload failed for ${label}. Use a JPG, PNG, or WebP image.`,
      );
      return;
    }

    const data = doc.data;
    onDocumentSynced?.(data);

    const newSrc =
      resolvePath(data as unknown as Record<string, unknown>, fieldPath) ?? src;
    onUploaded(newSrc);
    setUrlDraft(newSrc);
    onStatus(doc.warning ?? `${label} updated and saved.`);
    setTimeout(() => onStatus(""), doc.warning ? 5000 : 2500);
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
              className="bg-charcoal px-5 py-2 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
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
            <AdminField label="Image URL">
              <input
                type="url"
                value={urlDraft}
                placeholder="https://…"
                onChange={(e) => {
                  setUrlDraft(e.target.value);
                  onUploaded(e.target.value);
                }}
                className="w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm"
              />
              <p className="mt-1 text-[10px] text-charcoal/45">
                After pasting a URL, click Save connect pages to keep it.
              </p>
            </AdminField>
          )}
        </>
      )}
    </div>
  );
}
