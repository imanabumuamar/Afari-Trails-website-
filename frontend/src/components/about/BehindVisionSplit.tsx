import Image from "next/image";
import Link from "next/link";
import { PhilosophyIcon } from "@/components/about/PhilosophyIcon";
import { getAboutContent } from "@/services/content/about";

function PillarIcon({ type }: { type: string }) {
  const icons = {
    venture: "explore",
    expedition: "slow",
    archive: "authentic",
    store: "leaf",
  } as const;
  const icon =
    type in icons ? icons[type as keyof typeof icons] : "connect";
  return <PhilosophyIcon type={icon} />;
}

export async function BehindVisionSplit() {
  const { behindTheBrand, futureVision } = await getAboutContent();
  const people = behindTheBrand.images.filter((img) => img.src);

  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-matte-black px-6 py-16 lg:px-10 lg:py-20">
        <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl">
          {behindTheBrand.heading}
        </h2>
        {people.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12">
            {people.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="flex flex-col items-center text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.name || img.position || "Team member"}
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 1024px) 28vw, 140px"
                  />
                </div>
                {(img.name.trim() || img.position.trim()) && (
                  <div className="mt-3 w-full px-0.5">
                    {img.name.trim() ? (
                      <p className="font-serif text-[13px] font-light leading-snug text-ivory sm:text-sm">
                        {img.name.trim()}
                      </p>
                    ) : null}
                    {img.position.trim() ? (
                      <p
                        className={`text-[9px] uppercase tracking-[0.16em] text-ivory/60 ${
                          img.name.trim() ? "mt-1" : ""
                        }`}
                      >
                        {img.position.trim()}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between bg-gradient-to-b from-[#d6c7b1] via-[#8b7355] to-[#3c3228] px-6 py-16 text-ivory lg:px-12 lg:py-20">
        <div>
          <h2 className="font-serif text-3xl font-light md:text-4xl">
            {futureVision.heading}
          </h2>
          <p className="mt-8 max-w-md text-sm leading-[1.9] text-ivory/85 md:text-base">
            {futureVision.body}
          </p>
        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-8 border-t border-ivory/20 pt-10">
          {futureVision.pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href ?? "#"}
              className="flex flex-col items-center gap-3 text-center transition-opacity hover:opacity-80"
            >
              <PillarIcon type={pillar.icon} />
              <span className="text-[10px] uppercase tracking-[0.18em]">
                {pillar.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
