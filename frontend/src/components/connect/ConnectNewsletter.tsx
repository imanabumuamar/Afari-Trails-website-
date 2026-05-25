"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/inquiry/submit-inquiry";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectNewsletterProps = {
  config: ConnectPageConfig;
};

export function ConnectNewsletter({ config }: ConnectNewsletterProps) {
  const newsletter = config.newsletter;
  if (!newsletter) return null;

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
    <section className="bg-safari-green-deep py-20 text-ivory lg:py-28">
      <div className="mx-auto max-w-xl px-6 text-center lg:px-10">
        <h2 className="font-serif text-3xl font-light md:text-4xl">
          {newsletter.heading}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ivory/60">
          {newsletter.subtext}
        </p>

        {joined ? (
          <p className="mt-10 text-sm text-ivory/70" role="status">
            {newsletter.successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder={newsletter.placeholder}
              className="flex-1 border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-ivory/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="shrink-0 border border-ivory/50 px-8 py-3 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10 disabled:opacity-50"
            >
              {submitting ? "Sending…" : newsletter.submitLabel}
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
