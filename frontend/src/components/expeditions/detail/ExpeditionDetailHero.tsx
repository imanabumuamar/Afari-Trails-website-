import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import {
  resolveHeroStats,
  resolveLocationLabel,
  resolveSectionCopy,
} from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionDetailHeroProps = {
  expedition: ExpeditionDetail;
  /** Hero looks the same; CTAs scroll to the coming-soon section instead. */
  comingSoonMode?: boolean;
};

function StatIcon({ label }: { label: string }) {
  const cls = "h-5 w-5 text-sand";
  const key = label.toLowerCase();
  if (key.includes("duration") || key.includes("season")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }
  if (key.includes("group")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <circle cx="9" cy="9" r="3" />
        <circle cx="16" cy="10" r="2.5" />
        <path d="M4 19c0-2.5 2.2-4 5-4s5 1.5 5 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
      <path d="M4 12h16M12 4v16" />
    </svg>
  );
}

export function ExpeditionDetailHero({
  expedition,
  comingSoonMode = false,
}: ExpeditionDetailHeroProps) {
  const sections = resolveSectionCopy(expedition);
  const stats = resolveHeroStats(expedition);
  const locationLabel = resolveLocationLabel(expedition);
  const actionHref = comingSoonMode ? "#coming-soon" : "#inquiry";
  const showBrochure = comingSoonMode || Boolean(expedition.brochureUrl);

  return (
    <section className="relative min-h-[88vh] lg:min-h-screen">
      <Image
        src={expedition.heroImage}
        alt={expedition.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/85 via-matte-black/50 to-matte-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/75 via-transparent to-matte-black/30" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-end px-6 pt-28 pb-16 lg:min-h-screen lg:px-10 lg:pb-20">
        <div className="max-w-4xl">
          {locationLabel && (
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-sand/80">
              {locationLabel}
            </p>
          )}
          <h1 className="mt-4 font-serif text-[2.35rem] font-light leading-[1.08] text-ivory sm:text-5xl lg:text-[3.5rem]">
            {expedition.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ivory/72 md:text-base">
            {expedition.tagline}
          </p>

          {stats.length > 0 && (
            <ul className="mt-10 grid gap-6 border-t border-ivory/12 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-start gap-3">
                  <StatIcon label={stat.label} />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/45">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm text-ivory/90">{stat.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={actionHref}
              className="inline-flex items-center justify-center bg-safari-green px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-safari-green-deep"
            >
              {sections.enquireLabel}
            </a>
            {showBrochure && (
              <a
                href={comingSoonMode ? actionHref : expedition.brochureUrl}
                {...(comingSoonMode
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="inline-flex items-center justify-center gap-2 border border-ivory/45 bg-transparent px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
              >
                {sections.brochureLabel}
                <span aria-hidden>↓</span>
              </a>
            )}
          </div>
        </div>

        <Link
          href={ROUTES.expeditionsAll}
          className="mt-12 inline-block text-[10px] uppercase tracking-[0.22em] text-ivory/45 transition-colors hover:text-ivory/80"
        >
          ← All journeys
        </Link>
      </div>
    </section>
  );
}
