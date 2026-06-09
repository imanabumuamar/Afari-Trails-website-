type ExpeditionEyebrowProps = {
  children: React.ReactNode;
  light?: boolean;
};

export function ExpeditionEyebrow({ children, light = false }: ExpeditionEyebrowProps) {
  return (
    <p
      className={`text-[10px] font-medium uppercase tracking-[0.32em] ${
        light ? "text-sand" : "text-gold-muted"
      }`}
    >
      {children}
    </p>
  );
}
