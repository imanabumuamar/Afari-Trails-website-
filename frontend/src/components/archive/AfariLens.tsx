import Image from "next/image";
import Link from "next/link";
import type { ArchivePageContent } from "@/types/archive-content";

type AfariLensProps = {
  afariLens: ArchivePageContent["afariLens"];
};

export function AfariLens({ afariLens }: AfariLensProps) {
  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold-muted">
            {afariLens.label}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
            {afariLens.heading}
          </h2>
          <p className="mt-6 font-serif text-xl italic text-charcoal/80 md:text-2xl">
            &ldquo;{afariLens.title}&rdquo; by {afariLens.photographer}
          </p>
          <p className="mt-8 text-sm leading-[1.85] text-charcoal/70 md:text-base">
            {afariLens.story}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href={afariLens.entriesHref}
              className="inline-flex justify-center bg-charcoal px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-matte-black"
            >
              View This Month&apos;s Entries
            </Link>
            <Link
              href={afariLens.editionsHref}
              className="inline-flex justify-center text-xs font-medium uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:text-gold"
            >
              Explore Previous Editions →
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal/10 lg:aspect-[5/4]">
          <Image
            src={afariLens.image}
            alt={afariLens.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-ivory" />
            <span className="h-1.5 w-1.5 rounded-full bg-ivory/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-ivory/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
