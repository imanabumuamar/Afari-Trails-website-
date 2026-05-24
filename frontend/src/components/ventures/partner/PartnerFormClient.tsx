"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { partnerForm as defaultPartnerForm } from "@/lib/data/partner";

type PartnerFormData = typeof defaultPartnerForm;

const inputClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent px-0 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none";

type PartnerFormClientProps = {
  partnerForm: PartnerFormData;
};

export function PartnerFormClient({ partnerForm }: PartnerFormClientProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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

            <div className="pt-4 text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-charcoal px-12 py-4 text-xs font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-300 hover:bg-matte-black"
              >
                {partnerForm.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
