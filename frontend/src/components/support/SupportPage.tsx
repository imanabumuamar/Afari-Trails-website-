import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type {
  FaqItem,
  SupportRelatedLink,
  SupportSection,
} from "@/types/support-content";

type SupportPageProps = {
  label: string;
  title: string;
  intro: string;
  relatedLinks: SupportRelatedLink[];
  children: React.ReactNode;
};

export function SupportPage({
  label,
  title,
  intro,
  relatedLinks,
  children,
}: SupportPageProps) {
  return (
    <article>
      <section className="bg-beige pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <SectionLabel>{label}</SectionLabel>
          <h1 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-sm leading-[1.9] text-charcoal/65 md:text-base">
            {intro}
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-10">{children}</div>
      </section>

      <section className="border-t border-charcoal/8 bg-beige py-12">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 px-6 text-center lg:px-10">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.22em] text-charcoal/55 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.22em] text-charcoal/45 transition-colors hover:text-charcoal"
          >
            Home
          </Link>
        </div>
      </section>
    </article>
  );
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <dl className="space-y-10">
      {items.map((item) => (
        <div key={item.question} className="border-b border-charcoal/8 pb-10 last:border-0">
          <dt className="font-serif text-xl font-light text-charcoal md:text-2xl">
            {item.question}
          </dt>
          <dd className="mt-4 text-sm leading-[1.9] text-charcoal/70 md:text-base">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function SupportSections({ sections }: { sections: SupportSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="font-serif text-2xl font-light text-charcoal">
            {section.heading}
          </h2>
          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
