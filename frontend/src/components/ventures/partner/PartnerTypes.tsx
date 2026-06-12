import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { partnershipTypes as default_partnershipTypes } from "@/lib/data/partner";

export async function PartnerTypes() {
  const content = await getVenturePageContent("connect");
  const partnershipTypes = content.partnershipTypes as typeof default_partnershipTypes;

  return (
    <section className="bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>Partnership Types</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            Where vision meets the trail.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal/65 md:text-base">
            We collaborate across sectors — each partnership shaped by purpose,
            place, and long-term impact.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {partnershipTypes.map((type, index) => (
            <article
              key={type.id}
              className="hover-zoom group relative min-h-[420px] overflow-hidden bg-charcoal/10 animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <Image
                src={type.image}
                alt={type.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/92 via-matte-black/40 to-matte-black/10 transition-opacity duration-700 group-hover:from-matte-black/95" />
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-8">
                <h3 className="font-serif text-2xl font-light text-ivory lg:text-[1.75rem]">
                  {type.title}
                </h3>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-ivory/70">
                  {type.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
