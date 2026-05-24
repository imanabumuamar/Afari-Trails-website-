import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getVenturePageContent } from "@/services/content/ventures";
import { agricultureEcosystem as default_agricultureEcosystem } from "@/lib/data/agriculture";

export async function AgricultureEcosystem() {
  const content = await getVenturePageContent("agriculture");
  const agricultureEcosystem = content.agricultureEcosystem as typeof default_agricultureEcosystem;

  return (
    <section className="border-y border-charcoal/10 bg-beige py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
        <SectionLabel>{agricultureEcosystem.label}</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          {agricultureEcosystem.heading}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-[1.9] text-charcoal/65 md:text-base">
          {agricultureEcosystem.body}
        </p>
        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
          aria-label="Afari ventures ecosystem"
        >
          {agricultureEcosystem.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.22em] text-charcoal/55 transition-colors hover:text-gold"
            >
              {link.label} →
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
