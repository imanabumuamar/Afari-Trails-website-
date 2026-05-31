"use client";

import Image from "next/image";
import { useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  HeroHeight,
  HeroTextAlign,
  HeroTextColor,
  HeroVerticalPosition,
  HomepageContent,
  HomepageHero,
} from "@/types/homepage";

function chip(active: boolean) {
  return `rounded border px-4 py-2 text-sm capitalize disabled:opacity-50 ${
    active
      ? "border-charcoal bg-charcoal text-ivory"
      : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
  }`;
}

const fieldClass =
  "mt-2 w-full rounded border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60";
const labelClass = "block text-sm font-medium text-charcoal";
const sectionClass = "rounded-lg border border-charcoal/15 bg-beige/40 p-5";
const sectionTitle = "font-serif text-lg font-light text-charcoal";

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

  async function persistHero(
    heroToSave: HomepageHero,
    savingMessage: string,
    successMessage: string,
  ) {
    setSaving(true);
    onStatus(savingMessage);

    const res = await fetch("/api/admin/content/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hero: heroToSave }),
    });

    setSaving(false);

    if (!res.ok) {
      onStatus(await readAdminApiError(res, "Failed to save hero."));
      return;
    }

    const data = (await res.json()) as HomepageContent;
    onHeroChange(data.hero);
    setDraft(data.hero);
    onStatus(successMessage);
  }

  async function saveAll(e: React.FormEvent) {
    e.preventDefault();
    await persistHero(draft, "Saving…", "Hero saved. Refresh the homepage to see it.");
  }

  async function removeVideo() {
    if (readOnly || !draft.video) return;
    const next = { ...draft, video: "" };
    setDraft(next);
    await persistHero(
      next,
      "Removing video…",
      "Video removed — the homepage now shows the photo.",
    );
  }

  async function uploadPoster(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement | null;
    if (!fileInput?.files?.length) {
      onStatus("Choose a photo first, then click Upload photo.");
      return;
    }
    const formData = new FormData(form);
    formData.set("field", "hero.poster");
    formData.set("alt", draft.poster.alt);

    setUploadingPoster(true);
    onStatus("Uploading photo…");

    const res = await fetch("/api/admin/content/homepage/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingPoster(false);

    if (!res.ok) {
      onStatus("Photo upload failed. Use a JPG, PNG, or WebP image.");
      return;
    }

    const data = (await res.json()) as HomepageContent;
    onHeroChange(data.hero);
    setDraft(data.hero);
    onStatus("Photo updated. Refresh the homepage to see it.");
    form.reset();
  }

  async function uploadVideo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("video") as HTMLInputElement | null;
    if (!fileInput?.files?.length) {
      onStatus("Choose an MP4 video first, then click Upload video.");
      return;
    }
    const formData = new FormData(form);
    formData.set("field", "hero.video");

    setUploadingVideo(true);
    onStatus("Uploading video (this can take a moment)…");

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
    onStatus("Video updated. Refresh the homepage to see it.");
    form.reset();
  }

  return (
    <article className="rounded border border-charcoal/15 bg-ivory p-6 md:col-span-2">
      <h2 className="font-serif text-2xl font-light text-charcoal">
        Hero — the top of your homepage
      </h2>
      <p className="mt-2 text-sm text-charcoal/60">
        This is the big banner visitors see first. Set the background, the words,
        and the buttons below.
      </p>

      <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-lg bg-sand-light/40">
        <Image
          src={draft.poster.src}
          alt={draft.poster.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <span className="absolute left-3 top-3 rounded bg-matte-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-ivory">
          Live now: {draft.video ? "Video background" : "Photo background"}
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {/* STEP 1 — BACKGROUND */}
        <section className={sectionClass}>
          <h3 className={sectionTitle}>1. Background</h3>
          <p className="mt-1 text-sm text-charcoal/60">
            {draft.video
              ? "A video is currently the background. Upload a new one, or remove it to use a photo."
              : "A photo is currently the background. Upload a new photo, or add a video for a moving background."}
          </p>

          {!readOnly && (
            <>
              <form onSubmit={uploadPoster} className="mt-5 space-y-3">
                <label className={labelClass}>Background photo</label>
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
                  placeholder="Short description of the photo (for accessibility)"
                  className="w-full rounded border border-charcoal/20 bg-beige px-4 py-3 text-sm"
                />
                <button
                  type="submit"
                  disabled={uploadingPoster}
                  className="rounded bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
                >
                  {uploadingPoster ? "Uploading…" : "Upload photo"}
                </button>
              </form>

              <form onSubmit={uploadVideo} className="mt-6 space-y-3 border-t border-charcoal/10 pt-5">
                <label className={labelClass}>
                  Background video <span className="text-charcoal/45">(optional, MP4)</span>
                </label>
                <input
                  name="video"
                  type="file"
                  accept="video/mp4"
                  className="block w-full text-sm"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={uploadingVideo}
                    className="rounded bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
                  >
                    {uploadingVideo ? "Uploading…" : "Upload video"}
                  </button>
                  {draft.video && (
                    <button
                      type="button"
                      onClick={removeVideo}
                      disabled={saving}
                      className="rounded border border-charcoal/30 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-charcoal/75 hover:border-charcoal/60 disabled:opacity-40"
                    >
                      Remove video
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </section>

        {/* STEP 2 & 3 — TEXT + BUTTONS + ADVANCED (one save) */}
        <form
          onSubmit={readOnly ? (e) => e.preventDefault() : saveAll}
          className="space-y-6"
        >
          <section className={sectionClass}>
            <h3 className={sectionTitle}>2. Words</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className={labelClass}>
                  Small label above the title{" "}
                  <span className="text-charcoal/45">(optional)</span>
                </label>
                <input
                  type="text"
                  value={draft.eyebrow}
                  onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                  readOnly={readOnly}
                  placeholder="e.g. Welcome to Afari Trails"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Title (big headline)</label>
                <textarea
                  value={draft.heading}
                  onChange={(e) => updateDraft({ heading: e.target.value })}
                  rows={2}
                  readOnly={readOnly}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <textarea
                  value={draft.subtext}
                  onChange={(e) => updateDraft({ subtext: e.target.value })}
                  rows={3}
                  readOnly={readOnly}
                  className={fieldClass}
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className={sectionTitle}>3. Buttons</h3>
            <div className="mt-4 space-y-6">
              <div className="rounded border border-charcoal/10 bg-ivory p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={draft.showPrimaryCta}
                    disabled={readOnly}
                    onChange={(e) => updateDraft({ showPrimaryCta: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Main button
                </label>
                {draft.showPrimaryCta && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-charcoal/55">Button text</label>
                      <input
                        type="text"
                        value={draft.primaryCta.label}
                        onChange={(e) =>
                          updateDraft({
                            primaryCta: { ...draft.primaryCta, label: e.target.value },
                          })
                        }
                        readOnly={readOnly}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-charcoal/55">
                        Where it goes (link)
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
                        placeholder="/expeditions"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded border border-charcoal/10 bg-ivory p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                  <input
                    type="checkbox"
                    checked={draft.showSecondaryCta}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateDraft({ showSecondaryCta: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  Second button
                </label>
                {draft.showSecondaryCta && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs text-charcoal/55">Button text</label>
                      <input
                        type="text"
                        value={draft.secondaryCta.label}
                        onChange={(e) =>
                          updateDraft({
                            secondaryCta: { ...draft.secondaryCta, label: e.target.value },
                          })
                        }
                        readOnly={readOnly}
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-charcoal/55">
                        Where it goes (link)
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
                        placeholder="/ventures"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <details className={sectionClass}>
            <summary className="cursor-pointer select-none font-serif text-lg font-light text-charcoal">
              4. Look &amp; position{" "}
              <span className="text-sm text-charcoal/45">(optional — click to open)</span>
            </summary>
            <div className="mt-5 space-y-5">
              <div>
                <span className={labelClass}>Text alignment</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["left", "center"] as HeroTextAlign[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={readOnly}
                      onClick={() => updateDraft({ textAlign: v })}
                      className={chip(draft.textAlign === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelClass}>Text position</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["top", "center", "bottom"] as HeroVerticalPosition[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={readOnly}
                      onClick={() => updateDraft({ verticalPosition: v })}
                      className={chip(draft.verticalPosition === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelClass}>Text color</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["light", "dark"] as HeroTextColor[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={readOnly}
                      onClick={() => updateDraft({ textColor: v })}
                      className={chip(draft.textColor === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelClass}>Banner height</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["full", "tall", "medium"] as HeroHeight[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={readOnly}
                      onClick={() => updateDraft({ height: v })}
                      className={chip(draft.height === v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Background darkness ({draft.overlayOpacity}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={draft.overlayOpacity}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateDraft({ overlayOpacity: Number(e.target.value) })
                  }
                  className="mt-3 w-full max-w-md"
                />
                <p className="mt-1 text-xs text-charcoal/45">
                  Darker makes light text easier to read over busy photos/video.
                </p>
              </div>
            </div>
          </details>

          {!readOnly && (
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-charcoal px-8 py-3 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save words, buttons & look"}
            </button>
          )}
        </form>
      </div>
    </article>
  );
}
