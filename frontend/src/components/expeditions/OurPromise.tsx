import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getExpeditionsContent } from "@/services/content/expeditions";

export async function OurPromise() {
  const { page } = await getExpeditionsContent();
  const section = page.ourPromise;

  return (
    <section className="grid lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-beige px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{section.label}</SectionLabel>
        <h2 className="mt-4 max-w-md font-serif text-4xl font-light leading-tight text-charcoal md:text-[2.75rem]">
          {section.heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.85] text-charcoal/70 md:text-base">
          {section.body}
        </p>
        <Link
          href={section.approachHref}
          className="mt-10 inline-block text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
        >
          Our Approach →
        </Link>
      </div>
      <div className="relative min-h-[360px] lg:min-h-[520px]">
        <Image
          src={section.image}
          alt="Luxury tented camp deck overlooking a river at dusk"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
