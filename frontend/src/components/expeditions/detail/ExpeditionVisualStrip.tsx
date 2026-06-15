import Image from "next/image";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionVisualStripProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionVisualStrip({ expedition }: ExpeditionVisualStripProps) {
  const frames = expedition.visualStrip.filter((frame) => frame.src?.trim());

  if (frames.length === 0) return null;

  return (
    <section
      className="overflow-hidden bg-matte-black py-2 lg:py-3"
      aria-label="Visual story"
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-none lg:gap-1.5">
        {frames.map((frame, index) => (
          <div
            key={`${frame.src}-${index}`}
            className="relative h-[55vh] min-h-[340px] w-[min(92vw,720px)] shrink-0 lg:h-[75vh] lg:w-[840px]"
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              className="object-cover opacity-95"
              sizes="840px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
