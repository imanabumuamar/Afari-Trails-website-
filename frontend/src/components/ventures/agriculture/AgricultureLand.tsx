import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { agricultureLand } from "@/lib/data/agriculture";

export function AgricultureLand() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh]">
      <Image
        src={agricultureLand.image}
        alt={agricultureLand.imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-matte-black/30 to-matte-black/40" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-center px-6 py-24 lg:min-h-[80vh] lg:px-10">
        <SectionLabel light>{agricultureLand.label}</SectionLabel>
        <blockquote className="mt-8 max-w-3xl font-serif text-4xl font-light leading-snug text-ivory md:text-5xl lg:text-[3.25rem] lg:leading-[1.2]">
          {agricultureLand.quote}
        </blockquote>
        <p className="mt-10 max-w-lg text-sm leading-[1.9] text-ivory/70 md:text-base">
          {agricultureLand.body}
        </p>
      </div>
    </section>
  );
}
