import Image from "next/image";
import Link from "next/link";
import { PhilosophyIcon } from "@/components/about/PhilosophyIcon";
import { behindTheBrand, futureVision } from "@/lib/data/about";

function PillarIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    venture: "explore",
    expedition: "slow",
    archive: "authentic",
    store: "leaf",
  };
  return <PhilosophyIcon type={icons[type] ?? "connect"} />;
}

export function BehindVisionSplit() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="bg-matte-black px-6 py-16 lg:px-10 lg:py-20">
        <h2 className="font-serif text-3xl font-light text-ivory md:text-4xl">
          {behindTheBrand.heading}
        </h2>
        <div className="mt-10 grid grid-cols-4 gap-2">
          {behindTheBrand.images.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover opacity-90"
                sizes="120px"
              />
            </div>
          ))}
        </div>
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
              href={pillar.href}
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
