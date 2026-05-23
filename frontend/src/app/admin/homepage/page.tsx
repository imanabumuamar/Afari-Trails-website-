"use client";

import { useEffect, useState } from "react";
import { HomepageHeroEditor } from "@/components/admin/HomepageHeroEditor";
import { HomepageImageEditor } from "@/components/admin/HomepageImageEditor";
import type { HomepageContent, HomepageHero, HomepageImageField } from "@/types/homepage";

const IMAGE_FIELDS: HomepageImageField[] = [
  "featureCards.expeditions",
  "featureCards.ventures",
  "featureCards.store",
  "ourEssence",
];

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/homepage")
      .then((res) => res.json())
      .then((data: HomepageContent) => setContent(data))
      .catch(() => setStatus("Could not load homepage content."));
  }, []);

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

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Homepage content</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          Edit the hero and section images. Changes save to{" "}
          <code className="text-xs">content/homepage.json</code> and{" "}
          <code className="text-xs">public/</code>.
        </p>
      </div>

      {content && (
        <div className="grid gap-8 md:grid-cols-2">
          <HomepageHeroEditor
            hero={content.hero}
            onHeroChange={handleHeroChange}
            onStatus={setStatus}
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

      {status && (
        <p className="text-sm text-charcoal/70" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
