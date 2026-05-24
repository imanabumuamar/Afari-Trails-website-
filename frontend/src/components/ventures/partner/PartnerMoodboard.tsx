import Image from "next/image";
import { getVenturePageContent } from "@/services/content/ventures";
import { partnerMoodboard as default_partnerMoodboard } from "@/lib/data/partner";

export async function PartnerMoodboard() {
  const content = await getVenturePageContent("partner");
  const partnerMoodboard = content.partnerMoodboard as typeof default_partnerMoodboard;

  return (
    <section className="overflow-hidden bg-ivory py-16 lg:py-20" aria-label="Visual atmosphere">
      <div
        className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-none lg:gap-5 lg:px-10"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {partnerMoodboard.map((frame) => (
          <div
            key={frame.src}
            className="hover-zoom relative h-[280px] w-[min(85vw,420px)] shrink-0 overflow-hidden bg-charcoal/10 sm:h-[320px] lg:h-[380px] lg:w-[480px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              className="object-cover"
              sizes="480px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
