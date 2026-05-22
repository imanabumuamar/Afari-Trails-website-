import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

type PageShellProps = {
  label: string;
  title: string;
  description: string;
};

export function PageShell({ label, title, description }: PageShellProps) {
  return (
    <section className="flex min-h-[70vh] items-center bg-beige pt-32">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-12">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="font-serif text-5xl font-light text-charcoal">{title}</h1>
        <p className="mt-6 text-base leading-relaxed text-charcoal/65">
          {description}
        </p>
        <Link
          href="/"
          className="mt-10 inline-block text-xs uppercase tracking-[0.25em] text-gold-muted hover:text-gold"
        >
          ← Return home
        </Link>
      </div>
    </section>
  );
}
