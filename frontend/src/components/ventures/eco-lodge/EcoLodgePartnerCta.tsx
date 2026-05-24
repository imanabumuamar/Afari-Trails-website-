import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { getVenturePageContent } from "@/services/content/ventures";
import { ecoLodgePartnerCta as default_ecoLodgePartnerCta } from "@/lib/data/eco-lodge";

export async function EcoLodgePartnerCta() {
  const content = await getVenturePageContent("eco-lodge");
  const ecoLodgePartnerCta = content.ecoLodgePartnerCta as typeof default_ecoLodgePartnerCta;

  return (
    <section className="relative min-h-[400px] lg:min-h-[460px]">
      <Image
        src={ecoLodgePartnerCta.image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/72" />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center lg:px-10 lg:py-28">
        <h2 className="font-serif text-4xl font-light text-ivory md:text-5xl">
          {ecoLodgePartnerCta.heading}
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/70 md:text-base">
          {ecoLodgePartnerCta.body}
        </p>
        <Link
          href={ROUTES.venturesPartner}
          className="mt-10 inline-flex items-center justify-center border border-ivory/50 px-10 py-4 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
        >
          {ecoLodgePartnerCta.cta} →
        </Link>
      </div>
    </section>
  );
}
