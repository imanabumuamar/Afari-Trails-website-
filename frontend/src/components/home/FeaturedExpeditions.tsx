import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import { getFeaturedExpeditionCards } from "@/services/content/expeditions";

export async function FeaturedExpeditions() {
  const featured = await getFeaturedExpeditionCards();

  if (featured.length === 0) return null;

  return (
    <section className="bg-ivory pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 text-center">
          <SectionLabel>Featured Expeditions</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            Curated journeys. Unforgettable memories.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {featured.slice(0, 4).map((exp) => (
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
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-transparent" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-charcoal">
                  {exp.name}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-charcoal/50">
                  Zambia
                </p>
                <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] text-charcoal/60 transition-colors group-hover:text-gold">
                  View Expedition →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href={ROUTES.expeditionsAll}
            className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
          >
            View All Expeditions →
          </Link>
        </div>
      </div>
    </section>
  );
}
