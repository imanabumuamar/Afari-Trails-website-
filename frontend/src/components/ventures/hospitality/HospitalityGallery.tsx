import Image from "next/image";
import { hospitalityGallery } from "@/lib/data/hospitality";

export function HospitalityGallery() {
  return (
    <section className="overflow-hidden bg-matte-black py-4 lg:py-6" aria-label="Visual immersion">
      <div className="flex gap-1 overflow-x-auto scrollbar-none lg:gap-1.5">
        {hospitalityGallery.map((frame) => (
          <div
            key={frame.src}
            className="relative h-[50vh] min-h-[320px] w-[min(92vw,640px)] shrink-0 lg:h-[70vh] lg:w-[720px]"
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              className="object-cover opacity-95"
              sizes="720px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
