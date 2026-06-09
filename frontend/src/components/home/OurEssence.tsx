import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getHomepageAsync } from "@/services/content/homepage";
import { site } from "@/lib/data/site";

export async function OurEssence() {
  const { ourEssence } = await getHomepageAsync();

  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center px-6 py-14 lg:py-16 lg:pl-10 lg:pr-6">
            <SectionLabel>Our Essence</SectionLabel>
            <h2 className="font-serif text-4xl font-light leading-tight text-charcoal md:text-[2.75rem] md:leading-[1.15]">
              {site.tagline}
            </h2>
            <p className="mt-6 text-sm leading-[1.85] text-charcoal/70 md:text-base">
              Afari Trails was born between cultures, landscapes, and journeys —
              inspired by Africa&apos;s untamed spirit and the human search for
              belonging. We curate expeditions, build ventures, and craft goods
              that honor the land and elevate the people who call it home.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-block text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
            >
              About Us →
            </Link>
          </div>
          <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:min-h-full">
            <Image
              src={ourEssence.src}
              alt={ourEssence.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
