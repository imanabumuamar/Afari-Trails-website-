"use client";

import { useState } from "react";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectNewsletterProps = {
  config: ConnectPageConfig;
};

export function ConnectNewsletter({ config }: ConnectNewsletterProps) {
  const newsletter = config.newsletter;
  if (!newsletter) return null;

  const [joined, setJoined] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setJoined(true);
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
            <input
              type="email"
              name="email"
              required
              placeholder={newsletter.placeholder}
              className="flex-1 border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-ivory/60 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 border border-ivory/50 px-8 py-3 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
            >
              {newsletter.submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
