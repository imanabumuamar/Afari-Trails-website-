import { communityStories as defaultCommunityStories } from "@/lib/data/community";

export type CommunityArchiveStoryItem = {
  archiveId: string;
  published: boolean;
};

export type CommunityStoryProfile = {
  name: string;
  role: string;
  quote: string;
  image: string;
  published: boolean;
};

export type CommunityStoriesListingStatus = "published" | "hidden";

export const COMMUNITY_STORY_LISTING_OPTIONS: {
  value: CommunityStoriesListingStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "published",
    label: "Published",
    description: "Shown in the Voices from the trail section on the community page.",
  },
  {
    value: "hidden",
    label: "Hidden",
    description: "Kept in admin but removed from the public community page.",
  },
];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function getCommunityStoryListingStatus(item: {
  published?: boolean;
}): CommunityStoriesListingStatus {
  return item.published === false ? "hidden" : "published";
}

export function applyCommunityStoryListingStatus<
  T extends { published?: boolean },
>(item: T, status: CommunityStoriesListingStatus): T {
  return { ...item, published: status === "published" };
}

export function isCommunityStoryVisible(item: { published?: boolean }): boolean {
  return item.published !== false;
}

function normalizeArchiveItem(raw: unknown): CommunityArchiveStoryItem | null {
  const row =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const archiveId = asString(row.archiveId);
  if (!archiveId) return null;
  return {
    archiveId,
    published: row.published !== false,
  };
}

export function resolveCommunityArchiveItems(
  data: Record<string, unknown>,
): CommunityArchiveStoryItem[] {
  if (Array.isArray(data.items) && data.items.length > 0) {
    return data.items
      .map(normalizeArchiveItem)
      .filter((item): item is CommunityArchiveStoryItem => Boolean(item));
  }

  if (Array.isArray(data.archiveIds)) {
    return data.archiveIds
      .map((id) => asString(id))
      .filter(Boolean)
      .map((archiveId) => ({ archiveId, published: true }));
  }

  return [];
}

function normalizeProfile(
  raw: unknown,
  fallback?: CommunityStoryProfile,
): CommunityStoryProfile {
  const row =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  return {
    name: asString(row.name, fallback?.name ?? ""),
    role: asString(row.role, fallback?.role ?? ""),
    quote: asString(row.quote, fallback?.quote ?? ""),
    image: asString(row.image, fallback?.image ?? ""),
    published:
      row.published === false
        ? false
        : fallback?.published === false
          ? false
          : true,
  };
}

export function resolveCommunityProfiles(
  data: Record<string, unknown>,
): CommunityStoryProfile[] {
  const defaults = defaultCommunityStories.profiles.map((profile) =>
    normalizeProfile(profile),
  );

  if (!Array.isArray(data.profiles) || data.profiles.length === 0) {
    return defaults;
  }

  return data.profiles.map((profile, index) =>
    normalizeProfile(profile, defaults[index] ?? defaults[0]),
  );
}

export function usesArchiveCommunityStories(
  data: Record<string, unknown>,
): boolean {
  return resolveCommunityArchiveItems(data).length > 0;
}
