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
    <section className="grid bg-matte-black lg:grid-cols-2 lg:items-stretch">
      <div className="bg-matte-black px-6 py-8 text-ivory lg:px-10 lg:py-10">
        <div className="w-full max-w-md">
          <h2 className="font-serif text-2xl font-light md:text-3xl">
            {behindTheBrand.heading}
          </h2>
          {people.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-3">
              {people.map((img, i) => (
                <div
                  key={`${img.src}-${i}`}
                  className="flex min-w-0 flex-col text-left"
                >
                  <div className="relative aspect-square w-full max-w-[100px] overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.name || img.position || "Team member"}
                      fill
                      className="object-cover opacity-90"
                      sizes="(max-width: 640px) 45vw, 100px"
                    />
                  </div>
                  {(img.name.trim() || img.position.trim()) && (
                    <div className="mt-1.5 w-full">
                      {img.name.trim() ? (
                        <p className="font-serif text-[12px] font-light leading-snug text-ivory">
                          {img.name.trim()}
                        </p>
                      ) : null}
                      {img.position.trim() ? (
                        <p
                          className={`text-[8px] uppercase tracking-[0.14em] text-ivory/60 ${
                            img.name.trim() ? "mt-0.5" : ""
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
      </div>

      <div className="bg-gradient-to-b from-[#d6c7b1] via-[#8b7355] to-[#3c3228] px-6 py-8 text-ivory lg:px-10 lg:py-10">
        <div className="w-full max-w-md">
          <h2 className="font-serif text-2xl font-light md:text-3xl">
            {futureVision.heading}
          </h2>
          <p className="mt-4 text-xs leading-[1.75] text-ivory/85 md:text-sm">
            {futureVision.body}
          </p>

          <div className="mt-6 flex flex-wrap justify-between gap-x-4 gap-y-4 border-t border-ivory/20 pt-5 [&_svg]:h-7 [&_svg]:w-7">
            {futureVision.pillars.map((pillar) => (
              <Link
                key={pillar.href}
                href={pillar.href ?? "#"}
                className="flex flex-col items-center gap-1.5 text-center transition-opacity hover:opacity-80"
              >
                <PillarIcon type={pillar.icon} />
                <span className="text-[9px] uppercase tracking-[0.16em]">
                  {pillar.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
