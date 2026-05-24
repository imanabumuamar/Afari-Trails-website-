"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { ArchiveImageRecord } from "@/types/archive-content";

type ArchiveLightboxProps = {
  item: ArchiveImageRecord | null;
  onClose: () => void;
};

export function ArchiveLightbox({ item, onClose }: ArchiveLightboxProps) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-matte-black/95 p-4 animate-fade-in md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 text-xs uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-ivory md:right-10 md:top-10"
      >
        Close
      </button>

      <div
        className="grid max-h-[90vh] w-full max-w-6xl gap-8 overflow-y-auto lg:grid-cols-5 lg:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] min-h-[240px] lg:col-span-3 lg:aspect-auto lg:min-h-[70vh]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center lg:col-span-2 lg:py-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-sand">
            {item.location}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light text-ivory md:text-4xl">
            {item.title}
          </h2>
          <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-ivory/45">
            Photograph by {item.photographer}
          </p>
          <p className="mt-8 text-sm leading-relaxed text-ivory/70">{item.caption}</p>
          {item.related && (
            <Link
              href={item.related.href}
              className="mt-10 inline-block text-xs uppercase tracking-[0.22em] text-sand transition-colors hover:text-ivory"
              onClick={onClose}
            >
              {item.related.label} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
