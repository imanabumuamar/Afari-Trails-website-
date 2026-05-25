"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import type {
  FaqItem,
  FaqPageContent,
  PolicyPageContent,
  SupportContentData,
  SupportRelatedLink,
  SupportSection,
} from "@/types/support-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;

type Tab = "faq" | "shipping" | "returns";

const TABS: { id: Tab; label: string; preview: string }[] = [
  { id: "faq", label: "FAQ", preview: "/faq" },
  { id: "shipping", label: "Shipping", preview: "/shipping" },
  { id: "returns", label: "Returns", preview: "/returns" },
];

type SupportContentEditorProps = {
  readOnly?: boolean;
};

export function SupportContentEditor({ readOnly = false }: SupportContentEditorProps) {
  const [tab, setTab] = useState<Tab>("faq");
  const [data, setData] = useState<SupportContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/support");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load support content."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as SupportContentData);
    setUpdatedAt(doc.updatedAt ?? null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(next: SupportContentData) {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/support", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Save failed."));
      return;
    }

    const doc = await res.json();
    setData(doc.data as SupportContentData);
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 2500);
  }

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading support pages…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  const activePreview = TABS.find((t) => t.id === tab)?.preview ?? "/faq";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <Link
          href={activePreview}
          target="_blank"
          className="text-xs uppercase tracking-[0.2em] text-charcoal/55 hover:text-gold"
        >
          View live page →
        </Link>
        {updatedAt && (
          <span className="text-xs text-charcoal/45">
            Last saved {new Date(updatedAt).toLocaleString()}
          </span>
        )}
        {status && <span className="text-xs text-charcoal/60">{status}</span>}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-charcoal/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === t.id
                ? "bg-charcoal text-ivory"
                : "border border-charcoal/20 text-charcoal/60 hover:border-charcoal/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save(data);
        }}
        className="space-y-10"
      >
        {tab === "faq" && (
          <FaqEditor
            page={data.faq}
            readOnly={readOnly}
            onChange={(faq) => setData({ ...data, faq })}
          />
        )}
        {tab === "shipping" && (
          <PolicyEditor
            page={data.shipping}
            readOnly={readOnly}
            onChange={(shipping) => setData({ ...data, shipping })}
          />
        )}
        {tab === "returns" && (
          <PolicyEditor
            page={data.returns}
            readOnly={readOnly}
            onChange={(returns) => setData({ ...data, returns })}
          />
        )}

        {!readOnly && (
          <button
            type="submit"
            className="bg-charcoal px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
          >
            Save all support pages
          </button>
        )}
      </form>
    </div>
  );
}

function PageHeaderFields({
  page,
  readOnly,
  onChange,
}: {
  page: FaqPageContent | PolicyPageContent;
  readOnly: boolean;
  onChange: (patch: Partial<FaqPageContent | PolicyPageContent>) => void;
}) {
  return (
    <div className="space-y-4">
      {(["label", "title"] as const).map((key) => (
        <AdminField key={key} label={key}>
          <input
            className={inputClass}
            value={page[key]}
            disabled={readOnly}
            onChange={(e) => onChange({ [key]: e.target.value })}
          />
        </AdminField>
      ))}
      <AdminField label="Intro">
        <textarea
          className={textareaClass}
          value={page.intro}
          disabled={readOnly}
          onChange={(e) => onChange({ intro: e.target.value })}
        />
      </AdminField>
    </div>
  );
}

function FaqEditor({
  page,
  readOnly,
  onChange,
}: {
  page: FaqPageContent;
  readOnly: boolean;
  onChange: (faq: FaqPageContent) => void;
}) {
  function updateItem(index: number, patch: Partial<FaqItem>) {
    const items = [...page.items];
    items[index] = { ...items[index], ...patch };
    onChange({ ...page, items });
  }

  return (
    <div className="space-y-10">
      <PageHeaderFields
        page={page}
        readOnly={readOnly}
        onChange={(patch) => onChange({ ...page, ...patch })}
      />

      <div className="flex justify-between gap-4">
        <h3 className="font-serif text-xl font-light">Questions</h3>
        {!readOnly && (
          <button
            type="button"
            className="border border-charcoal/25 px-3 py-1.5 text-xs uppercase tracking-[0.2em]"
            onClick={() =>
              onChange({
                ...page,
                items: [
                  ...page.items,
                  { question: "New question", answer: "" },
                ],
              })
            }
          >
            + Add question
          </button>
        )}
      </div>

      {page.items.map((item, index) => (
        <div key={index} className="space-y-3 border border-charcoal/15 p-5">
          <div className="flex justify-between">
            <span className="text-xs text-charcoal/45">#{index + 1}</span>
            {!readOnly && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-red-900/70"
                onClick={() =>
                  onChange({
                    ...page,
                    items: page.items.filter((_, i) => i !== index),
                  })
                }
              >
                Remove
              </button>
            )}
          </div>
          <AdminField label="Question">
            <input
              className={inputClass}
              value={item.question}
              disabled={readOnly}
              onChange={(e) => updateItem(index, { question: e.target.value })}
            />
          </AdminField>
          <AdminField label="Answer">
            <textarea
              className={textareaClass}
              value={item.answer}
              disabled={readOnly}
              onChange={(e) => updateItem(index, { answer: e.target.value })}
            />
          </AdminField>
        </div>
      ))}

      <RelatedLinksEditor
        links={page.relatedLinks}
        readOnly={readOnly}
        onChange={(relatedLinks) => onChange({ ...page, relatedLinks })}
      />
    </div>
  );
}

function PolicyEditor({
  page,
  readOnly,
  onChange,
}: {
  page: PolicyPageContent;
  readOnly: boolean;
  onChange: (page: PolicyPageContent) => void;
}) {
  function updateSection(index: number, patch: Partial<SupportSection>) {
    const sections = [...page.sections];
    sections[index] = { ...sections[index], ...patch };
    onChange({ ...page, sections });
  }

  return (
    <div className="space-y-10">
      <PageHeaderFields
        page={page}
        readOnly={readOnly}
        onChange={(patch) => onChange({ ...page, ...patch })}
      />

      <div className="flex justify-between gap-4">
        <h3 className="font-serif text-xl font-light">Sections</h3>
        {!readOnly && (
          <button
            type="button"
            className="border border-charcoal/25 px-3 py-1.5 text-xs uppercase tracking-[0.2em]"
            onClick={() =>
              onChange({
                ...page,
                sections: [
                  ...page.sections,
                  { heading: "New section", paragraphs: [""] },
                ],
              })
            }
          >
            + Add section
          </button>
        )}
      </div>

      {page.sections.map((section, index) => (
        <div key={index} className="space-y-3 border border-charcoal/15 p-5">
          <div className="flex justify-between">
            <span className="text-xs text-charcoal/45">Section {index + 1}</span>
            {!readOnly && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-red-900/70"
                onClick={() =>
                  onChange({
                    ...page,
                    sections: page.sections.filter((_, i) => i !== index),
                  })
                }
              >
                Remove
              </button>
            )}
          </div>
          <AdminField label="Heading">
            <input
              className={inputClass}
              value={section.heading}
              disabled={readOnly}
              onChange={(e) => updateSection(index, { heading: e.target.value })}
            />
          </AdminField>
          <AdminField label="Paragraphs (one per line)">
            <textarea
              className={textareaClass}
              value={section.paragraphs.join("\n")}
              disabled={readOnly}
              onChange={(e) =>
                updateSection(index, {
                  paragraphs: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </AdminField>
        </div>
      ))}

      <RelatedLinksEditor
        links={page.relatedLinks}
        readOnly={readOnly}
        onChange={(relatedLinks) => onChange({ ...page, relatedLinks })}
      />
    </div>
  );
}

function RelatedLinksEditor({
  links,
  readOnly,
  onChange,
}: {
  links: SupportRelatedLink[];
  readOnly: boolean;
  onChange: (links: SupportRelatedLink[]) => void;
}) {
  return (
    <div className="space-y-4 border-t border-charcoal/10 pt-8">
      <h3 className="font-serif text-xl font-light">Footer links</h3>
      {links.map((link, index) => (
        <div key={index} className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Label">
            <input
              className={inputClass}
              value={link.label}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...links];
                next[index] = { ...next[index], label: e.target.value };
                onChange(next);
              }}
            />
          </AdminField>
          <AdminField label="URL path">
            <input
              className={inputClass}
              value={link.href}
              disabled={readOnly}
              onChange={(e) => {
                const next = [...links];
                next[index] = { ...next[index], href: e.target.value };
                onChange(next);
              }}
            />
          </AdminField>
        </div>
      ))}
    </div>
  );
}
