import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FocusIcon } from "@/components/ventures/FocusIcon";
import { getVenturePageContent } from "@/services/content/ventures";
import { focusAreas as default_focusAreas } from "@/lib/data/ventures";

function focusAreaHref(area: (typeof default_focusAreas)[number]): string {
  if ("href" in area && typeof area.href === "string") return area.href;
  return "/ventures/connect";
}

export async function FocusAreas() {
  const content = await getVenturePageContent("main");
  const focusAreas = content.focusAreas as typeof default_focusAreas;
  const sectionLabel =
    typeof content.focusAreasSection === "object" &&
    content.focusAreasSection !== null &&
    "label" in content.focusAreasSection
      ? String((content.focusAreasSection as { label: string }).label)
      : "Our Focus Areas";

  return (
    <section id="focus-areas" className="scroll-mt-24 bg-beige py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>{sectionLabel}</SectionLabel>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-px lg:bg-charcoal/10">
          {focusAreas.map((area) => (
            <Link
              key={area.id}
              href={focusAreaHref(area)}
              className="hover-zoom group relative min-h-[340px] overflow-hidden bg-charcoal/10 sm:min-h-[400px] lg:min-h-[480px]"
            >
              <Image
                src={area.image}
                alt={area.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/92 via-matte-black/40 to-matte-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                <FocusIcon type={area.icon} className="h-6 w-6 text-sand" />
                <h3 className="mt-4 font-serif text-lg font-light text-ivory lg:text-xl">
                  {area.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ivory/65">
                  {area.description}
                </p>
                <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.22em] text-sand">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
