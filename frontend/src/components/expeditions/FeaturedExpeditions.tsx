import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { featuredExpeditions } from "@/lib/data/expeditions";

export function FeaturedExpeditions() {
  return (
    <section id="featured" className="scroll-mt-24 bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Featured Expeditions</SectionLabel>
            <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
              Handcrafted journeys. Unforgettable memories.
            </h2>
          </div>
          <Link
            href="#featured"
            className="shrink-0 text-xs font-medium uppercase tracking-[0.25em] text-charcoal/60 transition-colors hover:text-gold"
          >
            View All Expeditions →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {featuredExpeditions.map((exp) => (
            <Link
              key={exp.id}
              href={`/expeditions/${exp.id}`}
              className="group"
            >
              <div className="hover-zoom relative aspect-[3/4] overflow-hidden bg-charcoal/10">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-lg font-light text-charcoal group-hover:text-gold-muted md:text-xl">
                  {exp.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/55">
                  {exp.tagline}
                </p>
                <p className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/45">
                  {exp.duration}
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
