import type { HomepageContent } from "@/types/homepage";
import { apiRequest } from "@/services/api/client";

/** Admin API — homepage CMS (mirrors Next.js routes until backend owns content) */
export const homepageApi = {
  get(): Promise<HomepageContent> {
    return apiRequest<HomepageContent>("/content/homepage").catch(() =>
      fetch("/api/admin/content/homepage").then((r) => r.json())
    );
  },

  update(content: Partial<HomepageContent>, adminSecret: string) {
    return apiRequest<HomepageContent>("/content/homepage", {
      method: "PUT",
      body: content,
      adminSecret,
    });
  },
};
