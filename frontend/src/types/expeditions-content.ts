import type { ExpeditionDetail } from "@/types/expedition-detail";
import type {
  ExpeditionsAllPageContent,
  ExpeditionsPageContent,
} from "@/lib/data/expedition-defaults";

export type ExpeditionDetailRecord = ExpeditionDetail & {
  published?: boolean;
};

export type ExpeditionsContentData = {
  page: ExpeditionsPageContent;
  allPage: ExpeditionsAllPageContent;
  featuredIds: string[];
  expeditions: ExpeditionDetailRecord[];
};

export type ExpeditionsContentDocument = {
  key: string;
  data: ExpeditionsContentData;
  updatedAt: string;
};

export type FeaturedExpeditionCard = {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  image: string;
  comingSoon?: boolean;
};

export type ExpeditionCatalogItem = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  duration: string;
  location: string;
  style: string;
  heroImage: string;
  intro: string;
  regionId: string;
  comingSoon?: boolean;
};
