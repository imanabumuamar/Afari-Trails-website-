import Image from "next/image";
import Link from "next/link";
import { getHomepageAsync } from "@/services/content/homepage";
import type { HomepageContent } from "@/types/homepage";

type FeatureCardConfig = {
  id: keyof HomepageContent["featureCards"];
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: "compass" | "layers" | "bag";
};

const CARD_CONFIG: FeatureCardConfig[] = [
  {
    id: "expeditions",
    title: "Expeditions",
    description: "Immersive journeys into Africa's wild places.",
    cta: "Explore",
    href: "/expeditions",
    icon: "compass",
  },
  {
    id: "ventures",
    title: "Ventures",
    description: "Investing in sustainable development and local impact.",
    cta: "Discover",
    href: "/ventures",
    icon: "layers",
  },
  {
    id: "store",
    title: "Store",
    description: "Safari-inspired apparel and expedition essentials.",
    cta: "Shop Now",
    href: "/store",
    icon: "bag",
  },
];

function CardIcon({ type }: { type: FeatureCardConfig["icon"] }) {
  const cls = "h-3.5 w-3.5 text-ivory/90";
  if (type === "compass") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 4v16M4 12h16" />
      </svg>
    );
  }
  if (type === "layers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4" />
        <path d="M4 16l8 4 8-4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
      <path d="M6 8h12l-1 10H7L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  );
}

export async function FeatureCards() {
  const { featureCards } = await getHomepageAsync();

  return (
    <div className="relative z-20 mx-auto grid max-w-[1200px] gap-3 px-6 pb-8 -mt-12 sm:-mt-14 md:grid-cols-3 md:-mt-16 md:gap-4 lg:-mt-20 lg:px-10 lg:gap-5 lg:pb-10">
      {CARD_CONFIG.map((card) => {
        const image = featureCards[card.id];
        return (
          <Link
            key={card.href}
            href={card.href}
            className="hover-zoom group relative min-h-[200px] overflow-hidden bg-matte-black shadow-lg md:min-h-[220px]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/25 to-matte-black/10" />
            <div className="absolute left-4 top-4">
              <CardIcon type={card.icon} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.24em] text-ivory">
                {card.title}
              </h3>
              <p className="mt-1.5 max-w-[200px] text-xs leading-relaxed text-ivory/75">
                {card.description}
              </p>
              <span className="mt-2.5 inline-block text-[9px] font-medium uppercase tracking-[0.2em] text-sand transition-colors group-hover:text-ivory">
                {card.cta} →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
