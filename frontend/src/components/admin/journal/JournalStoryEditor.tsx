"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { JournalImageField } from "@/components/admin/journal/JournalImageField";
import {
  applyJournalStoryStatus,
  getJournalStoryStatus,
  isJournalStoryPublished,
  JOURNAL_STORY_STATUS_OPTIONS,
} from "@/lib/journal/journal-story-status";
import type {
  JournalContentData,
  JournalStoryRecord,
} from "@/types/journal-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

const CATEGORY_OPTIONS = [
  { id: "expeditions", label: "Expeditions" },
  { id: "conservation", label: "Conservation" },
  { id: "culture", label: "Culture" },
  { id: "wildlife", label: "Wildlife" },
  { id: "people", label: "People" },
  { id: "reflections", label: "Reflections" },
] as const;

type JournalStoryEditorProps = {
  story: JournalStoryRecord;
  readOnly?: boolean;
  onSave: (story: JournalStoryRecord, clearOtherFeatured?: boolean) => void;
  onDocumentSynced?: (data: JournalContentData) => void;
  onStatus: (message: string) => void;
};

export function JournalStoryEditor({
  story,
  readOnly = false,
  onSave,
  onDocumentSynced,
  onStatus,
}: JournalStoryEditorProps) {
  const [draft, setDraft] = useState(story);
  const slugRef = useRef(story.slug);

  // Only reset the form when switching to a different story (not after every save/upload).
  useEffect(() => {
    if (story.slug !== slugRef.current) {
      slugRef.current = story.slug;
      setDraft(story);
    }
  }, [story]);

  function syncFromDocument(data: JournalContentData) {
    onDocumentSynced?.(data);
    const updated = data.stories.find((s) => s.slug === slugRef.current);
    if (updated) {
      setDraft((prev) => ({
        ...prev,
        image: updated.image,
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(draft, draft.featured === true);
    onStatus("Story saved.");
    setTimeout(() => onStatus(""), 2500);
  }

  const isLive = isJournalStoryPublished(draft);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h3 className="font-serif text-2xl font-light">{draft.title}</h3>
        {isLive && (
          <Link
            href={`/journal/${draft.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-gold"
          >
            View live story →
          </Link>
        )}
      </div>

      <div className="space-y-4 rounded border border-charcoal/12 bg-beige/30 p-5">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Public status
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-charcoal/55">
            Choose one status. You can keep editing all fields below regardless
            of which is selected.
          </p>
        </div>
        <div className="space-y-3">
          {JOURNAL_STORY_STATUS_OPTIONS.map((option) => {
            const selected = getJournalStoryStatus(draft) === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer gap-3 rounded border px-4 py-3 transition-colors ${
                  selected
                    ? "border-safari-green/35 bg-ivory"
                    : "border-charcoal/10 bg-ivory/60"
                } ${readOnly ? "cursor-default" : "hover:border-charcoal/25"}`}
              >
                <input
                  type="radio"
                  name="journal-story-status"
                  className="mt-0.5 shrink-0"
                  checked={selected}
                  disabled={readOnly}
                  onChange={() =>
                    setDraft(applyJournalStoryStatus(draft, option.value))
                  }
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-charcoal">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-charcoal/50">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {!readOnly && (
          <button
            type="submit"
            className="bg-charcoal px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
          >
            Save status
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.featured === true}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({
                ...draft,
                featured: e.target.checked,
                featuredSide: e.target.checked ? false : draft.featuredSide,
              })
            }
          />
          Main featured (large hero on journal page)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.featuredSide === true}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({
                ...draft,
                featuredSide: e.target.checked,
                featured: e.target.checked ? false : draft.featured,
              })
            }
          />
          Side featured (right column)
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="URL slug">
          <input className={inputClass} value={draft.slug} disabled readOnly />
        </AdminField>
        <AdminField label="Title">
          <input
            className={inputClass}
            value={draft.title}
            disabled={readOnly}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </AdminField>
      </div>

      <AdminField label="Category">
        <select
          className={inputClass}
          value={draft.category}
          disabled={readOnly}
          onChange={(e) => {
            const opt = CATEGORY_OPTIONS.find((c) => c.id === e.target.value);
            setDraft({
              ...draft,
              category: e.target.value as JournalStoryRecord["category"],
              categoryLabel: opt?.label ?? draft.categoryLabel,
            });
          }}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </AdminField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Date display">
          <input
            className={inputClass}
            value={draft.dateDisplay}
            disabled={readOnly}
            onChange={(e) =>
              setDraft({ ...draft, dateDisplay: e.target.value })
            }
          />
        </AdminField>
        <AdminField label="Read time">
          <input
            className={inputClass}
            value={draft.readTime}
            disabled={readOnly}
            onChange={(e) => setDraft({ ...draft, readTime: e.target.value })}
          />
        </AdminField>
      </div>

      <AdminField label="Excerpt">
        <textarea
          className={textareaClass}
          rows={3}
          value={draft.excerpt}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
        />
      </AdminField>

      <AdminField label="Article body">
        <textarea
          className={textareaClass}
          rows={12}
          value={draft.body}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        />
        <p className="mt-1 text-xs text-charcoal/45">
          Separate paragraphs with a blank line. Shown on the story page.
        </p>
      </AdminField>

      <JournalImageField
        storySlug={draft.slug}
        fieldPath="image"
        label="Card & hero image"
        src={draft.image}
        alt={draft.title}
        readOnly={readOnly}
        onUploaded={(src) => setDraft({ ...draft, image: src })}
        onDocumentSynced={syncFromDocument}
        onStatus={onStatus}
      />

      {!readOnly && (
        <button
          type="submit"
          className="bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
        >
          Save story
        </button>
      )}
    </form>
  );
}
