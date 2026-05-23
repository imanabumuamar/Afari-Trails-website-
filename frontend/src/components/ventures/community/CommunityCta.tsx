import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { communityCta } from "@/lib/data/community";

export function CommunityCta() {
  return (
    <section className="bg-beige py-24 text-center lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
          {communityCta.heading}
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-sm leading-[1.9] text-charcoal/65 md:text-base">
          {communityCta.body}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link
            href={ROUTES.venturesPartner}
            className="inline-flex items-center justify-center bg-charcoal px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-matte-black"
          >
            {communityCta.primaryCta}
          </Link>
          <Link
            href={ROUTES.ventures}
            className="inline-flex items-center justify-center border border-charcoal/25 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-charcoal/50"
          >
            {communityCta.secondaryCta}
          </Link>
          <Link
            href={ROUTES.venturesConnect}
            className="inline-flex items-center justify-center px-4 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal/60 transition-colors hover:text-gold"
          >
            {communityCta.tertiaryCta} →
          </Link>
        </div>
      </div>
    </section>
  );
}
