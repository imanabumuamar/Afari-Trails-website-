import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";
import { getVenturePageContent } from "@/services/content/ventures";
import { venturesHero as default_venturesHero } from "@/lib/data/ventures";

export async function VenturesHero() {
  const content = await getVenturePageContent("main");
  const venturesHero = content.venturesHero as typeof default_venturesHero;

  return (
    <section className="relative min-h-[88vh] lg:min-h-screen">
      <Image
        src={venturesHero.image}
        alt="Luxury safari lodge deck overlooking a misty valley at dusk"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/65 via-matte-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-matte-black/20" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-end px-6 pb-24 pt-32 lg:min-h-screen lg:px-10 lg:pb-32 lg:pt-36">
        <h1 className="font-serif text-6xl font-light uppercase tracking-wide text-ivory sm:text-7xl lg:text-[5.5rem]">
          {venturesHero.title}
        </h1>
        <div className="mt-4 flex items-center gap-4">
          <span className="h-px w-10 bg-ivory/50" aria-hidden />
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-ivory/80">
            {venturesHero.tagline}
          </p>
        </div>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/75 md:text-base">
          {venturesHero.intro}
        </p>
        <div className="mt-10">
          <Button href={ROUTES.venturesPartner} variant="outline-light" showArrow>
            Partner With Us
          </Button>
        </div>
      </div>
    </section>
  );
}
