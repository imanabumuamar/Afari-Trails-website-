import { ExpeditionEyebrow } from "@/components/expeditions/detail/ExpeditionEyebrow";
import { resolveSectionCopy } from "@/lib/expeditions/resolve-expedition-display";
import type { ExpeditionDetail } from "@/types/expedition-detail";

type ExpeditionStoriesProps = {
  expedition: ExpeditionDetail;
};

export function ExpeditionStories({ expedition }: ExpeditionStoriesProps) {
  const stories = expedition.stories ?? [];
  if (stories.length === 0) return null;
  const sections = resolveSectionCopy(expedition);

  return (
    <section className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ExpeditionEyebrow>{sections.storiesLabel}</ExpeditionEyebrow>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {sections.storiesHeading}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <blockquote
              key={`${story.name}-${story.quote.slice(0, 24)}`}
              className="border border-charcoal/10 bg-beige/40 p-6"
            >
              <p className="font-serif text-lg font-light italic leading-relaxed text-charcoal/80">
                &ldquo;{story.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-charcoal/10 pt-4">
                <p className="text-sm font-medium text-charcoal">{story.name}</p>
                <p className="mt-1 text-xs text-charcoal/50">{story.location}</p>
                <p className="mt-2 text-gold-muted" aria-label="5 star rating">
                  ★★★★★
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
