import { ventureStats } from "@/lib/data/ventures";

export function VenturesStats() {
  return (
    <section className="bg-charcoal py-14 text-ivory lg:py-16">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 px-6 sm:grid-cols-4 lg:px-10">
        {ventureStats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center px-4 py-2 text-center ${
              i > 0 ? "border-l border-ivory/15" : ""
            } ${i >= 2 ? "max-sm:mt-8 max-sm:border-l-0 max-sm:border-t max-sm:border-ivory/15 max-sm:pt-8" : ""}`}
          >
            <p className="font-serif text-4xl font-light text-ivory md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-ivory/55">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
