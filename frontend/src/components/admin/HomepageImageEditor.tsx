"use client";

import Image from "next/image";
import { useState } from "react";
import type { ContentImage, HomepageImageField } from "@/types/homepage";
import { HOMEPAGE_IMAGE_FIELDS } from "@/types/homepage";

type HomepageImageEditorProps = {
  field: HomepageImageField;
  image: ContentImage;
  onUpdated: (image: ContentImage) => void;
  onStatus: (message: string) => void;
};

export function HomepageImageEditor({
  field,
  image,
  onUpdated,
  onStatus,
}: HomepageImageEditorProps) {
  const [alt, setAlt] = useState(image.alt);
  const [uploading, setUploading] = useState(false);
  const meta = HOMEPAGE_IMAGE_FIELDS[field];

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("field", field);
    formData.set("alt", alt);

    setUploading(true);
    onStatus(`Uploading ${meta.label}…`);

    const res = await fetch("/api/admin/content/homepage/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (res.status === 401) {
      onStatus("Session expired. Sign in again.");
      return;
    }

    if (!res.ok) {
      onStatus(`Upload failed for ${meta.label}.`);
      return;
    }

    const data = await res.json();
    const updated =
      field === "ourEssence"
        ? data.ourEssence
        : data.featureCards[field.split(".")[1] as keyof typeof data.featureCards];

    onUpdated(updated);
    setAlt(updated.alt);
    onStatus(`Updated ${meta.label}.`);
    form.reset();
  }

  return (
    <article className="rounded border border-charcoal/15 bg-ivory p-6">
      <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-charcoal">
        {meta.label}
      </h2>
      <div className="relative mt-4 aspect-[4/3] overflow-hidden bg-sand-light/40">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <p className="mt-2 break-all text-xs text-charcoal/50">{image.src}</p>

      <form onSubmit={handleUpload} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Replace image
          </label>
          <input
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="mt-2 block w-full text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Alt text
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
        >
          {uploading ? "Uploading…" : "Save image"}
        </button>
      </form>
    </article>
  );
}
