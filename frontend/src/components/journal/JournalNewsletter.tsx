"use client";

import Image from "next/image";
import { useState } from "react";
import { submitInquiry } from "@/lib/inquiry/submit-inquiry";
import type { JournalPageContent } from "@/types/journal-content";

type JournalNewsletterProps = {
  newsletter: JournalPageContent["newsletter"];
};

const SUCCESS_MESSAGE = "Welcome — we'll be in touch.";

export function JournalNewsletter({ newsletter }: JournalNewsletterProps) {
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const result = await submitInquiry({
      source: "newsletter",
      email: String(data.get("email") ?? "").trim(),
      website: String(data.get("website") ?? "").trim() || undefined,
    });

    setSubmitting(false);
    if (result.ok) {
      setJoined(true);
      return;
    }
    setError(result.error);
  }

  return (
    <section className="relative min-h-[420px] lg:min-h-[480px]">
      <Image
        src={newsletter.image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/70" />
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center lg:px-10 lg:py-32">
        <h2 className="max-w-2xl font-serif text-3xl font-light text-ivory md:text-4xl lg:text-5xl">
          {newsletter.heading}
        </h2>

        {joined ? (
          <p className="mt-10 text-sm text-ivory/70" role="status">
            {SUCCESS_MESSAGE}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <label htmlFor="journal-email" className="sr-only">
              Email address
            </label>
            <input
              id="journal-email"
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 border border-ivory/30 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-ivory focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-sand px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-sand-light disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Subscribe"}
            </button>
            {error && (
              <p className="w-full text-sm text-ivory/80 sm:col-span-2" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
