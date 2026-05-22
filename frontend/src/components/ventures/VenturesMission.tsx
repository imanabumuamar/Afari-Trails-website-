import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { venturesMission } from "@/lib/data/ventures";

export function VenturesMission() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-beige px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{venturesMission.label}</SectionLabel>
        <h2 className="mt-4 max-w-md font-serif text-4xl font-light leading-tight text-charcoal md:text-[2.75rem]">
          {venturesMission.heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.85] text-charcoal/70 md:text-base">
          {venturesMission.body}
        </p>
        <Link
          href={venturesMission.approachHref}
          className="mt-10 inline-block text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
        >
          Our Approach →
        </Link>
      </div>
      <div className="relative min-h-[360px] lg:min-h-[520px]">
        <Image
          src={venturesMission.image}
          alt="River winding through an African valley at sunset"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
