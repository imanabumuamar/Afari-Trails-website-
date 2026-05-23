import Link from "next/link";
import { archiveSubmit } from "@/lib/data/archive";

export function ArchiveSubmitCta() {
  return (
    <section className="bg-[#2a241c] py-20 text-ivory lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <blockquote>
          <p className="font-serif text-3xl font-light leading-snug md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]">
            &ldquo;{archiveSubmit.quote}&rdquo;
          </p>
          <footer className="mt-6 text-[10px] font-medium uppercase tracking-[0.28em] text-sand">
            — {archiveSubmit.attribution}
          </footer>
        </blockquote>

        <div className="lg:pl-8">
          <p className="text-sm leading-relaxed text-ivory/70 md:text-base">
            {archiveSubmit.body}
          </p>
          <Link
            href={archiveSubmit.href}
            className="mt-10 inline-flex border border-ivory/50 px-10 py-4 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
          >
            {archiveSubmit.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
