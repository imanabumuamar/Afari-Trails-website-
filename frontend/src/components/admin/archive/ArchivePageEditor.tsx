"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ArchiveImageField } from "@/components/admin/archive/ArchiveImageField";
import type { ArchiveContentData, ArchivePageContent } from "@/types/archive-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type ArchivePageEditorProps = {
  page: ArchivePageContent;
  readOnly?: boolean;
  onSave: (page: ArchivePageContent) => void;
  onDocumentSynced?: (data: ArchiveContentData) => void;
  onStatus: (message: string) => void;
};

export function ArchivePageEditor({
  page,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ArchivePageEditorProps) {
  const [draft, setDraft] = useState(page);

  useEffect(() => {
    setDraft(page);
  }, [page]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(draft);
      }}
      className="space-y-12"
    >
      <section>
        <h3 className="font-serif text-2xl font-light">Hero</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.hero.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...draft.hero, label: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.hero.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({ ...draft, hero: { ...draft.hero, heading: e.target.value } })
              }
            />
          </AdminField>
          <AdminField label="Description">
            <textarea
              className={textareaClass}
              rows={3}
              value={draft.hero.description}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hero: { ...draft.hero, description: e.target.value },
                })
              }
            />
          </AdminField>
          <ArchiveImageField
            fieldPath="hero.image"
            label="Hero background"
            src={draft.hero.image}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({ ...draft, hero: { ...draft.hero, image: src } })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">Collections section</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.collectionsSection.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  collectionsSection: {
                    ...draft.collectionsSection,
                    label: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.collectionsSection.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  collectionsSection: {
                    ...draft.collectionsSection,
                    heading: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="View all link">
            <input
              className={inputClass}
              value={draft.collectionsSection.viewAllHref}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  collectionsSection: {
                    ...draft.collectionsSection,
                    viewAllHref: e.target.value,
                  },
                })
              }
            />
          </AdminField>
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">Afari Lens spotlight</h3>
        <div className="mt-6 space-y-4">
          {(
            [
              ["label", "Label"],
              ["heading", "Section heading"],
              ["title", "Photo title"],
              ["photographer", "Photographer"],
            ] as const
          ).map(([key, label]) => (
            <AdminField key={key} label={label}>
              <input
                className={inputClass}
                value={draft.afariLens[key]}
                disabled={readOnly}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    afariLens: { ...draft.afariLens, [key]: e.target.value },
                  })
                }
              />
            </AdminField>
          ))}
          <AdminField label="Story">
            <textarea
              className={textareaClass}
              rows={4}
              value={draft.afariLens.story}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  afariLens: { ...draft.afariLens, story: e.target.value },
                })
              }
            />
          </AdminField>
          <ArchiveImageField
            fieldPath="afariLens.image"
            label="Spotlight image"
            src={draft.afariLens.image}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({ ...draft, afariLens: { ...draft.afariLens, image: src } })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
          <AdminField label="Entries link">
            <input
              className={inputClass}
              value={draft.afariLens.entriesHref}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  afariLens: { ...draft.afariLens, entriesHref: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Editions link">
            <input
              className={inputClass}
              value={draft.afariLens.editionsHref}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  afariLens: { ...draft.afariLens, editionsHref: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Submit link">
            <input
              className={inputClass}
              value={draft.afariLens.submitHref}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  afariLens: { ...draft.afariLens, submitHref: e.target.value },
                })
              }
            />
          </AdminField>
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">Latest moments section</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.latestMomentsSection.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  latestMomentsSection: {
                    ...draft.latestMomentsSection,
                    label: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="View all link">
            <input
              className={inputClass}
              value={draft.latestMomentsSection.viewAllHref}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  latestMomentsSection: {
                    ...draft.latestMomentsSection,
                    viewAllHref: e.target.value,
                  },
                })
              }
            />
          </AdminField>
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">Submit CTA</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Quote">
            <textarea
              className={textareaClass}
              rows={2}
              value={draft.archiveSubmit.quote}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  archiveSubmit: { ...draft.archiveSubmit, quote: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Attribution">
            <input
              className={inputClass}
              value={draft.archiveSubmit.attribution}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  archiveSubmit: {
                    ...draft.archiveSubmit,
                    attribution: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="Body">
            <input
              className={inputClass}
              value={draft.archiveSubmit.body}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  archiveSubmit: { ...draft.archiveSubmit, body: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Button label">
            <input
              className={inputClass}
              value={draft.archiveSubmit.cta}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  archiveSubmit: { ...draft.archiveSubmit, cta: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Button link">
            <input
              className={inputClass}
              value={draft.archiveSubmit.href}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  archiveSubmit: { ...draft.archiveSubmit, href: e.target.value },
                })
              }
            />
          </AdminField>
        </div>
      </section>

      <section>
        <h3 className="font-serif text-2xl font-light">Submit page copy</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.submitPage.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  submitPage: { ...draft.submitPage, label: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.submitPage.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  submitPage: { ...draft.submitPage, heading: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Intro">
            <textarea
              className={textareaClass}
              rows={3}
              value={draft.submitPage.intro}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  submitPage: { ...draft.submitPage, intro: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Back link">
            <input
              className={inputClass}
              value={draft.submitPage.backHref}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  submitPage: { ...draft.submitPage, backHref: e.target.value },
                })
              }
            />
          </AdminField>
        </div>
      </section>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save page sections
        </button>
      )}
    </form>
  );
}
