"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "afari-whatsapp-bubble-dismissed";
const DEFAULT_MESSAGE =
  "Hello Afari Trails — I'd like to learn more about your expeditions.";

function whatsappHref(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppWidget() {
  const pathname = usePathname();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim() || DEFAULT_MESSAGE;

  const [bubbleOpen, setBubbleOpen] = useState(false);

  useEffect(() => {
    if (!number) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      const timer = window.setTimeout(() => setBubbleOpen(true), 2500);
      return () => window.clearTimeout(timer);
    } catch {
      setBubbleOpen(true);
    }
  }, [number]);

  if (!number || pathname.startsWith("/admin")) {
    return null;
  }

  const href = whatsappHref(number, message);

  function dismissBubble() {
    setBubbleOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-end gap-3 sm:bottom-6 sm:right-6"
      aria-label="WhatsApp chat"
    >
      {bubbleOpen && (
        <div className="relative max-w-[240px] rounded-sm border border-charcoal/10 bg-ivory px-4 py-3 shadow-lg sm:max-w-[260px]">
          <button
            type="button"
            onClick={dismissBubble}
            className="absolute right-2 top-2 text-charcoal/35 transition-colors hover:text-charcoal/70"
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <p className="pr-5 font-serif text-base font-light text-charcoal">
            Questions about a journey?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-charcoal/60">
            Message us on WhatsApp — we typically reply within a day.
          </p>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[10px] font-medium uppercase tracking-[0.2em] text-[#128C7E] hover:underline"
            onClick={dismissBubble}
          >
            Start chat →
          </Link>
        </div>
      )}

      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        aria-label="Chat on WhatsApp"
        onClick={() => setBubbleOpen(false)}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </Link>
    </div>
  );
}
