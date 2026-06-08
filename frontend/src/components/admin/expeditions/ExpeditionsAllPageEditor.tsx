"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ExpeditionImageField } from "@/components/admin/expeditions/ExpeditionImageField";
import { expeditionsAllPageDefaults } from "@/lib/data/expeditions-all-page";
import type { ExpeditionsAllPageContent } from "@/lib/data/expedition-defaults";
import type { ExpeditionsContentData } from "@/types/expeditions-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type ExpeditionsAllPageEditorProps = {
  allPage?: ExpeditionsAllPageContent;
  readOnly?: boolean;
  onSave: (allPage: ExpeditionsAllPageContent) => void;
  onDocumentSynced?: (data: ExpeditionsContentData) => void;
  onStatus: (message: string) => void;
};

export function ExpeditionsAllPageEditor({
  allPage,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ExpeditionsAllPageEditorProps) {
  const resolved = allPage ?? expeditionsAllPageDefaults;
  const [draft, setDraft] = useState(resolved);

  useEffect(() => {
    setDraft(allPage ?? expeditionsAllPageDefaults);
  }, [allPage]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(draft);
  }

  return (
    <form onSubmit={handleSave} className="space-y-10">
      <p className="max-w-2xl text-sm text-charcoal/60">
        Edits the{" "}
        <a
          href="/expeditions/all"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:underline"
        >
          All journeys
        </a>{" "}
        page — hero, grid intro, and footer CTA. Region filters and expedition
        cards are managed separately (see Region filters above / All expeditions tab).
      </p>

      <div>
        <h3 className="font-serif text-2xl font-light">Hero</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.hero.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hero: { ...draft.hero, label: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.hero.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hero: { ...draft.hero, heading: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Subtext">
            <textarea
              className={textareaClass}
              rows={3}
              value={draft.hero.subtext}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hero: { ...draft.hero, subtext: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Back link text">
            <input
              className={inputClass}
              value={draft.hero.backLabel}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hero: { ...draft.hero, backLabel: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Image alt text">
            <input
              className={inputClass}
              value={draft.hero.imageAlt}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  hero: { ...draft.hero, imageAlt: e.target.value },
                })
              }
            />
          </AdminField>
          <ExpeditionImageField
            fieldPath="allPage.hero.image"
            label="Hero background"
            src={draft.hero.image}
            alt={draft.hero.imageAlt}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({ ...draft, hero: { ...draft.hero, image: src } })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-2xl font-light">Grid intro</h3>
        <p className="mt-2 text-xs text-charcoal/50">
          The published expedition count is added automatically before the
          description (e.g. &ldquo;6 handcrafted expeditions…&rdquo;).
        </p>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.gridIntro.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  gridIntro: { ...draft.gridIntro, label: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Description (after count)">
            <textarea
              className={textareaClass}
              rows={2}
              value={draft.gridIntro.description}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  gridIntro: {
                    ...draft.gridIntro,
                    description: e.target.value,
                  },
                })
              }
            />
          </AdminField>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-2xl font-light">Footer CTA</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.cta.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta: { ...draft.cta, heading: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Body">
            <textarea
              className={textareaClass}
              rows={3}
              value={draft.cta.body}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta: { ...draft.cta, body: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Button label">
            <input
              className={inputClass}
              value={draft.cta.buttonLabel}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cta: { ...draft.cta, buttonLabel: e.target.value },
                })
              }
            />
          </AdminField>
        </div>
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save All journeys page
        </button>
      )}
    </form>
  );
}
