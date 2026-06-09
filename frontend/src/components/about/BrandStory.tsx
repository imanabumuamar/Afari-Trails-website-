import { getAboutContent } from "@/services/content/about";

export async function BrandStory() {
  const { brandStory } = await getAboutContent();

  return (
    <section className="bg-[#e8dfd0] pt-20 pb-0 lg:pt-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.32em] text-charcoal/50">
          {brandStory.label}
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            {brandStory.leftManifesto.map((line, i) => (
              <p
                key={i}
                className={`font-serif text-charcoal ${
                  i === 0
                    ? "text-3xl font-light leading-snug md:text-4xl lg:text-[2.5rem]"
                    : i >= brandStory.leftManifesto.length - 2
                      ? "text-xl font-light leading-relaxed text-charcoal/85 md:text-2xl"
                      : "text-lg leading-relaxed text-charcoal/75 md:text-xl"
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="space-y-8 lg:pt-4">
            {brandStory.rightBody.map((para, i) => (
              <p
                key={i}
                className="text-sm leading-[1.9] text-charcoal/70 md:text-base"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
