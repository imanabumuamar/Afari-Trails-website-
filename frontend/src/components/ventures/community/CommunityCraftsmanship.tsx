import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { communityCraftsmanship as default_communityCraftsmanship } from "@/lib/data/community";

type CraftImage = { src: string; alt: string };

function resolveImages(data: Record<string, unknown>): CraftImage[] {
  const raw = Array.isArray(data.images)
    ? data.images
    : Array.isArray(data.moodboard)
      ? data.moodboard
      : default_communityCraftsmanship.images;

  const images = (raw as unknown[]).map((item) => {
    const r = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      src: typeof r.src === "string" ? r.src : "",
      alt: typeof r.alt === "string" ? r.alt : "",
    };
  });

  while (images.length < 3) {
    images.push(default_communityCraftsmanship.images[images.length] ?? { src: "", alt: "" });
  }

  return images.slice(0, 3);
}

function resolveHighlights(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.highlights) && data.highlights.length > 0) {
    return data.highlights.filter((x): x is string => typeof x === "string" && x.length > 0);
  }
  return [...default_communityCraftsmanship.highlights];
}

export async function CommunityCraftsmanship() {
  const content = await getVenturePageContent("community");
  const raw = (content.communityCraftsmanship ?? {}) as Record<string, unknown>;

  const label =
    typeof raw.label === "string" ? raw.label : default_communityCraftsmanship.label;
  const heading =
    typeof raw.heading === "string"
      ? raw.heading
      : default_communityCraftsmanship.heading;
  const body =
    typeof raw.body === "string" ? raw.body : default_communityCraftsmanship.body;
  const images = resolveImages(raw);
  const highlights = resolveHighlights(raw);

  const [first, second, third] = images;

  return (
    <section className="grid lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-2 p-4 lg:gap-3 lg:p-8">
        <div className="hover-zoom relative aspect-square overflow-hidden bg-charcoal/10">
          <Image
            src={first.src}
            alt={first.alt || "Craftsmanship"}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        <div className="hover-zoom relative aspect-square overflow-hidden bg-charcoal/10">
          <Image
            src={second.src}
            alt={second.alt || "Craftsmanship"}
            fill
            className="object-cover"
            sizes="25vw"
          />
        </div>
        <div className="hover-zoom relative col-span-2 aspect-[2/1] overflow-hidden bg-charcoal/10">
          <Image
            src={third.src}
            alt={third.alt || "Craftsmanship"}
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center bg-sand-light/30 px-6 py-20 lg:px-14 lg:py-28">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {heading}
        </h2>
        <p className="mt-8 max-w-md text-sm leading-[1.9] text-charcoal/70 md:text-base">
          {body}
        </p>
        <ul className="mt-10 space-y-3 border-t border-charcoal/10 pt-10">
          {highlights.map((item) => (
            <li
              key={item}
              className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
