import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AboutSection() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
            <Image
              src="https://images.unsplash.com/photo-1509316785289-025f5b846b8e?w=1000&q=85"
              alt="Namibian dunes at golden hour"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
          <div className="flex flex-col justify-center lg:col-span-7 lg:pl-8">
            <SectionLabel>About Us</SectionLabel>
            <h2 className="font-serif text-4xl font-light leading-tight text-charcoal md:text-5xl">
              Why Afari Trails exists
            </h2>
            <p className="mt-8 text-base leading-relaxed text-charcoal/75">
              Afari Trails grew from a life lived between continents — a
              multicultural identity anchored in Zambia, shaped by journeys
              across Africa and beyond. We believe the trail is not a product;
              it is a transformation.
            </p>
            <p className="mt-6 text-base leading-relaxed text-charcoal/60">
              We exist to connect travelers, investors, and dreamers to
              experiences and ventures that honor wild places, celebrate local
              wisdom, and leave something better behind.
            </p>
            <Link
              href="/about"
              className="mt-10 inline-block text-xs uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
            >
              Our full story →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
