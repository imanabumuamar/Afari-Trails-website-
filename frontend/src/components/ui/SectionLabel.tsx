type SectionLabelProps = {
  children: React.ReactNode;
  light?: boolean;
};

export function SectionLabel({ children, light = false }: SectionLabelProps) {
  return (
    <p
      className={`mb-4 text-xs font-medium uppercase tracking-[0.35em] ${
        light ? "text-gold" : "text-gold-muted"
      }`}
    >
      {children}
    </p>
  );
}
