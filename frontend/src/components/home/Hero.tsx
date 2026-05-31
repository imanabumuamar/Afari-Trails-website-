import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FeatureCards } from "@/components/home/FeatureCards";
import { getHomepageAsync } from "@/services/content/homepage";
import type {
  HeroHeight,
  HeroTextAlign,
  HeroVerticalPosition,
} from "@/types/homepage";

const HEIGHT_CLASS: Record<HeroHeight, string> = {
  full: "min-h-[92vh] lg:min-h-screen",
  tall: "min-h-[75vh]",
  medium: "min-h-[60vh]",
};

const VERTICAL_CLASS: Record<HeroVerticalPosition, string> = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

const ALIGN_WRAP_CLASS: Record<HeroTextAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center mx-auto",
};

const ALIGN_BUTTONS_CLASS: Record<HeroTextAlign, string> = {
  left: "justify-start",
  center: "justify-center",
};

export async function Hero() {
  const { hero } = await getHomepageAsync();

  const heightClass = HEIGHT_CLASS[hero.height];
  const isLight = hero.textColor === "light";
  const headingColor = isLight ? "text-ivory" : "text-charcoal";
  const subtextColor = isLight ? "text-ivory/80" : "text-charcoal/75";
  const eyebrowColor = isLight ? "text-ivory/70" : "text-charcoal/60";

  return (
    <section className="relative bg-matte-black">
      <div className={`relative ${heightClass}`}>
        <Image
          src={hero.poster.src}
          alt={hero.poster.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {hero.video && (
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
        )}
        <div
          className="absolute inset-0 bg-matte-black"
          style={{ opacity: hero.overlayOpacity / 100 }}
        />

        <div
          className={`relative z-10 mx-auto flex ${heightClass} max-w-[1400px] flex-col ${VERTICAL_CLASS[hero.verticalPosition]} px-6 py-28 lg:px-10`}
        >
          <div className={`flex w-full max-w-xl flex-col lg:max-w-2xl ${ALIGN_WRAP_CLASS[hero.textAlign]}`}>
            {hero.eyebrow && (
              <p className={`mb-4 text-xs font-medium uppercase tracking-[0.3em] ${eyebrowColor}`}>
                {hero.eyebrow}
              </p>
            )}
            <h1 className={`font-serif text-[2.5rem] font-light leading-[1.12] tracking-wide sm:text-5xl lg:text-[3.5rem] ${headingColor}`}>
              {hero.heading}
            </h1>
            <p className={`mt-6 max-w-md text-sm leading-relaxed md:text-base ${subtextColor}`}>
              {hero.subtext}
            </p>
            {(hero.showPrimaryCta || hero.showSecondaryCta) && (
              <div className={`mt-10 flex flex-wrap items-center gap-6 ${ALIGN_BUTTONS_CLASS[hero.textAlign]}`}>
                {hero.showPrimaryCta && (
                  <Button href={hero.primaryCta.href} variant="sand">
                    {hero.primaryCta.label}
                  </Button>
                )}
                {hero.showSecondaryCta && (
                  <Button href={hero.secondaryCta.href} variant="text" showArrow>
                    {hero.secondaryCta.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative pb-16 lg:pb-20">
        <FeatureCards />
      </div>
    </section>
  );
}
