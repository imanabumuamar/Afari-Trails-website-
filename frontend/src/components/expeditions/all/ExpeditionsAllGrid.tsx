import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import type { ExpeditionsAllPageContent } from "@/lib/data/expedition-defaults";
import type { ExpeditionCatalogItem } from "@/types/expeditions-content";

type ExpeditionsAllGridProps = {
  expeditions: ExpeditionCatalogItem[];
  allPage: ExpeditionsAllPageContent;
};

export function ExpeditionsAllGrid({ expeditions, allPage }: ExpeditionsAllGridProps) {
  const { gridIntro, cta } = allPage;
  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>{gridIntro.label}</SectionLabel>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/60">
          {expeditions.length} {gridIntro.description}
        </p>

        <ul className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
          {expeditions.map((exp, index) => {
            const imageFirst = index % 2 === 0;

            return (
              <li key={exp.id}>
                <Link
                  href={`/expeditions/${exp.id}`}
                  className={`group grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    imageFirst ? "" : "lg:[&>div:first-child]:order-2"
                  }`}
                >
                  <div className="hover-zoom relative aspect-[4/5] overflow-hidden bg-charcoal/10 sm:aspect-[5/4] lg:aspect-[4/5]">
                    <Image
                      src={exp.heroImage}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
                  </div>

                  <div className={imageFirst ? "lg:pr-8" : "lg:pl-8"}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-charcoal/45">
                      {exp.location}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-light text-charcoal transition-colors group-hover:text-gold-muted md:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                      {exp.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-charcoal/55">
                      {exp.tagline}
                    </p>
                    <p className="mt-6 max-w-md text-sm leading-[1.85] text-charcoal/70">
                      {exp.intro}
                    </p>
                    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-charcoal/10 pt-8">
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">
                          Duration
                        </dt>
                        <dd className="mt-1 text-sm text-charcoal/80">
                          {exp.duration}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40">
                          Style
                        </dt>
                        <dd className="mt-1 text-sm text-charcoal/80">
                          {exp.style}
                        </dd>
                      </div>
                    </dl>
                    <span className="mt-10 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/55 transition-colors group-hover:text-gold">
                      View expedition
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-24 border-t border-charcoal/10 pt-16 text-center">
          <p className="font-serif text-2xl font-light text-charcoal md:text-3xl">
            {cta.heading}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-charcoal/60">
            {cta.body}
          </p>
          <Link
            href={ROUTES.expeditionsConnect}
            className="mt-10 inline-block border border-charcoal/25 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-gold hover:text-gold"
          >
            {cta.buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
