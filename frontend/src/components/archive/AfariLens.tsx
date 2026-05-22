import Image from "next/image";
import Link from "next/link";
import { afariLens } from "@/lib/data/archive";

export function AfariLens() {
  return (
    <section className="bg-ivory py-20 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold-muted">
          {afariLens.title}
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[560px]">
            <Image
              src={afariLens.image}
              alt="The Afari Lens featured photograph"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>

          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
              Photograph by {afariLens.photographer}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
              {afariLens.location}
            </p>
            <p className="mt-8 font-serif text-2xl font-light leading-relaxed text-charcoal md:text-3xl">
              {afariLens.story}
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                href={afariLens.submitHref}
                className="inline-flex justify-center border border-charcoal/25 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-gold hover:text-gold"
              >
                Submit Your Work
              </Link>
              <Link
                href={afariLens.editionsHref}
                className="inline-flex justify-center text-xs font-medium uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:text-charcoal"
              >
                Explore Previous Editions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
