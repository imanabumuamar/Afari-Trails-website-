"use client";

import { useEffect, useState } from "react";
import { AdminAuthFields } from "@/components/admin/AdminAuthFields";
import { HomepageImageEditor } from "@/components/admin/HomepageImageEditor";
import type { HomepageContent, HomepageImageField } from "@/types/homepage";

const IMAGE_FIELDS: HomepageImageField[] = [
  "featureCards.expeditions",
  "featureCards.ventures",
  "featureCards.store",
  "ourEssence",
];

export default function AdminHomepagePage() {
  const [secret, setSecret] = useState("");
  const [savedSecret, setSavedSecret] = useState("");
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

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Homepage images</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          All homepage photos are stored in{" "}
          <code className="text-xs">content/homepage.json</code> and{" "}
          <code className="text-xs">public/images/</code>. Changes appear on the
          live site after save.
        </p>
      </div>

      <AdminAuthFields
        secret={secret}
        onSecretChange={setSecret}
        onSaveSecret={() => setSavedSecret(secret)}
        hasSavedSecret={Boolean(savedSecret)}
      />

      {content && (
        <div className="grid gap-8 md:grid-cols-2">
          {IMAGE_FIELDS.map((field) => {
            const image = getImage(field);
            if (!image) return null;
            return (
              <HomepageImageEditor
                key={field}
                field={field}
                image={image}
                adminSecret={savedSecret}
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
