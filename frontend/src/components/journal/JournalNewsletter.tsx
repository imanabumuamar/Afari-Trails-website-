import Image from "next/image";
import type { JournalPageContent } from "@/types/journal-content";

type JournalNewsletterProps = {
  newsletter: JournalPageContent["newsletter"];
};

export function JournalNewsletter({ newsletter }: JournalNewsletterProps) {
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
        <form className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="journal-email" className="sr-only">
            Email address
          </label>
          <input
            id="journal-email"
            type="email"
            placeholder="Your email"
            className="flex-1 border border-ivory/30 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-ivory focus:outline-none"
          />
          <button
            type="submit"
            className="bg-sand px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-sand-light"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
