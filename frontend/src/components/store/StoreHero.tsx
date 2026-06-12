import Image from "next/image";
import Link from "next/link";
import { getStoreContent } from "@/services/content/store";

const ghostBtn =
  "inline-flex items-center gap-2 border border-ivory/55 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10";

export async function StoreHero() {
  const { hero: storeHero, pageMode } = await getStoreContent();
  const showCtas = pageMode === "live";

  return (
    <section className="relative flex min-h-screen items-center">
      <Image
        src={storeHero.image}
        alt="Traveler on a rocky ledge overlooking the African savanna at dawn"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-matte-black/75 via-matte-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-matte-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 lg:px-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-sand">
          {storeHero.label}
        </p>
        <h1 className="mt-6 max-w-2xl font-serif text-5xl font-light leading-[1.1] text-ivory sm:text-6xl lg:text-[4.5rem]">
          {storeHero.heading}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-ivory/70 md:text-base">
          {storeHero.subtext}
        </p>
        {showCtas && (
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link href="#collections" className={ghostBtn}>
              Explore Collection
              <span aria-hidden>→</span>
            </Link>
            <Link href="#products" className={ghostBtn}>
              View New Arrivals
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
