import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredExpeditions } from "@/lib/data/expeditions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return featuredExpeditions.map((exp) => ({ slug: exp.id }));
}

export default async function ExpeditionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const expedition = featuredExpeditions.find((e) => e.id === slug);

  if (!expedition) notFound();

  return (
    <>
      <section className="relative min-h-[70vh] pt-28">
        <Image
          src={expedition.image}
          alt={expedition.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-matte-black/50" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end px-6 pb-16 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-sand">
            {expedition.duration}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light text-ivory md:text-6xl">
            {expedition.name}
          </h1>
          <p className="mt-4 max-w-lg text-sm text-ivory/70">{expedition.tagline}</p>
        </div>
      </section>

      <section className="bg-beige py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="text-sm text-charcoal/50">
            Full itinerary and booking — coming soon.
          </p>
          <Link
            href="/expeditions/connect"
            className="mt-10 inline-block border border-charcoal/25 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-gold hover:text-gold"
          >
            Plan Your Journey →
          </Link>
          <Link
            href="/expeditions"
            className="mt-6 block text-xs uppercase tracking-[0.2em] text-charcoal/45 hover:text-charcoal"
          >
            ← All expeditions
          </Link>
        </div>
      </section>
    </>
  );
}
