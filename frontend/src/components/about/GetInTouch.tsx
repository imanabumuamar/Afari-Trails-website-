import Link from "next/link";
import { getInTouch } from "@/lib/data/about";

export function GetInTouch() {
  return (
    <section className="border-t border-ivory/10 bg-[#2b231e] py-20 text-ivory lg:py-24">
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
        <h2 className="font-serif text-3xl font-light md:text-4xl">
          {getInTouch.heading}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-ivory/60">
          {getInTouch.body}
        </p>
        <Link
          href={getInTouch.href}
          className="mt-10 inline-block text-xs font-medium uppercase tracking-[0.25em] text-sand transition-colors hover:text-ivory"
        >
          {getInTouch.cta} →
        </Link>
      </div>
    </section>
  );
}
