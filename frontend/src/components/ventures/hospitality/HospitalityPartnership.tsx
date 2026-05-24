import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { getVenturePageContent } from "@/services/content/ventures";
import { hospitalityPartnership as default_hospitalityPartnership } from "@/lib/data/hospitality";

export async function HospitalityPartnership() {
  const content = await getVenturePageContent("hospitality");
  const hospitalityPartnership = content.hospitalityPartnership as typeof default_hospitalityPartnership;

  return (
    <section className="relative min-h-[420px] lg:min-h-[480px]">
      <Image
        src="https://images.unsplash.com/photo-1540541338287-417e03dee08f?w=2400&q=85"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/72" />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center lg:px-10 lg:py-28">
        <h2 className="font-serif text-4xl font-light text-ivory md:text-5xl">
          {hospitalityPartnership.heading}
        </h2>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/70 md:text-base">
          {hospitalityPartnership.body}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link
            href={ROUTES.venturesPartner}
            className="inline-flex items-center justify-center bg-sand px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:bg-sand-light"
          >
            {hospitalityPartnership.primaryCta}
          </Link>
          <Link
            href={`${ROUTES.venturesPartner}#conversation`}
            className="inline-flex items-center justify-center border border-ivory/50 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.22em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
          >
            {hospitalityPartnership.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
