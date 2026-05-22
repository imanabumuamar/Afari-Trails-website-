import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { featuredProject } from "@/lib/data/ventures";

export function FeaturedProject() {
  return (
    <section className="grid lg:grid-cols-5">
      <div className="flex flex-col justify-center bg-charcoal px-6 py-16 text-ivory lg:col-span-2 lg:px-12 lg:py-24">
        <SectionLabel light>{featuredProject.label}</SectionLabel>
        <span className="mt-4 inline-flex w-fit border border-ivory/25 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ivory/60">
          {featuredProject.status}
        </span>
        <h2 className="mt-6 font-serif text-3xl font-light leading-tight md:text-4xl">
          {featuredProject.title}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-ivory/70 md:text-base">
          {featuredProject.description}
        </p>
        <Link
          href={featuredProject.href}
          className="mt-10 inline-block text-xs font-medium uppercase tracking-[0.25em] text-sand transition-colors hover:text-ivory"
        >
          View Project →
        </Link>
      </div>
      <div className="relative min-h-[320px] lg:col-span-3 lg:min-h-[480px]">
        <Image
          src={featuredProject.image}
          alt={featuredProject.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
    </section>
  );
}
