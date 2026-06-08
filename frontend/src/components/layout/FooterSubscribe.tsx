"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/inquiry/submit-inquiry";

const SUCCESS_MESSAGE = "Welcome — we'll be in touch.";

export function FooterSubscribe() {
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
    <div>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-charcoal/50">
        Join the Journey
      </p>
      <p className="mb-4 text-sm leading-relaxed text-charcoal/60">
        Field notes, expedition updates, and stories from the trail.
      </p>

      {joined ? (
        <p className="text-sm text-charcoal/70" role="status">
          {SUCCESS_MESSAGE}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <label htmlFor="footer-email" className="sr-only">
            Email
          </label>
          <input
            id="footer-email"
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-matte-black px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-charcoal disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Subscribe"}
          </button>
          {error && (
            <p className="text-sm text-charcoal/80" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
