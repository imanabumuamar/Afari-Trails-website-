import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { communityFocusAreas } from "@/lib/data/community";

export function CommunityFocusAreas() {
  return (
    <section id="focus" className="scroll-mt-24 bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>{communityFocusAreas.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {communityFocusAreas.heading}
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {communityFocusAreas.items.map((item) => (
            <article
              key={item.id}
              className="hover-zoom group relative min-h-[380px] overflow-hidden bg-charcoal/10 lg:min-h-[420px]"
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
