import Image from "next/image";
import Link from "next/link";
import { getVenturePageContent } from "@/services/content/ventures";
import { venturesCta as default_venturesCta } from "@/lib/data/ventures";

export async function VenturesCTA() {
  const content = await getVenturePageContent("main");
  const venturesCta = content.venturesCta as typeof default_venturesCta;

  return (
    <section className="relative min-h-[420px] lg:min-h-[480px]">
      <Image
        src={venturesCta.image}
        alt="Acacia tree silhouette at twilight on the African savanna"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-matte-black/75" />

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <blockquote className="font-serif text-3xl font-light leading-snug text-ivory md:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
          &ldquo;{venturesCta.quote}&rdquo;
        </blockquote>

        <div className="lg:pl-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-sand">
            {venturesCta.heading}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/70 md:text-base">
            {venturesCta.body}
          </p>
        <Link
          href={venturesCta.ctaHref ?? "/contact"}
          className="mt-8 inline-block border border-ivory/50 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
        >
          {venturesCta.ctaLabel ?? "Get In Touch →"}
        </Link>
        </div>
      </div>
    </section>
  );
}
