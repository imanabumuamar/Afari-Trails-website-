"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { JournalImageField } from "@/components/admin/journal/JournalImageField";
import type { JournalContentData, JournalPageContent } from "@/types/journal-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type JournalPageEditorProps = {
  page: JournalPageContent;
  readOnly?: boolean;
  onSave: (page: JournalPageContent) => void;
  onDocumentSynced?: (data: JournalContentData) => void;
  onStatus: (message: string) => void;
};

export function JournalPageEditor({
  page,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: JournalPageEditorProps) {
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
      className="space-y-10"
    >
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
          <JournalImageField
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
      </div>

      <div>
        <h3 className="font-serif text-2xl font-light">Newsletter</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.newsletter.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  newsletter: { ...draft.newsletter, heading: e.target.value },
                })
              }
            />
          </AdminField>
          <JournalImageField
            fieldPath="newsletter.image"
            label="Newsletter background"
            src={draft.newsletter.image}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({
                ...draft,
                newsletter: { ...draft.newsletter, image: src },
              })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-2xl font-light">Topic filters</h3>
        <p className="mt-2 text-sm text-charcoal/55">
          Labels shown in the Explore Topics bar (IDs are fixed for filtering).
        </p>
        <div className="mt-4 space-y-3">
          {draft.categories.map((cat, i) => (
            <div key={cat.id} className="grid gap-2 sm:grid-cols-2">
              <input className={inputClass} value={cat.id} disabled />
              <input
                className={inputClass}
                value={cat.label}
                disabled={readOnly}
                onChange={(e) => {
                  const categories = [...draft.categories];
                  categories[i] = { ...cat, label: e.target.value };
                  setDraft({ ...draft, categories });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save journal page text
        </button>
      )}
    </form>
  );
}
