import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

const ventures = [
  {
    title: "Eco-lodges",
    description:
      "Low-impact hospitality rooted in landscape and local craft.",
  },
  {
    title: "Safari camps",
    description:
      "Intimate camps designed for stillness, not spectacle.",
  },
  {
    title: "Agricultural projects",
    description:
      "Regenerative land stewardship across the Zambezi corridor.",
  },
  {
    title: "Conservation partnerships",
    description:
      "Long-term alliances with communities protecting wild places.",
  },
  {
    title: "Hospitality ventures",
    description:
      "Experiences that fund preservation and dignified livelihoods.",
  },
];

export function InvestmentSection() {
  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="max-w-2xl">
          <SectionLabel>Ventures</SectionLabel>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal md:text-5xl">
            Investment & Development
          </h2>
          <p className="mt-6 text-base leading-relaxed text-charcoal/70">
            A luxury development journal — not corporate finance. We partner on
            ventures that protect wilderness, empower communities, and build
            sustainable safari futures across Southern Africa.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
          {ventures.map((item, i) => (
            <article
              key={item.title}
              className="group bg-ivory p-10 transition-colors hover:bg-sand-light/50"
            >
              <span className="font-serif text-sm text-gold-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-serif text-2xl font-light text-charcoal">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/ventures"
            className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-colors hover:text-gold"
          >
            View all ventures →
          </Link>
        </div>
      </div>
    </section>
  );
}
