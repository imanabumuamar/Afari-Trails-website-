import { EXPEDITIONS_CONTENT_DEFAULTS } from "@/lib/data/expedition-defaults";
import type { ExpeditionsContentData } from "@/types/expeditions-content";

function mergePage<T extends Record<string, unknown>>(
  defaults: T,
  remote?: Partial<T>,
): T {
  if (!remote) return defaults;
  return { ...defaults, ...remote };
}

/** Client-safe merge of remote expedition CMS data with defaults (no Node fs). */
export function mergeExpeditionsData(
  remote?: Partial<ExpeditionsContentData> | null,
): ExpeditionsContentData {
  const defaults = EXPEDITIONS_CONTENT_DEFAULTS;
  if (!remote) return defaults;

  const page = (remote.page ?? {}) as Partial<ExpeditionsContentData["page"]>;
  const allPage = (remote.allPage ??
    {}) as Partial<ExpeditionsContentData["allPage"]>;
  return {
    page: {
      hero: mergePage(defaults.page.hero, page.hero),
      ourPromise: mergePage(defaults.page.ourPromise, page.ourPromise),
      categoryBar:
        Array.isArray(page.categoryBar) && page.categoryBar.length > 0
          ? page.categoryBar
          : defaults.page.categoryBar,
      expeditionApproach: mergePage(
        defaults.page.expeditionApproach,
        page.expeditionApproach,
      ),
      expeditionsCta: mergePage(defaults.page.expeditionsCta, page.expeditionsCta),
    },
    allPage: {
      hero: mergePage(defaults.allPage.hero, allPage.hero),
      gridIntro: mergePage(defaults.allPage.gridIntro, allPage.gridIntro),
      regions:
        Array.isArray(allPage.regions) && allPage.regions.length > 0
          ? allPage.regions
          : defaults.allPage.regions,
      cta: mergePage(defaults.allPage.cta, allPage.cta),
    },
    featuredIds:
      Array.isArray(remote.featuredIds) && remote.featuredIds.length > 0
        ? remote.featuredIds
        : defaults.featuredIds,
    expeditions:
      Array.isArray(remote.expeditions) && remote.expeditions.length > 0
        ? remote.expeditions
        : defaults.expeditions,
  };
}
