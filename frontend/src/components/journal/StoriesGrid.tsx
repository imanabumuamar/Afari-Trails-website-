import Image from "next/image";
import Link from "next/link";
import type { JournalStoryRecord } from "@/types/journal-content";

type StoriesGridProps = {
  stories: JournalStoryRecord[];
  showViewAll?: boolean;
};

export function StoriesGrid({ stories, showViewAll = true }: StoriesGridProps) {
  if (stories.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-charcoal/50">
        No stories match your search.
      </p>
    );
  }

  return (
    <>
      <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-3xl font-light text-charcoal md:text-4xl">
          Latest Stories
        </h2>
        {showViewAll && (
          <Link
            href="/journal"
            className="text-[10px] font-medium uppercase tracking-[0.25em] text-charcoal/55 transition-colors hover:text-charcoal"
          >
            View All Stories →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/journal/${story.slug}`}
            className="group"
          >
            <div className="hover-zoom relative mb-6 aspect-[4/5] overflow-hidden bg-charcoal/5">
              <Image
                src={story.image}
                alt=""
                fill
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-muted">
              {story.categoryLabel}
            </p>
            <h3 className="mt-3 font-serif text-xl font-light leading-snug text-charcoal transition-colors group-hover:text-gold-muted md:text-2xl">
              {story.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/55 line-clamp-2">
              {story.excerpt}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-charcoal/40">
              {story.dateDisplay} · {story.readTime}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
