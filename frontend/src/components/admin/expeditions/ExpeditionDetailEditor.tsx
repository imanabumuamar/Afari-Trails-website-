"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ExpeditionImageField } from "@/components/admin/expeditions/ExpeditionImageField";
import { slugifyExpeditionId } from "@/lib/expeditions/expedition-slug";
import type { ExpeditionRegion } from "@/lib/data/expeditions-all-page";
import type {
  ExpeditionDetailRecord,
  ExpeditionsContentData,
} from "@/types/expeditions-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type ExpeditionDetailEditorProps = {
  expedition: ExpeditionDetailRecord;
  /** Stable id from CMS until save (used for image uploads while slug is being edited). */
  originalId: string;
  allIds: string[];
  regions: ExpeditionRegion[];
  readOnly?: boolean;
  onSave: (expedition: ExpeditionDetailRecord) => void | Promise<void>;
  onDocumentSynced?: (data: ExpeditionsContentData) => void;
  onStatus: (message: string) => void;
};

export function ExpeditionDetailEditor({
  expedition,
  originalId,
  allIds,
  regions,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ExpeditionDetailEditorProps) {
  const [draft, setDraft] = useState(expedition);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(expedition);
  }, [expedition]);

  function syncFromDocument(data: ExpeditionsContentData) {
    onDocumentSynced?.(data);
    const updated = data.expeditions.find(
      (e) => e.id === draft.id || e.id === originalId,
    );
    if (updated) setDraft(updated);
  }

  async function handleStructuredSave(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugifyExpeditionId(draft.id);
    if (!slug) {
      onStatus("URL slug cannot be empty.");
      return;
    }
    await onSave({ ...draft, id: slug });
  }

  function openJsonMode() {
    setJsonText(JSON.stringify(draft, null, 2));
    setJsonError(null);
    setJsonMode(true);
  }

  function saveJson(e: React.FormEvent) {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonText) as ExpeditionDetailRecord;
      if (!parsed.id || typeof parsed.id !== "string") {
        setJsonError("Expedition must have an id string.");
        return;
      }
      setJsonError(null);
      const slug = slugifyExpeditionId(parsed.id);
      const normalized = { ...parsed, id: slug };
      setDraft(normalized);
      void onSave(normalized);
      setJsonMode(false);
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  if (jsonMode) {
    return (
      <form onSubmit={saveJson} className="space-y-4">
        <p className="text-sm text-charcoal/60">
          Edit the full expedition object as JSON. Be careful with syntax.
        </p>
        <textarea
          className={`${textareaClass} min-h-[480px] font-mono text-xs`}
          value={jsonText}
          disabled={readOnly}
          onChange={(e) => setJsonText(e.target.value)}
        />
        {jsonError && <p className="text-sm text-red-800">{jsonError}</p>}
        <div className="flex gap-3">
          {!readOnly && (
            <button
              type="submit"
              className="bg-charcoal px-6 py-3 text-xs uppercase tracking-[0.2em] text-ivory"
            >
              Save JSON
            </button>
          )}
          <button
            type="button"
            className="border border-charcoal/20 px-6 py-3 text-xs uppercase tracking-[0.2em]"
            onClick={() => setJsonMode(false)}
          >
            Back to form
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleStructuredSave} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-serif text-2xl font-light">{draft.name}</h3>
        <button
          type="button"
          className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-charcoal"
          onClick={openJsonMode}
        >
          Edit as JSON →
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.published !== false}
          disabled={readOnly}
          onChange={(e) =>
            setDraft({ ...draft, published: e.target.checked })
          }
        />
        Published (show in View All expeditions)
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="URL slug">
          <input
            className={inputClass}
            value={draft.id}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, id: slugifyExpeditionId(e.target.value) })
            }
          />
          <p className="mt-1 text-xs text-charcoal/45">
            Page URL: /expeditions/{draft.id || "…"}
            {draft.id !== originalId && (
              <span className="text-gold-muted">
                {" "}
                · saves as rename from &ldquo;{originalId}&rdquo;
              </span>
            )}
          </p>
        </AdminField>
        <AdminField label="Short name">
          <input
            className={inputClass}
            value={draft.name}
            disabled={readOnly}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </AdminField>
      </div>

      <AdminField label="Region (All journeys filter)">
        <select
          className={inputClass}
          value={
            regions.some((r) => r.id === draft.regionId)
              ? (draft.regionId ?? "")
              : (regions.find((r) => r.id !== "all")?.id ?? "")
          }
          disabled={readOnly || regions.filter((r) => r.id !== "all").length === 0}
          onChange={(e) =>
            setDraft({ ...draft, regionId: e.target.value })
          }
        >
          {regions
            .filter((r) => r.id !== "all")
            .map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
        </select>
        <p className="mt-1 text-xs text-charcoal/45">
          Controls which region filter shows this expedition on{" "}
          <code className="text-charcoal">/expeditions/all</code>.
        </p>
      </AdminField>

      <AdminField label="Page title">
        <input
          className={inputClass}
          value={draft.title}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </AdminField>
      <AdminField label="Tagline">
        <input
          className={inputClass}
          value={draft.tagline}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
        />
      </AdminField>
      <AdminField label="Meta description (SEO)">
        <textarea
          className={textareaClass}
          rows={2}
          value={draft.metaDescription}
          disabled={readOnly}
          onChange={(e) =>
            setDraft({ ...draft, metaDescription: e.target.value })
          }
        />
      </AdminField>

      <ExpeditionImageField
        expeditionId={originalId}
        fieldPath="heroImage"
        label="Hero image"
        src={draft.heroImage}
        readOnly={readOnly}
        onUploaded={(src) => setDraft({ ...draft, heroImage: src })}
        onDocumentSynced={syncFromDocument}
        onStatus={onStatus}
      />

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Intro
        </h4>
        <div className="mt-4 space-y-4">
          <AdminField label="Statement">
            <textarea
              className={textareaClass}
              rows={2}
              value={draft.intro.statement}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  intro: { ...draft.intro, statement: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Body">
            <textarea
              className={textareaClass}
              rows={5}
              value={draft.intro.body}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  intro: { ...draft.intro, body: e.target.value },
                })
              }
            />
          </AdminField>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Highlights
        </h4>
        <div className="mt-4 space-y-3">
          {draft.highlights.map((h, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <input
                className={inputClass}
                placeholder="Label"
                value={h.label}
                disabled={readOnly}
                onChange={(e) => {
                  const highlights = [...draft.highlights];
                  highlights[i] = { ...h, label: e.target.value };
                  setDraft({ ...draft, highlights });
                }}
              />
              <input
                className={inputClass}
                placeholder="Value"
                value={h.value}
                disabled={readOnly}
                onChange={(e) => {
                  const highlights = [...draft.highlights];
                  highlights[i] = { ...h, value: e.target.value };
                  setDraft({ ...draft, highlights });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Visual strip
        </h4>
        <div className="mt-4 space-y-6">
          {draft.visualStrip.map((frame, i) => (
            <div key={i} className="rounded border border-charcoal/10 p-4">
              <p className="mb-3 text-xs text-charcoal/45">Image {i + 1}</p>
              <ExpeditionImageField
                expeditionId={originalId}
                fieldPath={`visualStrip.${i}.src`}
                label={`Strip image ${i + 1}`}
                src={frame.src}
                alt={frame.alt}
                readOnly={readOnly}
                onUploaded={(src) => {
                  const visualStrip = [...draft.visualStrip];
                  visualStrip[i] = { ...frame, src };
                  setDraft({ ...draft, visualStrip });
                }}
                onDocumentSynced={syncFromDocument}
                onStatus={onStatus}
              />
              <AdminField label="Alt text">
                <input
                  className={inputClass}
                  value={frame.alt}
                  disabled={readOnly}
                  onChange={(e) => {
                    const visualStrip = [...draft.visualStrip];
                    visualStrip[i] = { ...frame, alt: e.target.value };
                    setDraft({ ...draft, visualStrip });
                  }}
                />
              </AdminField>
            </div>
          ))}
          {!readOnly && (
            <button
              type="button"
              className="text-xs uppercase tracking-[0.2em] text-charcoal/55"
              onClick={() =>
                setDraft({
                  ...draft,
                  visualStrip: [
                    ...draft.visualStrip,
                    { src: "", alt: "" },
                  ],
                })
              }
            >
              + Add strip image
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Itinerary days
        </h4>
        <div className="mt-4 space-y-6">
          {draft.itinerary.map((day, i) => (
            <div key={i} className="space-y-2 border-t border-charcoal/10 pt-4">
              <p className="text-xs text-charcoal/45">Day {day.day}</p>
              <input
                className={inputClass}
                placeholder="Title"
                value={day.title}
                disabled={readOnly}
                onChange={(e) => {
                  const itinerary = [...draft.itinerary];
                  itinerary[i] = { ...day, title: e.target.value };
                  setDraft({ ...draft, itinerary });
                }}
              />
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="Description"
                value={day.description}
                disabled={readOnly}
                onChange={(e) => {
                  const itinerary = [...draft.itinerary];
                  itinerary[i] = { ...day, description: e.target.value };
                  setDraft({ ...draft, itinerary });
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
                  itinerary: [
                    ...draft.itinerary,
                    {
                      day: draft.itinerary.length + 1,
                      title: "",
                      description: "",
                    },
                  ],
                })
              }
            >
              + Add day
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Accommodation
        </h4>
        <div className="mt-4 space-y-4">
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.accommodation.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  accommodation: {
                    ...draft.accommodation,
                    heading: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="Body">
            <textarea
              className={textareaClass}
              rows={4}
              value={draft.accommodation.body}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  accommodation: {
                    ...draft.accommodation,
                    body: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <ExpeditionImageField
            expeditionId={originalId}
            fieldPath="accommodation.image"
            label="Accommodation image"
            src={draft.accommodation.image}
            alt={draft.accommodation.imageAlt}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({
                ...draft,
                accommodation: { ...draft.accommodation, image: src },
              })
            }
            onDocumentSynced={syncFromDocument}
            onStatus={onStatus}
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Experiences
        </h4>
        <div className="mt-4 space-y-8">
          {draft.experiences.map((exp, i) => (
            <div key={i} className="space-y-4 border-t border-charcoal/10 pt-6">
              <p className="text-xs font-medium text-charcoal/50">
                Experience {i + 1}
              </p>
              <AdminField label="Title">
                <input
                  className={inputClass}
                  value={exp.title}
                  disabled={readOnly}
                  onChange={(e) => {
                    const experiences = [...draft.experiences];
                    experiences[i] = { ...exp, title: e.target.value };
                    setDraft({ ...draft, experiences });
                  }}
                />
              </AdminField>
              <ExpeditionImageField
                expeditionId={originalId}
                fieldPath={`experiences.${i}.image`}
                label="Experience image"
                src={exp.image}
                alt={exp.imageAlt}
                readOnly={readOnly}
                onUploaded={(src) => {
                  const experiences = [...draft.experiences];
                  experiences[i] = { ...exp, image: src };
                  setDraft({ ...draft, experiences });
                }}
                onDocumentSynced={syncFromDocument}
                onStatus={onStatus}
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
                  experiences: [
                    ...draft.experiences,
                    {
                      title: "",
                      body: "",
                      image: "",
                      imageAlt: "",
                    },
                  ],
                })
              }
            >
              + Add experience
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Gallery
        </h4>
        <div className="mt-4 space-y-6">
          {draft.gallery.map((frame, i) => (
            <div key={i} className="rounded border border-charcoal/10 p-4">
              <ExpeditionImageField
                expeditionId={originalId}
                fieldPath={`gallery.${i}.src`}
                label={`Gallery image ${i + 1}`}
                src={frame.src}
                alt={frame.alt}
                readOnly={readOnly}
                onUploaded={(src) => {
                  const gallery = [...draft.gallery];
                  gallery[i] = { ...frame, src };
                  setDraft({ ...draft, gallery });
                }}
                onDocumentSynced={syncFromDocument}
                onStatus={onStatus}
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
                  gallery: [...draft.gallery, { src: "", alt: "" }],
                })
              }
            >
              + Add gallery image
            </button>
          )}
        </div>
      </div>

      <AdminField label="Related expedition IDs (comma-separated)">
        <input
          className={inputClass}
          value={draft.relatedIds.join(", ")}
          disabled={readOnly}
          onChange={(e) =>
            setDraft({
              ...draft,
              relatedIds: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .filter((id) => allIds.includes(id) || id === draft.id),
            })
          }
        />
        <p className="mt-1 text-xs text-charcoal/45">
          Available: {allIds.join(", ")}
        </p>
      </AdminField>

      <AdminField label="Closing quote">
        <input
          className={inputClass}
          value={draft.closingQuote}
          disabled={readOnly}
          onChange={(e) =>
            setDraft({ ...draft, closingQuote: e.target.value })
          }
        />
      </AdminField>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save expedition text
        </button>
      )}
    </form>
  );
}
