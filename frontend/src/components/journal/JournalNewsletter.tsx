import Image from "next/image";
import { journalNewsletter } from "@/lib/data/journal";

export function JournalNewsletter() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={journalNewsletter.image}
        alt="Luxury tented camp at night"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/70" />

      <div className="relative z-10 mx-auto max-w-xl px-6 py-24 text-center lg:px-10 lg:py-32">
        <h2 className="font-serif text-4xl font-light text-ivory md:text-5xl">
          {journalNewsletter.heading}
        </h2>
        <form className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <label htmlFor="journal-email" className="sr-only">
            Email address
          </label>
          <input
            id="journal-email"
            type="email"
            placeholder="Your email address"
            className="min-w-0 flex-1 border border-ivory/25 bg-ivory/95 px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-sand sm:max-w-xs"
          />
          <button
            type="submit"
            className="bg-sand px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-sand-light"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
