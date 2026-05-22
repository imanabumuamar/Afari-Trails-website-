import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const tours = [
  {
    name: "Livingstone",
    description:
      "Where the Zambezi roars — mist, myth, and the edge of adventure.",
    image:
      "https://images.unsplash.com/photo-1564760055778-dfe77213f821?w=900&q=85",
  },
  {
    name: "Lower Zambezi",
    description:
      "Riverine silence, elephant corridors, and golden-hour canoes.",
    image:
      "https://images.unsplash.com/photo-1549366021-9f792d8d5e3c?w=900&q=85",
  },
  {
    name: "South Luangwa",
    description:
      "The valley of the leopard — Africa's finest walking safaris.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=900&q=85",
  },
  {
    name: "Botswana",
    description:
      "Okavango waters and endless sky — pure wilderness rhythm.",
    image:
      "https://images.unsplash.com/photo-1535330014194-e6e8b0e8b8b0?w=900&q=85",
  },
  {
    name: "Namibia",
    description:
      "Dunes, desert-adapted wildlife, and landscapes that humble.",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b8e?w=900&q=85",
  },
];

export function ToursSection() {
  return (
    <section className="bg-safari-green py-24 text-ivory lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel light>Expedition</SectionLabel>
            <h2 className="font-serif text-4xl font-light md:text-5xl">
              Curated journeys
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ivory/65">
            Editorial experiences — each destination a chapter in a longer
            story of belonging.
          </p>
        </div>

        <div className="space-y-20">
          {tours.map((tour, i) => (
            <article
              key={tour.name}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="hover-zoom relative aspect-[16/10] overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:pr-12" : "lg:pl-12"}>
                <span className="text-xs uppercase tracking-[0.3em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-4xl font-light md:text-5xl">
                  {tour.name}
                </h3>
                <p className="mt-6 text-base leading-relaxed text-ivory/70">
                  {tour.description}
                </p>
                <Link
                  href={`/expedition/${tour.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-gold transition-opacity hover:opacity-80"
                >
                  View Experience →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
