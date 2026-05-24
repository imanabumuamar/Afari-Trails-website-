"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import type { ExpeditionDetail } from "@/types/expedition-detail";

const inputClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent px-0 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none";

type ExpeditionInquiryProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionInquiry({ expedition }: ExpeditionInquiryProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="inquiry" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <SectionLabel>Personal inquiry</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {expedition.inquiry.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60">
            {expedition.inquiry.subtext}
          </p>
        </div>

        {submitted ? (
          <p
            className="animate-fade-in mx-auto mt-16 max-w-md text-center font-serif text-2xl font-light leading-relaxed text-charcoal"
            role="status"
          >
            Thank you. We will be in touch shortly to continue the conversation
            about {expedition.name}.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in mx-auto mt-16 max-w-lg space-y-10"
          >
            <input type="hidden" name="expedition" value={expedition.id} />

            <div>
              <label
                htmlFor="inquiry-name"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Name
              </label>
              <input
                id="inquiry-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-email"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Email
              </label>
              <input
                id="inquiry-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-dates"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Preferred dates
              </label>
              <input
                id="inquiry-dates"
                name="dates"
                type="text"
                placeholder="Month or season, approximate"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-guests"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Number of guests
              </label>
              <input
                id="inquiry-guests"
                name="guests"
                type="text"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-message"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Message
              </label>
              <textarea
                id="inquiry-message"
                name="message"
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-charcoal px-8 py-4 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-charcoal/90"
            >
              Begin Your Journey
            </button>
          </form>
        )}

        <p className="mx-auto mt-12 max-w-md text-center text-xs leading-relaxed text-charcoal/50">
          Prefer a broader conversation?{" "}
          <Link
            href={ROUTES.expeditionsConnect}
            className="text-gold-muted underline-offset-4 hover:underline"
          >
            Connect with Afari
          </Link>{" "}
          to design a journey across Zambia and beyond.
        </p>
      </div>
    </section>
  );
}
