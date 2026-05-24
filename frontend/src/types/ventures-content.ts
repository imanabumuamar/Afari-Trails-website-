import type { VentureSlug } from "@/lib/data/venture-defaults";

export type VentureContentDocument = {
  slug: VentureSlug;
  data: Record<string, unknown>;
  updatedAt: string;
};
