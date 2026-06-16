import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROUTES } from "@/config/routes";
import { getVenturePageContent } from "@/services/content/ventures";
import { hospitalityFocusAreas as default_hospitalityFocusAreas } from "@/lib/data/hospitality";

export async function HospitalityFocusAreas() {
  const content = await getVenturePageContent("hospitality");
  const hospitalityFocusAreas = content.hospitalityFocusAreas as typeof default_hospitalityFocusAreas;

  return (
    <section className="bg-sand pt-10 pb-12 lg:pt-14 lg:pb-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>{hospitalityFocusAreas.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {hospitalityFocusAreas.heading}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {hospitalityFocusAreas.items.map((item) => {
            const href =
              "href" in item && item.href ? item.href : ROUTES.venturesPartner;

            return (
              <Link
                key={item.id}
                href={href}
                className="hover-zoom group relative block min-h-[320px] overflow-hidden bg-charcoal/10 lg:min-h-[360px]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-serif text-2xl font-light text-ivory">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/65">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.22em] text-sand opacity-0 transition-opacity group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
