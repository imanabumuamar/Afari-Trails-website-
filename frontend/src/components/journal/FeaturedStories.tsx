import Image from "next/image";
import Link from "next/link";
import type { JournalStoryRecord } from "@/types/journal-content";

type FeaturedStoriesProps = {
  featuredStory?: JournalStoryRecord;
  featuredSideStories: JournalStoryRecord[];
};

function SideStory({ story }: { story: JournalStoryRecord }) {
  return (
    <Link
      href={`/journal/${story.slug}`}
      className="group grid gap-5 border-b border-charcoal/8 pb-10 last:border-0 last:pb-0 md:grid-cols-5"
    >
      <div className="hover-zoom relative aspect-[16/10] overflow-hidden md:col-span-2 md:aspect-auto md:min-h-[120px]">
        <Image
          src={story.image}
          alt=""
          fill
          className="object-cover"
          sizes="180px"
        />
      </div>
      <div className="flex flex-col justify-center md:col-span-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-muted">
          {story.categoryLabel}
        </p>
        <h3 className="mt-2 font-serif text-xl font-light text-charcoal transition-colors group-hover:text-gold-muted">
          {story.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/55">
          {story.excerpt}
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
          {story.dateDisplay}
        </p>
      </div>
    </Link>
  );
}

export function FeaturedStories({
  featuredStory,
  featuredSideStories,
}: FeaturedStoriesProps) {
  if (!featuredStory) {
    return (
      <section className="bg-beige py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mx-auto flex max-w-3xl flex-col justify-center gap-10 lg:gap-12">
            {featuredSideStories.map((story) => (
              <SideStory key={story.slug} story={story} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-beige py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Link
            href={`/journal/${featuredStory.slug}`}
            className="hover-zoom group relative min-h-[420px] overflow-hidden lg:min-h-[600px]"
          >
            <Image
              src={featuredStory.image}
              alt={featuredStory.title}
              fill
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/88 via-matte-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-sand">
                {featuredStory.categoryLabel}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-light leading-snug text-ivory md:text-4xl">
                {featuredStory.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70">
                {featuredStory.excerpt}
              </p>
              <span className="mt-6 inline-block text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/90 group-hover:text-sand">
                Read Story →
              </span>
            </div>
          </Link>

          <div className="flex flex-col justify-center gap-10 lg:gap-12">
            {featuredSideStories.map((story) => (
              <SideStory key={story.slug} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
