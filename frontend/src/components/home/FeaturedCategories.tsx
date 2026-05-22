import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const categories = [
  {
    title: "Tours",
    subtitle: "Curated African experiences",
    href: "/expedition",
    image:
      "https://images.unsplash.com/photo-1589552603490-efd4e1f2836b?w=1200&q=85",
  },
  {
    title: "Investment & Development",
    subtitle: "Building sustainable safari futures",
    href: "/ventures",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=85",
  },
  {
    title: "Store",
    subtitle: "Safari-inspired apparel and expedition essentials",
    href: "/store",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=85",
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-sand-light/40 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 text-center">
          <SectionLabel>Discover</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            Three paths into Africa
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="hover-zoom group relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/75 via-matte-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <h3 className="font-serif text-3xl font-light text-ivory">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-ivory/75">{cat.subtitle}</p>
                <span className="mt-4 inline-block text-xs uppercase tracking-[0.25em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
