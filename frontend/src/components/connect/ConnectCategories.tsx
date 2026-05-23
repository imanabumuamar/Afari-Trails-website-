import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectCategoriesProps = {
  config: ConnectPageConfig;
};

export function ConnectCategories({ config }: ConnectCategoriesProps) {
  const { categories } = config;

  return (
    <section className="bg-beige py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <SectionLabel>{categories.label}</SectionLabel>
          <h2 className="font-serif text-4xl font-light text-charcoal md:text-5xl">
            {categories.heading}
          </h2>
        </div>

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
      </div>
    </section>
  );
}
