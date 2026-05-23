import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FocusIcon } from "@/components/ventures/FocusIcon";
import { focusAreas } from "@/lib/data/ventures";

function focusAreaHref(area: (typeof focusAreas)[number]): string {
  if ("href" in area && typeof area.href === "string") return area.href;
  return ROUTES.venturesConnect;
}

export function FocusAreas() {
  return (
    <section id="focus-areas" className="scroll-mt-24 bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionLabel>Our Focus Areas</SectionLabel>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {focusAreas.map((area) => (
            <Link
              key={area.id}
              href={focusAreaHref(area)}
              className="hover-zoom group relative min-h-[340px] overflow-hidden bg-charcoal/10 sm:min-h-[400px] lg:min-h-[460px]"
            >
              <Image
                src={area.image}
                alt={area.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/35 to-matte-black/15" />
              <div className="absolute left-4 top-4">
                <FocusIcon type={area.icon} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-serif text-xl font-light text-ivory lg:text-2xl">
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
