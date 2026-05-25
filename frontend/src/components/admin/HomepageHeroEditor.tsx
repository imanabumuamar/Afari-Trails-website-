"use client";

import Image from "next/image";
import { useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type { HomepageContent, HomepageHero } from "@/types/homepage";

type HomepageHeroEditorProps = {
  hero: HomepageHero;
  onHeroChange: (hero: HomepageHero) => void;
  onStatus: (message: string) => void;
  readOnly?: boolean;
};

export function HomepageHeroEditor({
  hero,
  onHeroChange,
  onStatus,
  readOnly = false,
}: HomepageHeroEditorProps) {
  const [draft, setDraft] = useState(hero);
  const [saving, setSaving] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  function updateDraft(patch: Partial<HomepageHero>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function saveCopy(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    onStatus("Saving hero text…");

    const res = await fetch("/api/admin/content/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hero: draft }),
    });

    setSaving(false);

    if (!res.ok) {
      onStatus(await readAdminApiError(res, "Failed to save hero text."));
      return;
    }

    const data = (await res.json()) as HomepageContent;
    onHeroChange(data.hero);
    setDraft(data.hero);
    onStatus("Hero text saved.");
  }

  async function uploadPoster(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("field", "hero.poster");
    formData.set("alt", draft.poster.alt);

    setUploadingPoster(true);
    onStatus("Uploading hero poster…");

    const res = await fetch("/api/admin/content/homepage/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingPoster(false);

    if (!res.ok) {
      onStatus("Poster upload failed.");
      return;
    }

    const data = (await res.json()) as HomepageContent;
    onHeroChange(data.hero);
    setDraft(data.hero);
    onStatus("Hero poster updated.");
    form.reset();
  }

  async function uploadVideo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("field", "hero.video");

    setUploadingVideo(true);
    onStatus("Uploading hero video (may take a moment)…");

    const res = await fetch("/api/admin/content/homepage/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingVideo(false);

    if (!res.ok) {
      onStatus("Video upload failed. Use MP4 format.");
      return;
    }

    const data = (await res.json()) as HomepageContent;
    onHeroChange(data.hero);
    setDraft(data.hero);
    onStatus("Hero video updated.");
    form.reset();
  }

  return (
    <article className="rounded border border-charcoal/15 bg-ivory p-6 md:col-span-2">
      <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-charcoal">
        Hero section
      </h2>
      <p className="mt-2 text-xs text-charcoal/55">
        Headline, subtext, buttons, poster image, and background video.
      </p>

      <div className="relative mt-6 aspect-[21/9] overflow-hidden bg-sand-light/40">
        <Image
          src={draft.poster.src}
          alt={draft.poster.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      <p className="mt-2 text-xs text-charcoal/50">
        Video: <code className="break-all">{draft.video}</code>
      </p>

      <form
        onSubmit={readOnly ? (e) => e.preventDefault() : saveCopy}
        className="mt-8 space-y-4 border-t border-charcoal/10 pt-8"
      >
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Text & buttons
        </h3>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Headline
          </label>
          <textarea
            value={draft.heading}
            onChange={(e) => updateDraft({ heading: e.target.value })}
            rows={3}
            readOnly={readOnly}
            className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Subtext
          </label>
          <textarea
            value={draft.subtext}
            onChange={(e) => updateDraft({ subtext: e.target.value })}
            rows={3}
            readOnly={readOnly}
            className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Primary button label
            </label>
            <input
              type="text"
              value={draft.primaryCta.label}
              onChange={(e) =>
                updateDraft({
                  primaryCta: { ...draft.primaryCta, label: e.target.value },
                })
              }
              readOnly={readOnly}
              className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60"
            />
            <label className="mt-3 block text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Primary link
            </label>
            <input
              type="text"
              value={draft.primaryCta.href}
              onChange={(e) =>
                updateDraft({
                  primaryCta: { ...draft.primaryCta, href: e.target.value },
                })
              }
              readOnly={readOnly}
              className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Secondary button label
            </label>
            <input
              type="text"
              value={draft.secondaryCta.label}
              onChange={(e) =>
                updateDraft({
                  secondaryCta: { ...draft.secondaryCta, label: e.target.value },
                })
              }
              readOnly={readOnly}
              className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60"
            />
            <label className="mt-3 block text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Secondary link
            </label>
            <input
              type="text"
              value={draft.secondaryCta.href}
              onChange={(e) =>
                updateDraft({
                  secondaryCta: { ...draft.secondaryCta, href: e.target.value },
                })
              }
              readOnly={readOnly}
              className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60"
            />
          </div>
        </div>
        {!readOnly && (
          <button
            type="submit"
            disabled={saving}
            className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save hero text"}
          </button>
        )}
      </form>

      {!readOnly && (
      <form onSubmit={uploadPoster} className="mt-8 space-y-4 border-t border-charcoal/10 pt-8">
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Poster image (fallback & video thumbnail)
        </h3>
        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="block w-full text-sm"
        />
        <input
          type="text"
          value={draft.poster.alt}
          onChange={(e) =>
            updateDraft({ poster: { ...draft.poster, alt: e.target.value } })
          }
          placeholder="Alt text"
          className="w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={uploadingPoster}
          className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
        >
          {uploadingPoster ? "Uploading…" : "Upload poster"}
        </button>
      </form>
      )}

      {!readOnly && (
      <form onSubmit={uploadVideo} className="mt-8 space-y-4 border-t border-charcoal/10 pt-8">
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Background video (MP4)
        </h3>
        <input
          name="video"
          type="file"
          accept="video/mp4"
          className="block w-full text-sm"
        />
        <button
          type="submit"
          disabled={uploadingVideo}
          className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
        >
          {uploadingVideo ? "Uploading…" : "Upload video"}
        </button>
      </form>
      )}
    </article>
  );
}
