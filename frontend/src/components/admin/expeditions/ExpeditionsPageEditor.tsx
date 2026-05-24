"use client";

import { useEffect, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { ExpeditionImageField } from "@/components/admin/expeditions/ExpeditionImageField";
import type { ExpeditionsPageContent } from "@/lib/data/expedition-defaults";
import type { ExpeditionsContentData } from "@/types/expeditions-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type ExpeditionsPageEditorProps = {
  page: ExpeditionsPageContent;
  readOnly?: boolean;
  onSave: (page: ExpeditionsPageContent) => void;
  onDocumentSynced?: (data: ExpeditionsContentData) => void;
  onStatus: (message: string) => void;
};

export function ExpeditionsPageEditor({
  page,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: ExpeditionsPageEditorProps) {
  const [draft, setDraft] = useState(page);

  useEffect(() => {
    setDraft(page);
  }, [page]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(draft);
  }

  return (
    <form onSubmit={handleSave} className="space-y-10">
      <div>
        <h3 className="font-serif text-2xl font-light">Hero</h3>
        <div className="mt-6 space-y-4">
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
          <ExpeditionImageField
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
        <h3 className="font-serif text-2xl font-light">Our promise</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={draft.ourPromise.label}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  ourPromise: { ...draft.ourPromise, label: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={draft.ourPromise.heading}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  ourPromise: { ...draft.ourPromise, heading: e.target.value },
                })
              }
            />
          </AdminField>
          <AdminField label="Body">
            <textarea
              className={textareaClass}
              rows={4}
              value={draft.ourPromise.body}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  ourPromise: { ...draft.ourPromise, body: e.target.value },
                })
              }
            />
          </AdminField>
          <ExpeditionImageField
            fieldPath="ourPromise.image"
            label="Side image"
            src={draft.ourPromise.image}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({
                ...draft,
                ourPromise: { ...draft.ourPromise, image: src },
              })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-2xl font-light">Closing CTA</h3>
        <div className="mt-6 space-y-4">
          <AdminField label="Quote">
            <textarea
              className={textareaClass}
              rows={2}
              value={draft.expeditionsCta.quote}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  expeditionsCta: {
                    ...draft.expeditionsCta,
                    quote: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="Ready label">
            <input
              className={inputClass}
              value={draft.expeditionsCta.readyLabel}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  expeditionsCta: {
                    ...draft.expeditionsCta,
                    readyLabel: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <AdminField label="Box text">
            <textarea
              className={textareaClass}
              rows={3}
              value={draft.expeditionsCta.boxText}
              disabled={readOnly}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  expeditionsCta: {
                    ...draft.expeditionsCta,
                    boxText: e.target.value,
                  },
                })
              }
            />
          </AdminField>
          <ExpeditionImageField
            fieldPath="expeditionsCta.image"
            label="Background image"
            src={draft.expeditionsCta.image}
            readOnly={readOnly}
            onUploaded={(src) =>
              setDraft({
                ...draft,
                expeditionsCta: { ...draft.expeditionsCta, image: src },
              })
            }
            onDocumentSynced={onDocumentSynced}
            onStatus={onStatus}
          />
        </div>
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save main page text
        </button>
      )}
    </form>
  );
}
