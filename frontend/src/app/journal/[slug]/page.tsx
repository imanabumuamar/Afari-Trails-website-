import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllStorySlugs,
  getStoryBySlug,
} from "@/services/content/journal";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const paragraphs = story.body.split("\n\n").filter(Boolean);
  const hasBody = paragraphs.length > 0;

  return (
    <article>
      <section className="relative min-h-[70vh] pt-28">
        <Image
          src={story.image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-matte-black/50" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end px-6 pb-16 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-sand">
            {story.categoryLabel}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light text-ivory md:text-6xl">
            {story.title}
          </h1>
          <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-ivory/60">
            {story.dateDisplay} · {story.readTime}
          </p>
        </div>
      </section>

      <section className="bg-beige py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-10">
          <p className="font-serif text-2xl font-light leading-relaxed text-charcoal/80">
            {story.excerpt}
          </p>
          {hasBody ? (
            <div className="mt-10 space-y-6">
              {paragraphs.map((paragraph: string) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm leading-[1.9] text-charcoal/55">
              Full article coming soon.
            </p>
          )}
          <Link
            href="/journal"
            className="mt-12 inline-block text-xs uppercase tracking-[0.25em] text-charcoal/50 hover:text-charcoal"
          >
            ← Back to Journal
          </Link>
        </div>
      </section>
    </article>
  );
}
