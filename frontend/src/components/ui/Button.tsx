import Link from "next/link";

type ButtonVariant = "sand" | "text" | "dark" | "ghost" | "outline-light";

const variants: Record<ButtonVariant, string> = {
  sand: "bg-sand px-8 py-3.5 text-charcoal hover:bg-sand-light",
  text: "px-0 py-0 text-ivory/90 underline-offset-4 hover:text-ivory hover:underline",
  dark: "bg-matte-black px-8 py-3.5 text-ivory hover:bg-charcoal",
  ghost:
    "border border-charcoal/20 px-8 py-3 text-charcoal hover:border-gold hover:text-gold",
  "outline-light":
    "border border-ivory/70 bg-transparent px-8 py-3.5 text-ivory hover:border-ivory hover:bg-ivory/10",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  showArrow?: boolean;
};

export function Button({
  href,
  children,
  variant = "sand",
  className = "",
  showArrow = false,
}: ButtonProps) {
  const base =
    variant === "text"
      ? "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors"
      : "inline-flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300";

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {showArrow && <span aria-hidden>→</span>}
    </Link>
  );
}
