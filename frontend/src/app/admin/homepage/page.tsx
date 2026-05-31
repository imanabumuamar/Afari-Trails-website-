"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { HomepageHeroEditor } from "@/components/admin/HomepageHeroEditor";
import { HomepageImageEditor } from "@/components/admin/HomepageImageEditor";
import { canWriteHomepage } from "@/lib/auth/rbac";
import { parseRole } from "@/lib/auth/roles";
import type { HomepageContent, HomepageHero, HomepageImageField } from "@/types/homepage";

const IMAGE_FIELDS: HomepageImageField[] = [
  "featureCards.expeditions",
  "featureCards.ventures",
  "featureCards.store",
  "ourEssence",
];

function isHomepageContent(data: unknown): data is HomepageContent {
  return (
    typeof data === "object" &&
    data !== null &&
    "hero" in data &&
    "featureCards" in data &&
    "ourEssence" in data
  );
}

export default function AdminHomepagePage() {
  const { data: session, status: sessionStatus } = useSession();
  const role = session?.user?.role ? parseRole(session.user.role) : null;
  const permissions = session?.user?.permissions;
  const readOnly = role ? !canWriteHomepage(role, permissions) : true;

  const [content, setContent] = useState<HomepageContent | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/admin/content/homepage");
      const data: unknown = await res.json();

      if (!res.ok) {
        const err = data as { error?: string };
        setStatus(
          err.error ??
            "Could not load homepage. Make sure the API is running (npm run dev from the website folder).",
        );
        setContent(null);
        return;
      }

      if (!isHomepageContent(data)) {
        setStatus("Invalid homepage data from server.");
        setContent(null);
        return;
      }

      setContent(data);
    } catch {
      setStatus("Could not load homepage content.");
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    void loadContent();
  }, [loadContent, sessionStatus]);

  function getImage(field: HomepageImageField) {
    if (!content) return null;
    if (field === "ourEssence") return content.ourEssence;
    const key = field.split(".")[1] as keyof HomepageContent["featureCards"];
    return content.featureCards[key];
  }

  function handleImageUpdated(field: HomepageImageField, image: { src: string; alt: string }) {
    if (!content) return;
    if (field === "ourEssence") {
      setContent({ ...content, ourEssence: image });
      return;
    }
    const key = field.split(".")[1] as keyof HomepageContent["featureCards"];
    setContent({
      ...content,
      featureCards: { ...content.featureCards, [key]: image },
    });
  }

  function handleHeroChange(hero: HomepageHero) {
    if (!content) return;
    setContent({ ...content, hero });
  }

  if (sessionStatus === "loading" || loading) {
    return <p className="text-sm text-charcoal/60">Loading homepage editor…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Homepage content</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          {readOnly
            ? "You have read-only access. Contact a super admin to request edit permissions."
            : "Edit the hero and section images. Changes are saved to MongoDB and your public site."}
        </p>
      </div>

      {content && (
        <div className="grid gap-8 md:grid-cols-2">
          <HomepageHeroEditor
            hero={content.hero}
            onHeroChange={handleHeroChange}
            onStatus={setStatus}
            readOnly={readOnly}
          />
          {IMAGE_FIELDS.map((field) => {
            const image = getImage(field);
            if (!image) return null;
            return (
              <HomepageImageEditor
                key={field}
                field={field}
                image={image}
                onUpdated={(img) => handleImageUpdated(field, img)}
                onStatus={setStatus}
                readOnly={readOnly}
              />
            );
          })}
        </div>
      )}

      {content && (
        <p className="text-xs text-charcoal/50">
          Last updated: {new Date(content.updatedAt).toLocaleString()}
        </p>
      )}

      {!content && !loading && status && (
        <div className="space-y-4">
          <p className="text-sm text-red-800/80" role="alert">
            {status}
          </p>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="text-xs uppercase tracking-[0.2em] text-gold hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {status && content && (
        <p className="text-sm text-charcoal/70" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
