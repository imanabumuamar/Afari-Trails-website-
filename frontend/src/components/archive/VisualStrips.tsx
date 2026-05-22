import Image from "next/image";
import { visualStrips } from "@/lib/data/archive";

export function VisualStrips() {
  return (
    <section className="bg-matte-black">
      {visualStrips.map((strip, i) =>
        strip.type === "quote" ? (
          <div
            key={i}
            className="flex min-h-[40vh] items-center justify-center px-6 py-24 lg:min-h-[45vh]"
          >
            <blockquote className="max-w-3xl text-center">
              <p className="font-serif text-3xl font-light leading-relaxed text-ivory/90 md:text-4xl lg:text-5xl">
                {strip.text}
              </p>
            </blockquote>
          </div>
        ) : (
          <div key={i} className="relative min-h-[50vh] w-full lg:min-h-[70vh]">
            <Image
              src={strip.image}
              alt={strip.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-matte-black/15" />
          </div>
        ),
      )}
    </section>
  );
}
