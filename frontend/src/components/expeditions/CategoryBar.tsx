import { CategoryIcon } from "@/components/expeditions/CategoryIcon";
import { categoryBar } from "@/lib/data/expeditions";

export function CategoryBar() {
  return (
    <section className="bg-charcoal py-14 text-ivory lg:py-16">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-10">
        {categoryBar.map((cat, i) => (
          <div
            key={cat.id}
            className={`flex flex-col items-center text-center ${
              i > 0 ? "sm:border-l sm:border-ivory/15 sm:pl-8 lg:pl-0" : ""
            } ${i === 2 ? "max-lg:sm:border-l-0" : ""}`}
          >
            <CategoryIcon type={cat.icon} />
            <h3 className="mt-5 text-[10px] font-medium uppercase tracking-[0.26em] text-ivory">
              {cat.title}
            </h3>
            <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-ivory/55">
              {cat.tagline}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
