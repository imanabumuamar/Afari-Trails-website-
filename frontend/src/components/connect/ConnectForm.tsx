"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  inquiryPayloadFromForm,
  submitInquiry,
  type InquirySource,
} from "@/lib/inquiry/submit-inquiry";
import { venturesConnectConfig } from "@/lib/data/connect-ventures";
import { CONNECT_CONTENT_DEFAULTS } from "@/lib/data/connect-defaults";
import type { ConnectPageConfig } from "@/types/connect-page";

const inputClass =
  "mt-2 w-full border-0 border-b border-charcoal/20 bg-transparent px-0 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none";

type ConnectFormProps = {
  config: ConnectPageConfig;
  source: InquirySource;
  compact?: boolean;
};

function ConnectFormInner({ config, source, compact = false }: ConnectFormProps) {
  const { form } = config;
  const inquiryOptions =
    form.inquiryOptions?.length
      ? form.inquiryOptions
      : source === "ventures-connect"
        ? venturesConnectConfig.form.inquiryOptions
        : CONNECT_CONTENT_DEFAULTS.expeditions.form.inquiryOptions;
  const searchParams = useSearchParams();
  const inquiryParam = searchParams.get("inquiry");
  const validInquiry = inquiryOptions.some((o) => o.value === inquiryParam);
  const defaultInquiry = validInquiry ? inquiryParam! : "";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await submitInquiry(
      inquiryPayloadFromForm(e.currentTarget, source),
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
      id="form"
      className={`scroll-mt-24 bg-ivory ${compact ? "py-12 lg:py-16" : "py-24 lg:py-36"}`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <SectionLabel>{form.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {form.heading}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/60">
            {form.subtext}
          </p>
        </div>

        {submitted ? (
          <p
            className="animate-fade-in mx-auto mt-16 max-w-md text-center font-serif text-2xl font-light leading-relaxed text-charcoal"
            role="status"
          >
            {form.successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in mx-auto mt-16 max-w-lg space-y-10"
          >
            <div
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              aria-hidden
            >
              <label htmlFor={`${source}-website`}>Website</label>
              <input
                id={`${source}-website`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="connect-name"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Full Name
              </label>
              <input
                id="connect-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="connect-email"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Email
              </label>
              <input
                id="connect-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="connect-company"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Company / Organization{" "}
                <span className="normal-case tracking-normal text-charcoal/40">
                  (optional)
                </span>
              </label>
              <input
                id="connect-company"
                name="company"
                type="text"
                autoComplete="organization"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="connect-inquiry"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Inquiry Type
              </label>
              <select
                id="connect-inquiry"
                name="inquiryType"
                required
                defaultValue={defaultInquiry}
                className={`${inputClass} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Select
                </option>
                {inquiryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="connect-message"
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/55"
              >
                Message
              </label>
              <textarea
                id="connect-message"
                name="message"
                required
                rows={5}
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
                {submitting ? "Sending…" : form.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export function ConnectForm({
  config,
  source,
  compact = false,
}: ConnectFormProps) {
  return (
    <Suspense fallback={<div className="min-h-[480px] bg-ivory" />}>
      <ConnectFormInner config={config} source={source} compact={compact} />
    </Suspense>
  );
}
