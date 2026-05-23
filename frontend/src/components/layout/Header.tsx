"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { DARK_HERO_PATHS, navLinks, ROUTES } from "@/config/routes";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16 16" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      {open ? (
        <path d="M6 6L18 18M18 6L6 18" />
      ) : (
        <>
          <path d="M4 9H20" />
          <path d="M4 15H20" />
        </>
      )}
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isDarkHero = DARK_HERO_PATHS.includes(pathname);
  const isJournal = pathname === "/journal" || pathname.startsWith("/journal/");
  const isArchive = pathname === "/archive";
  const isExpeditions = pathname.startsWith("/expeditions");
  const isVentures = pathname.startsWith("/ventures");
  const useSearchAndMenu = isJournal || isArchive;

  const connectHref = isExpeditions
    ? ROUTES.expeditionsConnect
    : isVentures
      ? ROUTES.venturesConnect
      : ROUTES.contact;
  const useLightChrome = isDarkHero && !scrolled;

  useEffect(() => {
    if (!isDarkHero) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDarkHero]);

  const navClass = useLightChrome
    ? "text-ivory/90 hover:text-ivory"
    : "text-charcoal/75 hover:text-charcoal";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        useLightChrome
          ? "bg-transparent"
          : isDarkHero
            ? "border-b border-ivory/10 bg-matte-black/55 backdrop-blur-md"
            : "border-b border-charcoal/8 bg-beige/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:h-20 lg:px-10">
        <Logo light={useLightChrome} />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          aria-label="Main navigation"
        >
          <ul className="flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[10px] font-medium uppercase tracking-[0.22em] transition-colors ${navClass} ${
                      active
                        ? useLightChrome
                          ? "border-b border-ivory pb-0.5 text-ivory"
                          : "border-b border-charcoal pb-0.5 text-charcoal"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`flex items-center gap-4 lg:gap-5 ${
            useLightChrome ? "text-ivory" : "text-charcoal"
          }`}
        >
          {useSearchAndMenu ? (
            <button
              type="button"
              aria-label="Search"
              className="transition-colors hover:opacity-80"
            >
              <SearchIcon />
            </button>
          ) : (
            <Link
              href={ROUTES.expeditionsConnect}
              className={`hidden text-[10px] font-medium uppercase tracking-[0.2em] transition-colors sm:inline-block ${
                useLightChrome
                  ? "border border-ivory/50 px-4 py-2 text-ivory/90 hover:border-ivory hover:text-ivory"
                  : "border border-charcoal/25 px-4 py-2 text-charcoal/80 hover:border-charcoal hover:text-charcoal"
              }`}
            >
              Plan Your Journey
            </Link>
          )}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className={`border-t px-6 py-8 lg:hidden ${
            useLightChrome
              ? "border-ivory/10 bg-matte-black/95"
              : "border-charcoal/10 bg-beige"
          }`}
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-serif text-2xl font-light ${
                    useLightChrome ? "text-ivory" : "text-charcoal"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={connectHref}
                className="text-xs uppercase tracking-[0.22em] text-gold"
                onClick={() => setMobileOpen(false)}
              >
                {isJournal || isExpeditions
                  ? "Plan Your Journey"
                  : isVentures
                    ? "Ventures Connect"
                    : "Connect"}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
