import type { CollectionIconType } from "@/lib/data/store";

type CollectionIconProps = {
  type: CollectionIconType;
  className?: string;
};

export function CollectionIcon({ type, className = "h-8 w-8" }: CollectionIconProps) {
  const stroke = "currentColor";
  const props = {
    className,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke,
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (type) {
    case "giraffe":
      return (
        <svg {...props}>
          <path d="M10 26V14M10 14c0-3 2-6 5-6s5 3 5 6M10 14H6M20 14h4M14 8c1-2 3-3 5-2M22 26V18M22 18c2 0 4-2 4-5" />
          <circle cx="19" cy="9" r="1.5" fill={stroke} stroke="none" />
        </svg>
      );
    case "vehicle":
      return (
        <svg {...props}>
          <path d="M6 20h20l-2-8H8L6 20zM8 20v3M24 20v3" />
          <circle cx="10" cy="23" r="2" />
          <circle cx="22" cy="23" r="2" />
          <path d="M12 12h8" />
        </svg>
      );
    case "campfire":
      return (
        <svg {...props}>
          <path d="M16 26c-4-4-2-10 0-14 2 4 4 10 0 14z" />
          <path d="M16 26v-4M12 22h8" />
        </svg>
      );
    case "mountains":
      return (
        <svg {...props}>
          <path d="M4 24 L12 10 L18 18 L24 8 L28 24 Z" />
        </svg>
      );
    case "trail":
      return (
        <svg {...props}>
          <path d="M8 24c4-8 8-12 16-16M8 24l3-3M24 8l-3 3" />
          <circle cx="8" cy="24" r="1.5" fill={stroke} stroke="none" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M10 6h12v20H10a4 4 0 0 0-4 4V6a4 4 0 0 1 4-4z" />
          <path d="M22 6v20" />
        </svg>
      );
  }
}
