import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectCategoriesProps = {
  config: ConnectPageConfig;
  /** When false, cards show title and description only (no photos). */
  showImages?: boolean;
  compact?: boolean;
};

export function ConnectCategories({
  config,
  showImages = true,
  compact = false,
}: ConnectCategoriesProps) {
  const { categories } = config;
  const sectionPad = compact ? "py-12 lg:py-16" : "py-24 lg:py-36";

  return (
    <section className={`bg-beige ${sectionPad}`}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>{categories.label}</SectionLabel>
          <h2
            className={`font-serif font-light text-charcoal ${
              compact
                ? "text-3xl md:text-4xl"
                : "text-4xl md:text-5xl"
            }`}
          >
            {categories.heading}
          </h2>
        </div>

        {!showImages ? (
          <ul
            className={`flex flex-wrap gap-2 ${compact ? "mt-6" : "mt-8"}`}
          >
            {categories.items.map((item) => {
              const href =
                item.href +
                (item.inquiry ? `?inquiry=${item.inquiry}` : "");

              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    title={item.description}
                    className="group inline-flex flex-col border border-charcoal/12 bg-ivory px-4 py-3 transition-colors hover:border-charcoal/25 hover:bg-sand-light/50"
                  >
                    <span className="text-xs font-medium uppercase tracking-[0.35em] text-charcoal transition-colors group-hover:text-gold">
                      {item.title}
                    </span>
                    <span className="mt-1 max-w-[220px] text-[11px] leading-snug text-charcoal/50">
                      {item.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {categories.items.map((item) => {
            const href =
              item.href +
              (item.inquiry ? `?inquiry=${item.inquiry}` : "");

            return (
              <Link
                key={item.id}
                href={href}
                className="hover-zoom group relative min-h-[300px] overflow-hidden bg-charcoal/10 lg:min-h-[340px]"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/88 via-matte-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-serif text-2xl font-light text-ivory">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ivory/65">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-block text-[10px] uppercase tracking-[0.22em] text-sand opacity-0 transition-opacity group-hover:opacity-100">
                    Connect →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
