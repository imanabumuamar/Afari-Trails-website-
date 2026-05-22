import Image from "next/image";
import { aboutHero } from "@/lib/data/about";

export function AboutHero() {
  return (
    <section className="relative flex min-h-screen items-center">
      <Image
        src={aboutHero.image}
        alt="Silhouette overlooking an African landscape at sunset"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/80 via-matte-black/45 to-matte-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-matte-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 lg:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-sand">
          {aboutHero.label}
        </p>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.1] text-ivory sm:text-6xl lg:text-[4.25rem]">
          {aboutHero.heading}
        </h1>
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-ivory/70 md:text-base">
          {aboutHero.subtext}
        </p>
      </div>
    </section>
  );
}
