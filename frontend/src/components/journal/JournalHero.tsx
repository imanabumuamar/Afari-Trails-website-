import Image from "next/image";
import Link from "next/link";
import { journalHero } from "@/lib/data/journal";

export function JournalHero() {
  return (
    <section className="relative flex min-h-screen items-center">
      <Image
        src={journalHero.image}
        alt="Traveler on a safari vehicle overlooking an African valley at sunset"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/75 via-matte-black/45 to-matte-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/45 via-transparent to-matte-black/15" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 lg:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-sand">
          {journalHero.label}
        </p>
        <h1 className="mt-6 font-serif text-6xl font-light tracking-wide text-ivory sm:text-7xl lg:text-[5.5rem]">
          {journalHero.heading}
        </h1>
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-ivory/70 md:text-base">
          {journalHero.description}
        </p>
        <Link
          href="#topics"
          className="mt-12 inline-flex items-center gap-2 border border-ivory/55 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
        >
          Explore Stories
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
