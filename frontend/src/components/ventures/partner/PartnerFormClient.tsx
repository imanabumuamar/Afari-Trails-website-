"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  inquiryPayloadFromForm,
  submitInquiry,
} from "@/lib/inquiry/submit-inquiry";
import { partnerForm as defaultPartnerForm } from "@/lib/data/partner";

type PartnerFormData = typeof defaultPartnerForm;

const inputClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent px-0 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none";

type PartnerFormClientProps = {
  partnerForm: PartnerFormData;
};

export function PartnerFormClient({ partnerForm }: PartnerFormClientProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await submitInquiry(
      inquiryPayloadFromForm(e.currentTarget, "partner"),
    );

    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    setError(result.error);
  }

  return (
    <section
      id="conversation"
      className="scroll-mt-24 bg-beige py-24 lg:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <SectionLabel>{partnerForm.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {partnerForm.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60">
            {partnerForm.subtext}
          </p>
        </div>

        {submitted ? (
          <p
            className="animate-fade-in mx-auto mt-16 max-w-md text-center font-serif text-2xl font-light leading-relaxed text-charcoal"
            role="status"
          >
            Thank you. We will be in touch when your vision aligns with ours.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in mx-auto mt-16 max-w-lg space-y-10"
          >
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label
                htmlFor="partner-name"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Name
              </label>
              <input
                id="partner-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="partner-company"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Company / Organization
              </label>
              <input
                id="partner-company"
                name="company"
                type="text"
                autoComplete="organization"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="partner-email"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Email
              </label>
              <input
                id="partner-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="partner-type"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Partnership Type
              </label>
              <select
                id="partner-type"
                name="partnershipType"
                required
                defaultValue=""
                className={`${inputClass} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Select
                </option>
                {partnerForm.partnershipOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="partner-message"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Message
              </label>
              <textarea
                id="partner-message"
                name="message"
                required
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-800/80" role="alert">
                {error}
              </p>
            )}

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center bg-charcoal px-12 py-4 text-xs font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-300 hover:bg-matte-black disabled:opacity-50"
              >
                {submitting ? "Sending…" : partnerForm.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
