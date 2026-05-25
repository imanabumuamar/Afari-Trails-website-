import Image from "next/image";
import Link from "next/link";
import { getStoreContent } from "@/services/content/store";

export async function WorldOfAfari() {
  const { worldOfAfari } = await getStoreContent();
  return (
    <section>
      <div className="bg-sand py-5 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-charcoal/80">
          {worldOfAfari.bandLabel}
        </p>
      </div>

      <div className="relative aspect-[21/9] min-h-[280px] w-full md:min-h-[360px]">
        <Image
          src={worldOfAfari.image}
          alt="African savanna at sunset with acacia and wildlife on the horizon"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="grid bg-matte-black lg:grid-cols-2">
        <div className="flex flex-col justify-center border-b border-ivory/10 px-6 py-16 lg:border-b-0 lg:border-r lg:px-14 lg:py-24">
          <blockquote className="font-serif text-3xl font-light leading-[1.25] text-ivory md:text-4xl lg:text-[2.75rem]">
            {worldOfAfari.quote}
          </blockquote>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-sand/70">
            {worldOfAfari.attribution}
          </p>
        </div>
        <div className="flex flex-col justify-center px-6 py-16 lg:px-14 lg:py-24">
          <p className="max-w-md text-sm leading-[1.9] text-ivory/65 md:text-base">
            {worldOfAfari.body}
          </p>
          <Link
            href={worldOfAfari.ctaHref}
            className="mt-10 inline-flex w-fit items-center gap-2 border border-ivory/40 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
          >
            {worldOfAfari.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
