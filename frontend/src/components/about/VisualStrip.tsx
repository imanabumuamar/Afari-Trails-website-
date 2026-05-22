import Image from "next/image";
import { visualStrip } from "@/lib/data/about";

export function VisualStrip() {
  return (
    <section className="bg-[#e8dfd0] pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="mb-8 text-center text-[10px] font-medium uppercase tracking-[0.32em] text-charcoal/45">
          Visual Storytelling Strip
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {visualStrip.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden md:aspect-[4/5]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
