"use client";

import { useCallback, useEffect, useState } from "react";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  JournalContentData,
  JournalStoryRecord,
} from "@/types/journal-content";
import { JournalDisplaySettings } from "@/components/admin/journal/JournalDisplaySettings";
import { JournalPageEditor } from "@/components/admin/journal/JournalPageEditor";
import { JournalStoriesListManager } from "@/components/admin/journal/JournalStoriesListManager";
import { JournalStoryEditor } from "@/components/admin/journal/JournalStoryEditor";
import { mergeJournalData } from "@/lib/journal/merge-journal-data";
import { pruneStorySlugs, HOMEPAGE_JOURNAL_STORY_LIMIT } from "@/lib/journal/helpers";

type JournalContentEditorProps = {
  readOnly?: boolean;
};

type Tab = "main-page" | "display" | "stories";

export function JournalContentEditor({ readOnly = false }: JournalContentEditorProps) {
  const [tab, setTab] = useState<Tab>("main-page");
  const [data, setData] = useState<JournalContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/journal");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load journal content."));
      return;
    }

    const doc = await res.json();
    setData(mergeJournalData(doc.data as Partial<JournalContentData>));
    setUpdatedAt(doc.updatedAt ?? null);
    setSelectedSlug((prev) => {
      if (prev) return prev;
      return doc.data?.stories?.[0]?.slug ?? null;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(next: JournalContentData) {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/journal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = await res.json();
    setData(mergeJournalData(doc.data as Partial<JournalContentData>));
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
  }

  function patch(partial: Partial<JournalContentData>) {
    if (!data) return;
    const next = { ...data, ...partial };
    setData(next);
    void save(next);
  }

  function patchStory(story: JournalStoryRecord, clearOtherFeatured?: boolean) {
    if (!data) return;
    const normalized: JournalStoryRecord = {
      ...story,
      published: story.published === false ? false : true,
    };
    let stories = data.stories.map((s) =>
      s.slug === normalized.slug ? normalized : s,
    );
    if (clearOtherFeatured && normalized.featured) {
      stories = stories.map((s) =>
        s.slug === normalized.slug ? s : { ...s, featured: false },
      );
    }
    const homepageStorySlugs =
      normalized.published === false
        ? data.homepageStorySlugs.filter((slug) => slug !== normalized.slug)
        : data.homepageStorySlugs;
    patch({
      stories,
      homepageStorySlugs: pruneStorySlugs(
        stories,
        homepageStorySlugs,
        HOMEPAGE_JOURNAL_STORY_LIMIT,
      ),
    });
  }

  function addStory(story: JournalStoryRecord) {
    if (!data) return;
    if (data.stories.some((s) => s.slug === story.slug)) {
      setStatus("A story with this slug already exists.");
      return;
    }
    patch({ stories: [...data.stories, story] });
    setSelectedSlug(story.slug);
    setTab("stories");
  }

  function removeStory(slug: string) {
    if (!data) return;
    patch({ stories: data.stories.filter((s) => s.slug !== slug) });
    if (selectedSlug === slug) {
      setSelectedSlug(data.stories.find((s) => s.slug !== slug)?.slug ?? null);
    }
  }

  const selected = data?.stories.find((s) => s.slug === selectedSlug);

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading journal…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("main-page")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === "main-page"
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/70"
            }`}
          >
            Journal page
          </button>
          <button
            type="button"
            onClick={() => setTab("display")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === "display"
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/70"
            }`}
          >
            Display
          </button>
          <button
            type="button"
            onClick={() => setTab("stories")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === "stories"
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/70"
            }`}
          >
            Stories
          </button>
        </div>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && <span className="text-xs text-charcoal/60">{status}</span>}
      </div>

      {tab === "main-page" && (
        <JournalPageEditor
          page={data.page}
          readOnly={readOnly}
          onSave={(page) => patch({ page: { ...data.page, ...page } })}
          onDocumentSynced={(next) => setData(mergeJournalData(next))}
          onStatus={setStatus}
        />
      )}

      {tab === "display" && (
        <JournalDisplaySettings
          stories={data.stories}
          latestStorySlugs={data.latestStorySlugs}
          homepageStorySlugs={data.homepageStorySlugs}
          latestInitialCount={data.page.latestInitialCount}
          readOnly={readOnly}
          onSave={({ latestStorySlugs, homepageStorySlugs, latestInitialCount }) =>
            patch({
              latestStorySlugs,
              homepageStorySlugs,
              page: { ...data.page, latestInitialCount },
            })
          }
        />
      )}

      {tab === "stories" && (
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <JournalStoriesListManager
            key="journal-stories-list"
            stories={data.stories}
            selectedSlug={selectedSlug}
            readOnly={readOnly}
            onSelect={setSelectedSlug}
            onAdd={addStory}
            onRemove={removeStory}
          />
          {selected ? (
            <JournalStoryEditor
              key={selected.slug}
              story={selected}
              readOnly={readOnly}
              onSave={patchStory}
              onDocumentSynced={(next) => setData(mergeJournalData(next))}
              onStatus={setStatus}
            />
          ) : (
            <p className="text-sm text-charcoal/60">
              Select a story or add a new one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
