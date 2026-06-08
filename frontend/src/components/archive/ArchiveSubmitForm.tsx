"use client";

import Link from "next/link";
import { useState } from "react";
import type { ArchivePageContent } from "@/types/archive-content";

type ArchiveSubmitFormProps = {
  submitPage: ArchivePageContent["submitPage"];
};

export function ArchiveSubmitForm({ submitPage }: ArchiveSubmitFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const res = await fetch("/api/archive-submit", {
      method: "POST",
      body: new FormData(form),
    });

    setSubmitting(false);

    if (!res.ok) {
      let message = "Something went wrong. Please try again.";
      try {
        const body = await res.json();
        if (typeof body.error === "string" && body.error) message = body.error;
      } catch {
        // ignore
      }
      setError(message);
      return;
    }

    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <div className="mt-14 space-y-6">
        <p className="text-sm leading-relaxed text-charcoal/75" role="status">
          Thank you — your photo has been submitted. We&apos;ll review it and be in
          touch if it&apos;s selected for The Afari Lens.
        </p>
        <Link
          href={submitPage.backHref}
          className="inline-block text-xs uppercase tracking-[0.25em] text-charcoal/45 hover:text-charcoal"
        >
          ← Back to Archive
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-14 space-y-10">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal focus:border-charcoal/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Email <span className="text-charcoal/35">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal focus:border-charcoal/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            required
            className="mt-3 w-full text-sm text-charcoal/70 file:mr-4 file:border-0 file:bg-transparent file:text-xs file:uppercase file:tracking-[0.15em] file:text-charcoal"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="e.g. South Luangwa, Zambia"
            className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="story"
            className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Story
          </label>
          <textarea
            id="story"
            name="story"
            rows={5}
            required
            placeholder="A few lines about the image and the moment."
            className="mt-3 w-full resize-none border-b border-charcoal/20 bg-transparent py-3 text-sm leading-relaxed text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="instagram"
            className="block text-[10px] uppercase tracking-[0.22em] text-charcoal/50"
          >
            Instagram <span className="text-charcoal/35">(optional)</span>
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            placeholder="@yourhandle"
            className="mt-3 w-full border-b border-charcoal/20 bg-transparent py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-800/80" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>

      <Link
        href={submitPage.backHref}
        className="mt-12 inline-block text-xs uppercase tracking-[0.25em] text-charcoal/45 hover:text-charcoal"
      >
        ← Back to Archive
      </Link>
    </>
  );
}
