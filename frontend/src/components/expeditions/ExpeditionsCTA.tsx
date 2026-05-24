import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { getExpeditionsContent } from "@/services/content/expeditions";

export async function ExpeditionsCTA() {
  const { page } = await getExpeditionsContent();
  const cta = page.expeditionsCta;

  return (
    <section className="relative min-h-[520px] lg:min-h-[580px]">
      <Image
        src={cta.image}
        alt="Campfire beneath a spreading tree at night"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/65" />

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <div>
          <blockquote className="font-serif text-3xl font-light leading-snug text-ivory md:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
            {cta.quote}
          </blockquote>
          <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.3em] text-sand">
            {cta.readyLabel}
          </p>
        </div>

        <div className="border border-ivory/15 bg-matte-black/50 p-8 backdrop-blur-sm md:p-10">
          <p className="text-sm leading-relaxed text-ivory/75 md:text-base">
            {cta.boxText}
          </p>
          <Link
            href={ROUTES.expeditionsConnect}
            className="mt-8 inline-flex bg-sand px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-sand-light"
          >
            Design Your Journey
          </Link>
          <Link
            href={ROUTES.expeditionsConnect}
            className="mt-5 block text-xs font-medium uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:text-ivory"
          >
            Plan Your Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}
