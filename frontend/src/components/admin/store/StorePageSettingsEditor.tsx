"use client";

import { AdminField } from "@/components/admin/ventures/AdminField";
import { StoreImageField } from "@/components/admin/store/StoreImageField";
import type { StoreContentData } from "@/types/store-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;

type StorePageSettingsEditorProps = {
  data: StoreContentData;
  readOnly?: boolean;
  setData: React.Dispatch<React.SetStateAction<StoreContentData | null>>;
  setStatus: (message: string) => void;
  onDocumentSynced: (data: StoreContentData) => void;
  onSave: (data: StoreContentData) => void;
};

export function StorePageSettingsEditor({
  data,
  readOnly = false,
  setData,
  setStatus,
  onDocumentSynced,
  onSave,
}: StorePageSettingsEditorProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(data);
      }}
      className="space-y-14"
    >
      <section>
        <h3 className="font-serif text-2xl font-light">Store page</h3>
        <p className="mt-2 text-sm text-charcoal/60">
          Choose what visitors see on the public store page.
        </p>
        <div className="mt-6 space-y-3">
          {(
            [
              {
                value: "coming-soon" as const,
                label: "Coming soon",
                description: "Hero image only, with a Coming Soon message below.",
              },
              {
                value: "live" as const,
                label: "Full store",
                description:
                  "Collections, new arrivals, and the World of Afari banner.",
              },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer gap-3 border border-charcoal/15 bg-ivory px-4 py-3 has-[:checked]:border-gold/50 has-[:checked]:bg-gold/5"
            >
              <input
                type="radio"
                name="pageMode"
                value={option.value}
                checked={data.pageMode === option.value}
                disabled={readOnly}
                className="mt-1"
                onChange={() =>
                  setData((prev) =>
                    prev ? { ...prev, pageMode: option.value } : prev,
                  )
                }
              />
              <span>
                <span className="block text-sm font-medium text-charcoal">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-charcoal/60">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">Hero</h3>
        <div className="mt-6 space-y-4">
          {(["label", "heading", "subtext"] as const).map((key) => (
            <AdminField key={key} label={key}>
              <input
                className={inputClass}
                value={data.hero[key]}
                disabled={readOnly}
                onChange={(e) =>
                  setData((prev) =>
                    prev
                      ? { ...prev, hero: { ...prev.hero, [key]: e.target.value } }
                      : prev,
                  )
                }
              />
            </AdminField>
          ))}
          <StoreImageField
            fieldPath="hero.image"
            label="Hero image"
            src={data.hero.image}
            readOnly={readOnly}
            onStatus={setStatus}
            onDocumentSynced={onDocumentSynced}
            onUploaded={(src) =>
              setData((prev) =>
                prev ? { ...prev, hero: { ...prev.hero, image: src } } : prev,
              )
            }
          />
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">The World of Afari</h3>
        <div className="mt-6 space-y-4">
          {(
            [
              ["bandLabel", "Band label"],
              ["quote", "Quote"],
              ["attribution", "Attribution"],
              ["body", "Body"],
              ["cta", "CTA label"],
              ["ctaHref", "CTA link"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label}>
              {key === "body" ? (
                <textarea
                  className={textareaClass}
                  value={data.worldOfAfari[key]}
                  disabled={readOnly}
                  onChange={(e) =>
                    setData((prev) =>
                      prev
                        ? {
                            ...prev,
                            worldOfAfari: {
                              ...prev.worldOfAfari,
                              [key]: e.target.value,
                            },
                          }
                        : prev,
                    )
                  }
                />
              ) : (
                <input
                  className={inputClass}
                  value={data.worldOfAfari[key]}
                  disabled={readOnly}
                  onChange={(e) =>
                    setData((prev) =>
                      prev
                        ? {
                            ...prev,
                            worldOfAfari: {
                              ...prev.worldOfAfari,
                              [key]: e.target.value,
                            },
                          }
                        : prev,
                    )
                  }
                />
              )}
            </AdminField>
          ))}
          <StoreImageField
            fieldPath="worldOfAfari.image"
            label="Banner image"
            src={data.worldOfAfari.image}
            readOnly={readOnly}
            onStatus={setStatus}
            onDocumentSynced={onDocumentSynced}
            onUploaded={(src) =>
              setData((prev) =>
                prev
                  ? {
                      ...prev,
                      worldOfAfari: { ...prev.worldOfAfari, image: src },
                    }
                  : prev,
              )
            }
          />
        </div>
      </section>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save page
        </button>
      )}
    </form>
  );
}
