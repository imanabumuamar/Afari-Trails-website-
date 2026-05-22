type PhilosophyIconProps = { type: string };

export function PhilosophyIcon({ type }: PhilosophyIconProps) {
  const cls = "mx-auto h-10 w-10 text-sand";
  switch (type) {
    case "explore":
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className={cls} aria-hidden>
          <circle cx="20" cy="20" r="12" />
          <path d="M20 8v24M8 20h24" />
        </svg>
      );
    case "authentic":
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className={cls} aria-hidden>
          <path d="M20 6v28M12 14h16M14 26h12" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className={cls} aria-hidden>
          <path d="M20 32C12 24 8 14 20 8c12 0 8 10 0 24z" />
        </svg>
      );
    case "slow":
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className={cls} aria-hidden>
          <circle cx="20" cy="22" r="10" />
          <path d="M20 12v4M28 22h-4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" className={cls} aria-hidden>
          <circle cx="14" cy="16" r="5" />
          <circle cx="26" cy="16" r="5" />
          <path d="M8 28c4-4 8-6 12-6s8 2 12 6" />
        </svg>
      );
  }
}
