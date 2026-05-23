import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { featuredProject } from "@/lib/data/ventures";

export function FeaturedProject() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-screen">
      <Image
        src={featuredProject.image}
        alt={featuredProject.title}
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/85 via-matte-black/50 to-matte-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-matte-black/30" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-32 lg:min-h-screen lg:justify-center lg:px-10 lg:pb-24 lg:pt-36">
        <div className="max-w-xl lg:max-w-2xl">
          <SectionLabel light>{featuredProject.label}</SectionLabel>
          <span className="mt-5 inline-flex border border-ivory/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ivory/70">
            {featuredProject.status}
          </span>
          <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-sand">
            {featuredProject.category}
          </p>
          <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {featuredProject.title}
          </h2>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-ivory/75 md:text-base">
            {featuredProject.description}
          </p>
          <Link
            href={featuredProject.href}
            className="mt-10 inline-flex items-center justify-center border border-ivory/55 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
          >
            Explore the Vision →
          </Link>
        </div>
      </div>
    </section>
  );
}
