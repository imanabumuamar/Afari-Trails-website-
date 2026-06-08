import Link from "next/link";
import { FooterSubscribe } from "@/components/layout/FooterSubscribe";
import { Logo } from "@/components/ui/Logo";
import { footerLinks, site } from "@/lib/data/site";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-charcoal/8 bg-ivory text-charcoal">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-charcoal/60">
              {site.tagline}
            </p>
            <div className="mt-6 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-charcoal/45 transition-colors hover:text-gold"
                >
                  <span className="sr-only">{s.label}</span>
                  <SocialIcon name={s.label} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            <FooterColumn title="Explore" links={footerLinks.explore} />
            <FooterColumn title="Company" links={footerLinks.company} />
            <FooterColumn title="Support" links={footerLinks.support} />
            <FooterSubscribe />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-charcoal/10 pt-8 text-xs text-charcoal/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="text-charcoal/55">{site.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-charcoal/50">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-charcoal/65 transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const cls = "h-5 w-5";
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
        <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13v-3c0-1 .8-1 1-1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M10 8v8l7-4-7-4z" />
      <rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
