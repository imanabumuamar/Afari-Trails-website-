import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const articles = [
  {
    title: "The silence of South Luangwa at dawn",
    category: "Landscapes",
    date: "March 2026",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=800&q=85",
  },
  {
    title: "What safari culture teaches us about patience",
    category: "Philosophy",
    date: "February 2026",
    image:
      "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=800&q=85",
  },
  {
    title: "Building lodges that give back to the land",
    category: "Entrepreneurship",
    date: "January 2026",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=85",
  },
];

export function JournalSection() {
  return (
    <section className="border-t border-charcoal/10 bg-sand-light/30 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16">
          <SectionLabel>The Trail Journal</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            Field notes from the continent
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/65">
            African landscapes, safari culture, conservation, style, and the
            philosophy of journey.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {articles.map((article) => (
            <Link
              key={article.title}
              href="/journal"
              className="group"
            >
              <div className="hover-zoom relative mb-6 aspect-[4/3] overflow-hidden">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold-muted">
                {article.category} · {article.date}
              </p>
              <h3 className="mt-3 font-serif text-2xl font-light text-charcoal transition-colors group-hover:text-gold-muted">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/journal"
            className="text-xs uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
          >
            Read the journal →
          </Link>
        </div>
      </div>
    </section>
  );
}
