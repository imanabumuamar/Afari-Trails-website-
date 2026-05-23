import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FeatureCards } from "@/components/home/FeatureCards";
import { getHomepage } from "@/services/content/homepage";

export function Hero() {
  const { hero } = getHomepage();

  return (
    <section className="relative bg-matte-black">
      <div className="relative min-h-[92vh] lg:min-h-screen">
        <Image
          src={hero.poster.src}
          alt={hero.poster.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster.src}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        >
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black/55 via-matte-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-matte-black/15" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-center px-6 pt-28 lg:min-h-screen lg:px-10 lg:pt-32">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="font-serif text-[2.5rem] font-light leading-[1.12] tracking-wide text-ivory sm:text-5xl lg:text-[3.5rem]">
              {hero.heading}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/80 md:text-base">
              {hero.subtext}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href={hero.primaryCta.href} variant="sand">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="text" showArrow>
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative pb-16 lg:pb-20">
        <FeatureCards />
      </div>
    </section>
  );
}
