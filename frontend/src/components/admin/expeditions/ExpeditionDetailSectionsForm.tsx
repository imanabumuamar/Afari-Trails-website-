"use client";

import { AdminField } from "@/components/admin/ventures/AdminField";
import { ExpeditionImageField } from "@/components/admin/expeditions/ExpeditionImageField";
import { DEFAULT_EXPEDITION_SECTIONS } from "@/lib/expeditions/resolve-expedition-display";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
} from "@/types/expeditions-content";
import type { ExpeditionSectionCopy } from "@/types/expedition-detail";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type ExpeditionDetailSectionsFormProps = {
  draft: ExpeditionDetailRecord;
  originalId: string;
  readOnly?: boolean;
  setDraft: React.Dispatch<React.SetStateAction<ExpeditionDetailRecord>>;
  onDocumentSynced?: (data: ExpeditionsContentData) => void;
  onStatus: (message: string) => void;
};

function sectionField<K extends keyof ExpeditionSectionCopy>({
  keyName,
  label,
  draft,
  setDraft,
  readOnly,
}: {
  keyName: K;
  label: string;
  draft: ExpeditionDetailRecord;
  setDraft: React.Dispatch<React.SetStateAction<ExpeditionDetailRecord>>;
  readOnly?: boolean;
}) {
  const value =
    draft.sections?.[keyName] ?? DEFAULT_EXPEDITION_SECTIONS[keyName];
  return (
    <AdminField label={label}>
      <input
        className={inputClass}
        value={value}
        disabled={readOnly}
        onChange={(e) =>
          setDraft({
            ...draft,
            sections: { ...draft.sections, [keyName]: e.target.value },
          })
        }
      />
    </AdminField>
  );
}

export function ExpeditionDetailSectionsForm({
  draft,
  originalId,
  readOnly = false,
  setDraft,
  onDocumentSynced,
  onStatus,
}: ExpeditionDetailSectionsFormProps) {
  const sections = { ...DEFAULT_EXPEDITION_SECTIONS, ...draft.sections };

  return (
    <div className="space-y-10 border-t border-charcoal/10 pt-10">
      <div>
        <h4 className="font-serif text-xl font-light">Hero & page labels</h4>
        <p className="mt-2 text-xs text-charcoal/50">
          Section headings and button labels used across the expedition page layout.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AdminField label="Location line (hero)">
            <input
              className={inputClass}
              value={draft.locationLabel ?? ""}
              placeholder="Zambia • South Luangwa National Park"
              disabled={readOnly}
              onChange={(e) =>
                setDraft({ ...draft, locationLabel: e.target.value })
              }
            />
          </AdminField>
          <AdminField label="Brochure URL (PDF)">
            <input
              className={inputClass}
              value={draft.brochureUrl ?? ""}
              placeholder="https://…"
              disabled={readOnly}
              onChange={(e) =>
                setDraft({ ...draft, brochureUrl: e.target.value })
              }
            />
          </AdminField>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Hero stats (optional — defaults from highlights)
          </p>
          <div className="mt-3 space-y-2">
            {(draft.heroStats ?? []).map((stat, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Label"
                  value={stat.label}
                  disabled={readOnly}
                  onChange={(e) => {
                    const heroStats = [...(draft.heroStats ?? [])];
                    heroStats[i] = { ...stat, label: e.target.value };
                    setDraft({ ...draft, heroStats });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Value"
                  value={stat.value}
                  disabled={readOnly}
                  onChange={(e) => {
                    const heroStats = [...(draft.heroStats ?? [])];
                    heroStats[i] = { ...stat, value: e.target.value };
                    setDraft({ ...draft, heroStats });
                  }}
                />
              </div>
            ))}
            {!readOnly && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-charcoal/55"
                onClick={() =>
                  setDraft({
                    ...draft,
                    heroStats: [
                      ...(draft.heroStats ?? []),
                      { label: "", value: "" },
                    ],
                  })
                }
              >
                + Add hero stat
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Section copy
        </h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["overviewLabel", "Overview label"],
              ["overviewHeading", "Overview heading"],
              ["itineraryLabel", "Itinerary label"],
              ["itineraryHeading", "Itinerary heading"],
              ["itinerarySubtext", "Itinerary subtext"],
              ["itineraryCtaLabel", "Itinerary CTA"],
              ["experiencesLabel", "Experiences label"],
              ["experiencesHeading", "Experiences heading"],
              ["galleryLabel", "Gallery label"],
              ["galleryHeading", "Gallery heading"],
              ["galleryCtaLabel", "Gallery CTA"],
              ["accommodationLabel", "Accommodation label"],
              ["mapLabel", "Map label"],
              ["mapHeading", "Map heading"],
              ["mapCtaLabel", "Map CTA"],
              ["includedLabel", "Included label"],
              ["notIncludedLabel", "Not included label"],
              ["pricingLabel", "Pricing label"],
              ["storiesLabel", "Stories label"],
              ["storiesHeading", "Stories heading"],
              ["faqLabel", "FAQ label"],
              ["faqHeading", "FAQ heading"],
              ["footerCtaHeading", "Footer CTA heading"],
              ["enquireLabel", "Enquire button"],
              ["brochureLabel", "Brochure button"],
              ["whatsappLabel", "WhatsApp button"],
            ] as const
          ).map(([key, label]) =>
            sectionField({
              keyName: key,
              label,
              draft: { ...draft, sections },
              setDraft,
              readOnly,
            }),
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Map & pricing
        </h4>
        <div className="mt-4 space-y-4">
          <ExpeditionImageField
            expeditionId={originalId}
            fieldPath="map.image"
            label="Map image"
            src={draft.map?.image ?? ""}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({
                ...draft,
                map: {
                  image: src,
                  imageAlt: draft.map?.imageAlt ?? "Route map",
                  mapsUrl: draft.map?.mapsUrl ?? "",
                },
              })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
          <AdminField label="Map alt text">
            <input
              className={inputClass}
              value={draft.map?.imageAlt ?? ""}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  map: {
                    image: draft.map?.image ?? "",
                    imageAlt: e.target.value,
                    mapsUrl: draft.map?.mapsUrl ?? "",
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="Google Maps URL">
            <input
              className={inputClass}
              value={draft.map?.mapsUrl ?? ""}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  map: {
                    image: draft.map?.image ?? "",
                    imageAlt: draft.map?.imageAlt ?? "",
                    mapsUrl: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminField label="Price amount">
              <input
                className={inputClass}
                value={draft.pricing?.amount ?? ""}
                placeholder="3,950"
                disabled={readOnly}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    pricing: {
                      amount: e.target.value,
                      currency: draft.pricing?.currency ?? "USD",
                      note: draft.pricing?.note,
                    },
                  })
                }
              />
            </AdminField>
            <AdminField label="Currency">
              <input
                className={inputClass}
                value={draft.pricing?.currency ?? "USD"}
                disabled={readOnly}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    pricing: {
                      amount: draft.pricing?.amount ?? "",
                      currency: e.target.value,
                      note: draft.pricing?.note,
                    },
                  })
                }
              />
            </AdminField>
            <AdminField label="Pricing note">
              <input
                className={inputClass}
                value={draft.pricing?.note ?? ""}
                placeholder="per person"
                disabled={readOnly}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    pricing: {
                      amount: draft.pricing?.amount ?? "",
                      currency: draft.pricing?.currency ?? "USD",
                      note: e.target.value,
                    },
                  })
                }
              />
            </AdminField>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Traveler stories
        </h4>
        <div className="mt-4 space-y-6">
          {(draft.stories ?? []).map((story, i) => (
            <div key={i} className="space-y-2 border-t border-charcoal/10 pt-4">
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Quote"
                value={story.quote}
                disabled={readOnly}
                onChange={(e) => {
                  const stories = [...(draft.stories ?? [])];
                  stories[i] = { ...story, quote: e.target.value };
                  setDraft({ ...draft, stories });
                }}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Name"
                  value={story.name}
                  disabled={readOnly}
                  onChange={(e) => {
                    const stories = [...(draft.stories ?? [])];
                    stories[i] = { ...story, name: e.target.value };
                    setDraft({ ...draft, stories });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Location"
                  value={story.location}
                  disabled={readOnly}
                  onChange={(e) => {
                    const stories = [...(draft.stories ?? [])];
                    stories[i] = { ...story, location: e.target.value };
                    setDraft({ ...draft, stories });
                  }}
                />
              </div>
              {!readOnly && (
                <button
                  type="button"
                  className="text-[10px] uppercase tracking-[0.12em] text-red-800/70"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      stories: (draft.stories ?? []).filter((_, idx) => idx !== i),
                    })
                  }
                >
                  Remove story
                </button>
              )}
            </div>
          ))}
          {!readOnly && (
            <button
              type="button"
              className="text-xs uppercase tracking-[0.2em] text-charcoal/55"
              onClick={() =>
                setDraft({
                  ...draft,
                  stories: [
                    ...(draft.stories ?? []),
                    { quote: "", name: "", location: "" },
                  ],
                })
              }
            >
              + Add traveler story
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
