import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const expeditions = [
  {
    name: "Lower Zambezi",
    country: "Zambia",
    image:
      "https://images.unsplash.com/photo-1549366021-9f792d8d5e3c?w=700&q=85",
  },
  {
    name: "South Luangwa",
    country: "Zambia",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=700&q=85",
  },
  {
    name: "Okavango Delta",
    country: "Botswana",
    image:
      "https://images.unsplash.com/photo-1535330014194-e6e8b0e8b8b0?w=700&q=85",
  },
  {
    name: "Namib Desert",
    country: "Namibia",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b8e?w=700&q=85",
  },
];

export function FeaturedExpeditions() {
  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 text-center">
          <SectionLabel>Featured Expeditions</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            Curated journeys. Unforgettable memories.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {expeditions.map((exp) => (
            <Link
              key={exp.name}
              href={`/expeditions/${exp.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group"
            >
              <div className="hover-zoom relative aspect-[3/4] overflow-hidden bg-charcoal/10">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-transparent" />
              </div>
              <div className="mt-5 text-center">
                <h3 className="text-xs font-medium uppercase tracking-[0.22em] text-charcoal">
                  {exp.name}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-charcoal/50">
                  {exp.country}
                </p>
                <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] text-charcoal/60 transition-colors group-hover:text-gold">
                  View Expedition →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/expeditions"
            className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
          >
            View All Expeditions →
          </Link>
        </div>
      </div>
    </section>
  );
}
