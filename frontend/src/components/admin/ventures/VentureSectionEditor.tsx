"use client";

import { useEffect, useState } from "react";
import type { VentureSlug } from "@/lib/data/venture-defaults";
import { venturesConnectConfig } from "@/lib/data/connect-ventures";
import type { VentureSectionConfig } from "@/types/venture-admin";
import {
  AdminField,
  AddRemoveButtons,
  inputClass,
  SaveButton,
  textareaClass,
} from "@/components/admin/ventures/AdminField";
import { VentureImageField } from "@/components/admin/ventures/VentureImageField";
import { ArchiveStoryPicker } from "@/components/admin/ventures/ArchiveStoryPicker";

type VentureSectionEditorProps = {
  slug: VentureSlug;
  section: VentureSectionConfig;
  data: unknown;
  onSave: (value: unknown) => Promise<void>;
  onStatus: (message: string) => void;
  readOnly?: boolean;
};

const FOCUS_ICONS = ["lodge", "leaf", "people", "crop", "home"] as const;

const SUB_HERO_FIELDS = [
  "label",
  "heading",
  "subheading",
  "intro",
  "exploreCta",
  "exploreHref",
  "partnerCta",
  "partnerHref",
  "cta",
  "imageAlt",
] as const;

const TEXT_BLOCK_FIELDS = [
  "label",
  "statement",
  "heading",
  "body",
  "approachHref",
] as const;

function fp(sectionKey: string, ...parts: (string | number)[]): string {
  return [sectionKey, ...parts.map(String)].join(".");
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBool(value: unknown): boolean {
  return value === true;
}

function initializeDraft(type: VentureSectionConfig["type"], data: unknown): unknown {
  switch (type) {
    case "main-hero":
      return {
        title: asString(asRecord(data).title),
        tagline: asString(asRecord(data).tagline),
        intro: asString(asRecord(data).intro),
        image: asString(asRecord(data).image),
      };
    case "mission-block": {
      const d = asRecord(data);
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        body: asString(d.body),
        approachHref: asString(d.approachHref),
        image: asString(d.image),
      };
    }
    case "stats-bar": {
      const arr = Array.isArray(data) ? data : [];
      const items = arr.map((item) => {
        const r = asRecord(item);
        return { value: asString(r.value), label: asString(r.label) };
      });
      return items.length > 0 ? items : [{ value: "", label: "" }];
    }
    case "focus-cards": {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length === 0) {
        return [
          {
            id: "",
            title: "",
            description: "",
            image: "",
            icon: "lodge",
            href: "",
          },
        ];
      }
      return arr.map((item) => {
        const r = asRecord(item);
        const icon = asString(r.icon);
        return {
          id: asString(r.id),
          title: asString(r.title),
          description: asString(r.description),
          image: asString(r.image),
          icon: FOCUS_ICONS.includes(icon as (typeof FOCUS_ICONS)[number])
            ? icon
            : "lodge",
          href: asString(r.href),
        };
      });
    }
    case "section-header": {
      const d = asRecord(data);
      return { label: asString(d.label), intro: asString(d.intro) };
    }
    case "project-list": {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length === 0) {
        return [{ id: "", title: "", status: "", category: "", href: "" }];
      }
      return arr.map((item) => {
        const r = asRecord(item);
        const row: Record<string, unknown> = {
          id: asString(r.id),
          title: asString(r.title),
          status: asString(r.status),
          category: asString(r.category),
          href: asString(r.href),
        };
        if ("featured" in r) row.featured = asBool(r.featured);
        return row;
      });
    }
    case "featured-project": {
      const d = asRecord(data);
      return {
        label: asString(d.label || d.sectionLabel),
        title: asString(d.title),
        description: asString(d.description),
        status: asString(d.status),
        image: asString(d.image),
        href: asString(d.href),
        ctaLabel: asString(d.ctaLabel || "View Project →"),
      };
    }
    case "cta-banner": {
      const d = asRecord(data);
      return {
        quote: asString(d.quote),
        heading: asString(d.heading),
        body: asString(d.body),
        image: asString(d.image),
        ctaLabel: asString(d.ctaLabel || "Get In Touch →"),
        ctaHref: asString(d.ctaHref || "/ventures/connect"),
      };
    }
    case "sub-hero": {
      const d = asRecord(data);
      const base: Record<string, string> = {
        label: asString(d.label),
        heading: asString(d.heading),
        image: asString(d.image),
      };
      for (const key of SUB_HERO_FIELDS) {
        if (key in d && key !== "label" && key !== "heading") {
          base[key] = asString(d[key]);
        }
      }
      if (d.exploreCta || base.exploreCta) {
        base.exploreCta = asString(d.exploreCta || base.exploreCta);
        base.exploreHref = asString(d.exploreHref || base.exploreHref || "#who-we-are");
      }
      if (d.partnerCta || base.partnerCta) {
        base.partnerCta = asString(d.partnerCta || base.partnerCta);
        base.partnerHref = asString(
          d.partnerHref || base.partnerHref || "/ventures/partner",
        );
      }
      return base;
    }
    case "text-block": {
      const d = asRecord(data);
      const base: Record<string, string> = {};
      for (const key of TEXT_BLOCK_FIELDS) {
        if (key in d) base[key] = asString(d[key]);
      }
      if (Object.keys(base).length === 0) {
        return { label: "", body: "" };
      }
      return base;
    }
    case "philosophy-block": {
      const d = asRecord(data);
      const base: Record<string, unknown> = {
        label: asString(d.label),
        statement: asString(d.statement),
        body: asString(d.body),
        partnerCta: asString(d.partnerCta),
        deckCta: asString(d.deckCta),
        partnerHref: asString(d.partnerHref || "/ventures/partner"),
        deckHref: asString(d.deckHref || "/ventures/connect"),
        image: asString(d.image),
        imageAlt: asString(d.imageAlt),
        themes: Array.isArray(d.themes)
          ? d.themes.map((t) => asString(t))
          : [],
      };
      return base;
    }
    case "service-grid": {
      const d = asRecord(data);
      const items = Array.isArray(d.items) ? d.items : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        intro: asString(d.intro),
        items:
          items.length > 0
            ? items.map((item) => {
                const r = asRecord(item);
                return {
                  id: asString(r.id),
                  title: asString(r.title),
                  description: asString(r.description),
                };
              })
            : [{ id: "", title: "", description: "" }],
      };
    }
    case "focus-items": {
      const d = asRecord(data);
      const items = Array.isArray(d.items) ? d.items : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        intro: asString(d.intro),
        items:
          items.length > 0
            ? items.map((item) => {
                const r = asRecord(item);
                return {
                  id: asString(r.id),
                  title: asString(r.title),
                  description: asString(r.description),
                  image: asString(r.image),
                };
              })
            : [{ id: "", title: "", description: "", image: "" }],
      };
    }
    case "experience-grid": {
      const d = asRecord(data);
      const items = Array.isArray(d.items) ? d.items : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        intro: asString(d.intro),
        items:
          items.length > 0
            ? items.map((item) => {
                const r = asRecord(item);
                return {
                  id: asString(r.id),
                  title: asString(r.title),
                  image: asString(r.image),
                };
              })
            : [{ id: "", title: "", image: "" }],
      };
    }
    case "community-stories": {
      const d = asRecord(data);
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        intro: asString(d.intro),
        archiveIds: Array.isArray(d.archiveIds)
          ? d.archiveIds.map((x) => asString(x)).filter(Boolean)
          : [],
      };
    }
    case "string-list-block": {
      const d = asRecord(data);
      const items = Array.isArray(d.items) ? d.items.map((x) => asString(x)) : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        intro: asString(d.intro),
        items: items.length > 0 ? items : [""],
      };
    }
    case "craftsmanship-block": {
      const d = asRecord(data);
      const rawImages = Array.isArray(d.images)
        ? d.images
        : Array.isArray(d.moodboard)
          ? d.moodboard
          : [];
      const images = rawImages.map((item) => {
        const r = asRecord(item);
        return { src: asString(r.src), alt: asString(r.alt) };
      });
      while (images.length < 3) images.push({ src: "", alt: "" });
      const highlights = Array.isArray(d.highlights)
        ? d.highlights.map((x) => asString(x))
        : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        body: asString(d.body),
        highlights: highlights.length > 0 ? highlights : [""],
        images: images.slice(0, 3),
      };
    }
    case "design-moodboard": {
      const d = asRecord(data);
      const moodboard = Array.isArray(d.moodboard) ? d.moodboard : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        body: asString(d.body),
        moodboard:
          moodboard.length > 0
            ? moodboard.map((item) => {
                const r = asRecord(item);
                return { src: asString(r.src), alt: asString(r.alt) };
              })
            : [{ src: "", alt: "" }],
      };
    }
    case "pillars-block": {
      const d = asRecord(data);
      const pillars = Array.isArray(d.pillars) ? d.pillars : [];
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        intro: asString(d.intro),
        pillars:
          pillars.length > 0
            ? pillars.map((item) => {
                const r = asRecord(item);
                return {
                  title: asString(r.title),
                  description: asString(r.description),
                };
              })
            : [{ title: "", description: "" }],
      };
    }
    case "image-gallery": {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length === 0) return [{ src: "", alt: "" }];
      return arr.map((item) => {
        const r = asRecord(item);
        return { src: asString(r.src), alt: asString(r.alt) };
      });
    }
    case "quote-block": {
      const d = asRecord(data);
      const base: Record<string, unknown> = { quote: asString(d.quote) };
      if ("label" in d) base.label = asString(d.label);
      if ("themes" in d) {
        base.themes = Array.isArray(d.themes)
          ? d.themes.map((t) => asString(t))
          : [];
      }
      return base;
    }
    case "location-block": {
      const d = asRecord(data);
      return {
        label: asString(d.label),
        heading: asString(d.heading),
        body: asString(d.body),
        image: asString(d.image),
        imageAlt: asString(d.imageAlt),
      };
    }
    case "partner-cta": {
      const d = asRecord(data);
      return {
        heading: asString(d.heading),
        body: asString(d.body),
        cta: asString(d.cta),
        secondaryCta: asString(d.secondaryCta),
        ctaHref: asString(d.ctaHref || "/ventures/connect"),
        secondaryCtaHref: asString(d.secondaryCtaHref || "/ventures/partner"),
        image: asString(d.image),
      };
    }
    case "card-list": {
      const arr = Array.isArray(data) ? data : [];
      if (arr.length === 0) {
        return [{ id: "", title: "", description: "", image: "" }];
      }
      return arr.map((item) => {
        const r = asRecord(item);
        return {
          id: asString(r.id),
          title: asString(r.title),
          description: asString(r.description),
          image: asString(r.image),
        };
      });
    }
    case "connect-page": {
      const d = asRecord(data);
      const hero = asRecord(d.hero);
      const intro = asRecord(d.intro);
      const form = asRecord(d.form);
      return {
        ...d,
        hero: {
          label: asString(hero.label),
          heading: asString(hero.heading),
          subheading: asString(hero.subheading),
          cta: asString(hero.cta),
          image: asString(hero.image),
          imageAlt: asString(hero.imageAlt),
        },
        intro: {
          label: asString(intro.label),
          statement: asString(intro.statement),
          body: asString(intro.body),
        },
        form: {
          label: asString(form.label),
          heading: asString(form.heading),
          subtext: asString(form.subtext),
          submitLabel: asString(form.submitLabel),
          successMessage: asString(form.successMessage),
          inquiryOptions:
            Array.isArray(form.inquiryOptions) && form.inquiryOptions.length > 0
              ? form.inquiryOptions
              : [...venturesConnectConfig.form.inquiryOptions],
        },
      };
    }
    default:
      return data ?? {};
  }
}

function fieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function VentureSectionEditor({
  slug,
  section,
  data,
  onSave,
  onStatus,
  readOnly = false,
}: VentureSectionEditorProps) {
  const [draft, setDraft] = useState<unknown>(() =>
    initializeDraft(section.type, data),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(initializeDraft(section.type, data));
  }, [data, section.type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    setSaving(true);
    try {
      await onSave(draft);
      onStatus(`${section.title} saved.`);
    } finally {
      setSaving(false);
    }
  }

  const key = section.key;

  function renderFields() {
    switch (section.type) {
      case "main-hero": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            <AdminField label="Title">
              <input
                className={inputClass}
                value={d.title}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, title: e.target.value })}
              />
            </AdminField>
            <AdminField label="Tagline">
              <input
                className={inputClass}
                value={d.tagline}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, tagline: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={4}
                value={d.intro}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="Hero image"
              src={d.image}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
          </div>
        );
      }

      case "mission-block": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            {(["label", "heading", "body", "approachHref"] as const).map((field) => (
              <AdminField key={field} label={fieldLabel(field)}>
                {field === "body" ? (
                  <textarea
                    className={textareaClass}
                    rows={4}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                )}
              </AdminField>
            ))}
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="Image"
              src={d.image}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
          </div>
        );
      }

      case "stats-bar": {
        const items = draft as { value: string; label: string }[];
        return (
          <div className="space-y-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid gap-4 border-b border-charcoal/10 pb-6 sm:grid-cols-2"
              >
                <AdminField label={`Stat ${i + 1} — value`}>
                  <input
                    className={inputClass}
                    value={item.value}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, value: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <AdminField label="Label">
                  <input
                    className={inputClass}
                    value={item.label}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, label: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={items.length > 1}
              onAdd={() =>
                setDraft([...items, { value: "", label: "" }])
              }
              onRemove={() => setDraft(items.slice(0, -1))}
            />
          </div>
        );
      }

      case "focus-cards": {
        const items = draft as {
          id: string;
          title: string;
          description: string;
          image: string;
          icon: string;
          href: string;
        }[];
        return (
          <div className="space-y-8">
            {items.map((item, i) => (
              <div key={i} className="space-y-4 border-b border-charcoal/10 pb-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Card {i + 1}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="ID">
                    <input
                      className={inputClass}
                      value={item.id}
                      disabled={readOnly}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...item, id: e.target.value };
                        setDraft(next);
                      }}
                    />
                  </AdminField>
                  <AdminField label="Icon">
                    <select
                      className={inputClass}
                      value={item.icon}
                      disabled={readOnly}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...item, icon: e.target.value };
                        setDraft(next);
                      }}
                    >
                      {FOCUS_ICONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                </div>
                <AdminField label="Title">
                  <input
                    className={inputClass}
                    value={item.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, title: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <AdminField label="Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={item.description}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, description: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <AdminField label="Link (href)">
                  <input
                    className={inputClass}
                    value={item.href}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, href: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, i, "image")}
                  label={`Card ${i + 1} image`}
                  src={item.image}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const next = [...items];
                    next[i] = { ...item, image: src };
                    setDraft(next);
                  }}
                  onStatus={onStatus}
                />
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={items.length > 1}
              onAdd={() =>
                setDraft([
                  ...items,
                  {
                    id: "",
                    title: "",
                    description: "",
                    image: "",
                    icon: "lodge",
                    href: "",
                  },
                ])
              }
              onRemove={() => setDraft(items.slice(0, -1))}
            />
          </div>
        );
      }

      case "section-header": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={3}
                value={d.intro}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
          </div>
        );
      }

      case "project-list": {
        const items = draft as Record<string, unknown>[];
        return (
          <div className="space-y-8">
            {items.map((item, i) => (
              <div key={i} className="space-y-4 border-b border-charcoal/10 pb-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Project {i + 1}
                </p>
                {(["id", "title", "status", "category", "href"] as const).map(
                  (field) => (
                    <AdminField key={field} label={fieldLabel(field)}>
                      <input
                        className={inputClass}
                        value={asString(item[field])}
                        disabled={readOnly}
                        onChange={(e) => {
                          const next = [...items];
                          next[i] = { ...item, [field]: e.target.value };
                          setDraft(next);
                        }}
                      />
                    </AdminField>
                  ),
                )}
                {"featured" in item && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={asBool(item.featured)}
                      disabled={readOnly}
                      onChange={(e) => {
                        const next = [...items];
                        next[i] = { ...item, featured: e.target.checked };
                        setDraft(next);
                      }}
                    />
                    Featured
                  </label>
                )}
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={items.length > 1}
              onAdd={() =>
                setDraft([
                  ...items,
                  { id: "", title: "", status: "", category: "", href: "" },
                ])
              }
              onRemove={() => setDraft(items.slice(0, -1))}
            />
          </div>
        );
      }

      case "featured-project": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            <p className="text-xs text-charcoal/55">
              Split layout from the Ventures mockup — dark text panel on the left, large image on the right.
            </p>
            <AdminField label="Section label">
              <input
                className={inputClass}
                value={d.label ?? ""}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Project title">
              <input
                className={inputClass}
                value={d.title ?? ""}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, title: e.target.value })}
              />
            </AdminField>
            <AdminField label="Description">
              <textarea
                className={textareaClass}
                rows={4}
                value={d.description ?? ""}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, description: e.target.value })}
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Status">
                <input
                  className={inputClass}
                  value={d.status ?? ""}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, status: e.target.value })}
                />
              </AdminField>
              <AdminField label="Button label">
                <input
                  className={inputClass}
                  value={d.ctaLabel ?? ""}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, ctaLabel: e.target.value })}
                />
              </AdminField>
            </div>
            <AdminField label="Project link (href)">
              <input
                className={inputClass}
                value={d.href ?? ""}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, href: e.target.value })}
              />
            </AdminField>
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="Project image"
              src={d.image}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
          </div>
        );
      }

      case "cta-banner": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            <AdminField label="Quote">
              <textarea
                className={textareaClass}
                rows={2}
                value={d.quote}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, quote: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Body">
              <textarea
                className={textareaClass}
                rows={3}
                value={d.body}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, body: e.target.value })}
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Button label">
                <input
                  className={inputClass}
                  value={d.ctaLabel ?? ""}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, ctaLabel: e.target.value })}
                />
              </AdminField>
              <AdminField label="Button link (href)">
                <input
                  className={inputClass}
                  value={d.ctaHref ?? ""}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, ctaHref: e.target.value })}
                />
              </AdminField>
            </div>
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="Background image"
              src={d.image}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
          </div>
        );
      }

      case "sub-hero": {
        const d = draft as Record<string, string>;
        const textFields = SUB_HERO_FIELDS.filter((f) => f in d && f !== "imageAlt");
        return (
          <div className="space-y-6">
            {textFields.map((field) => (
              <AdminField key={field} label={fieldLabel(field)}>
                {field === "intro" ? (
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                )}
              </AdminField>
            ))}
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="Hero image"
              src={d.image ?? ""}
              alt={d.imageAlt}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
            {"imageAlt" in d && (
              <AdminField label="Image alt text">
                <input
                  className={inputClass}
                  value={d.imageAlt ?? ""}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, imageAlt: e.target.value })}
                />
              </AdminField>
            )}
          </div>
        );
      }

      case "text-block": {
        const d = draft as Record<string, string>;
        const fields =
          Object.keys(d).length > 0
            ? (Object.keys(d) as (typeof TEXT_BLOCK_FIELDS)[number][])
            : (["label", "body"] as const);
        return (
          <div className="space-y-6">
            {fields.map((field) => (
              <AdminField key={field} label={fieldLabel(field)}>
                {field === "body" || field === "statement" ? (
                  <textarea
                    className={textareaClass}
                    rows={field === "body" ? 5 : 3}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                )}
              </AdminField>
            ))}
          </div>
        );
      }

      case "philosophy-block": {
        const d = draft as Record<string, unknown>;
        const themes = Array.isArray(d.themes) ? (d.themes as string[]) : null;
        const showCtas =
          !section.hasImage ||
          Boolean(
            asString(d.body) ||
              asString(d.partnerCta) ||
              asString(d.deckCta),
          );
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={asString(d.label)}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Statement / quote">
              <textarea
                className={textareaClass}
                rows={4}
                value={asString(d.statement)}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, statement: e.target.value })}
              />
            </AdminField>
            {section.hasImage && (
              <>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, "image")}
                  label="Section photo"
                  src={asString(d.image)}
                  alt={asString(d.imageAlt)}
                  readOnly={readOnly}
                  onUploaded={(src) => setDraft({ ...d, image: src })}
                  onStatus={onStatus}
                />
                <AdminField label="Photo alt text">
                  <input
                    className={inputClass}
                    value={asString(d.imageAlt)}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, imageAlt: e.target.value })}
                  />
                </AdminField>
              </>
            )}
            {showCtas && (
              <>
                <AdminField label="Body">
                  <textarea
                    className={textareaClass}
                    rows={4}
                    value={asString(d.body)}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, body: e.target.value })}
                  />
                </AdminField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Primary CTA label">
                    <input
                      className={inputClass}
                      value={asString(d.partnerCta)}
                      disabled={readOnly}
                      onChange={(e) =>
                        setDraft({ ...d, partnerCta: e.target.value })
                      }
                    />
                  </AdminField>
                  <AdminField label="Secondary CTA label">
                    <input
                      className={inputClass}
                      value={asString(d.deckCta)}
                      disabled={readOnly}
                      onChange={(e) => setDraft({ ...d, deckCta: e.target.value })}
                    />
                  </AdminField>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Primary CTA link (href)">
                    <input
                      className={inputClass}
                      value={asString(d.partnerHref)}
                      disabled={readOnly}
                      onChange={(e) =>
                        setDraft({ ...d, partnerHref: e.target.value })
                      }
                    />
                  </AdminField>
                  <AdminField label="Secondary CTA link (href)">
                    <input
                      className={inputClass}
                      value={asString(d.deckHref)}
                      disabled={readOnly}
                      onChange={(e) => setDraft({ ...d, deckHref: e.target.value })}
                    />
                  </AdminField>
                </div>
              </>
            )}
            {themes !== null && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Themes
                </p>
                {themes.map((theme, i) => (
                  <AdminField key={i} label={`Theme ${i + 1}`}>
                    <input
                      className={inputClass}
                      value={theme}
                      disabled={readOnly}
                      onChange={(e) => {
                        const next = [...themes];
                        next[i] = e.target.value;
                        setDraft({ ...d, themes: next });
                      }}
                    />
                  </AdminField>
                ))}
                <AddRemoveButtons
                  readOnly={readOnly}
                  canRemove={themes.length > 0}
                  onAdd={() =>
                    setDraft({ ...d, themes: [...themes, ""] })
                  }
                  onRemove={() =>
                    setDraft({ ...d, themes: themes.slice(0, -1) })
                  }
                />
              </div>
            )}
          </div>
        );
      }

      case "service-grid": {
        const d = draft as {
          label: string;
          heading: string;
          intro: string;
          items: { id: string; title: string; description: string }[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={2}
                value={d.intro ?? ""}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            {d.items.map((item, i) => (
              <div key={i} className="space-y-4 border-t border-charcoal/10 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Service {i + 1}
                </p>
                <AdminField label="ID">
                  <input
                    className={inputClass}
                    value={item.id}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, id: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <AdminField label="Title">
                  <input
                    className={inputClass}
                    value={item.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, title: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <AdminField label="Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={item.description}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, description: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={d.items.length > 1}
              onAdd={() =>
                setDraft({
                  ...d,
                  items: [...d.items, { id: "", title: "", description: "" }],
                })
              }
              onRemove={() => setDraft({ ...d, items: d.items.slice(0, -1) })}
            />
          </div>
        );
      }

      case "focus-items": {
        const d = draft as {
          label: string;
          heading: string;
          intro: string;
          items: { id: string; title: string; description: string; image: string }[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={2}
                value={d.intro ?? ""}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            {d.items.map((item, i) => (
              <div key={i} className="space-y-4 border-t border-charcoal/10 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Item {i + 1}
                </p>
                <AdminField label="ID">
                  <input
                    className={inputClass}
                    value={item.id}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, id: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <AdminField label="Title">
                  <input
                    className={inputClass}
                    value={item.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, title: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <AdminField label="Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={item.description}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, description: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, "items", i, "image")}
                  label={`Item ${i + 1} image`}
                  src={item.image}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const items = [...d.items];
                    items[i] = { ...item, image: src };
                    setDraft({ ...d, items });
                  }}
                  onStatus={onStatus}
                />
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={d.items.length > 1}
              onAdd={() =>
                setDraft({
                  ...d,
                  items: [
                    ...d.items,
                    { id: "", title: "", description: "", image: "" },
                  ],
                })
              }
              onRemove={() =>
                setDraft({ ...d, items: d.items.slice(0, -1) })
              }
            />
          </div>
        );
      }

      case "experience-grid": {
        const d = draft as {
          label: string;
          heading: string;
          intro: string;
          items: { id: string; title: string; image: string }[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={3}
                value={d.intro}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            {d.items.map((item, i) => (
              <div key={i} className="space-y-4 border-t border-charcoal/10 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Experience {i + 1}
                </p>
                <AdminField label="ID">
                  <input
                    className={inputClass}
                    value={item.id}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, id: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <AdminField label="Title">
                  <input
                    className={inputClass}
                    value={item.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = { ...item, title: e.target.value };
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, "items", i, "image")}
                  label={`Experience ${i + 1} image`}
                  src={item.image}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const items = [...d.items];
                    items[i] = { ...item, image: src };
                    setDraft({ ...d, items });
                  }}
                  onStatus={onStatus}
                />
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={d.items.length > 1}
              onAdd={() =>
                setDraft({
                  ...d,
                  items: [...d.items, { id: "", title: "", image: "" }],
                })
              }
              onRemove={() =>
                setDraft({ ...d, items: d.items.slice(0, -1) })
              }
            />
          </div>
        );
      }

      case "design-moodboard": {
        const d = draft as {
          label: string;
          heading: string;
          body: string;
          moodboard: { src: string; alt: string }[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Body">
              <textarea
                className={textareaClass}
                rows={4}
                value={d.body}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, body: e.target.value })}
              />
            </AdminField>
            {d.moodboard.map((img, i) => (
              <div key={i} className="space-y-4 border-t border-charcoal/10 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Moodboard image {i + 1}
                </p>
                <AdminField label="Alt text">
                  <input
                    className={inputClass}
                    value={img.alt}
                    disabled={readOnly}
                    onChange={(e) => {
                      const moodboard = [...d.moodboard];
                      moodboard[i] = { ...img, alt: e.target.value };
                      setDraft({ ...d, moodboard });
                    }}
                  />
                </AdminField>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, "moodboard", i, "src")}
                  label={`Image ${i + 1}`}
                  src={img.src}
                  alt={img.alt}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const moodboard = [...d.moodboard];
                    moodboard[i] = { ...img, src };
                    setDraft({ ...d, moodboard });
                  }}
                  onStatus={onStatus}
                />
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={d.moodboard.length > 1}
              onAdd={() =>
                setDraft({
                  ...d,
                  moodboard: [...d.moodboard, { src: "", alt: "" }],
                })
              }
              onRemove={() =>
                setDraft({ ...d, moodboard: d.moodboard.slice(0, -1) })
              }
            />
          </div>
        );
      }

      case "pillars-block": {
        const d = draft as {
          label: string;
          heading: string;
          intro: string;
          pillars: { title: string; description: string }[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={3}
                value={d.intro}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            {d.pillars.map((pillar, i) => (
              <div key={i} className="space-y-4 border-t border-charcoal/10 pt-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Pillar {i + 1}
                </p>
                <AdminField label="Title">
                  <input
                    className={inputClass}
                    value={pillar.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const pillars = [...d.pillars];
                      pillars[i] = { ...pillar, title: e.target.value };
                      setDraft({ ...d, pillars });
                    }}
                  />
                </AdminField>
                <AdminField label="Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={pillar.description}
                    disabled={readOnly}
                    onChange={(e) => {
                      const pillars = [...d.pillars];
                      pillars[i] = { ...pillar, description: e.target.value };
                      setDraft({ ...d, pillars });
                    }}
                  />
                </AdminField>
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={d.pillars.length > 1}
              onAdd={() =>
                setDraft({
                  ...d,
                  pillars: [...d.pillars, { title: "", description: "" }],
                })
              }
              onRemove={() =>
                setDraft({ ...d, pillars: d.pillars.slice(0, -1) })
              }
            />
          </div>
        );
      }

      case "image-gallery": {
        const items = draft as { src: string; alt: string }[];
        return (
          <div className="space-y-8">
            {items.map((img, i) => (
              <div key={i} className="space-y-4 border-b border-charcoal/10 pb-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Image {i + 1}
                </p>
                <AdminField label="Alt text">
                  <input
                    className={inputClass}
                    value={img.alt}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...img, alt: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, i, "src")}
                  label={`Gallery image ${i + 1}`}
                  src={img.src}
                  alt={img.alt}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const next = [...items];
                    next[i] = { ...img, src };
                    setDraft(next);
                  }}
                  onStatus={onStatus}
                />
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={items.length > 1}
              onAdd={() => setDraft([...items, { src: "", alt: "" }])}
              onRemove={() => setDraft(items.slice(0, -1))}
            />
          </div>
        );
      }

      case "quote-block": {
        const d = draft as Record<string, unknown>;
        const themes = Array.isArray(d.themes) ? (d.themes as string[]) : null;
        return (
          <div className="space-y-6">
            {"label" in d && (
              <AdminField label="Label">
                <input
                  className={inputClass}
                  value={asString(d.label)}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, label: e.target.value })}
                />
              </AdminField>
            )}
            <AdminField label="Quote">
              <textarea
                className={textareaClass}
                rows={4}
                value={asString(d.quote)}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, quote: e.target.value })}
              />
            </AdminField>
            {themes !== null && (
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Themes
                </p>
                {themes.map((theme, i) => (
                  <AdminField key={i} label={`Theme ${i + 1}`}>
                    <input
                      className={inputClass}
                      value={theme}
                      disabled={readOnly}
                      onChange={(e) => {
                        const next = [...themes];
                        next[i] = e.target.value;
                        setDraft({ ...d, themes: next });
                      }}
                    />
                  </AdminField>
                ))}
                <AddRemoveButtons
                  readOnly={readOnly}
                  canRemove={themes.length > 0}
                  onAdd={() =>
                    setDraft({ ...d, themes: [...themes, ""] })
                  }
                  onRemove={() =>
                    setDraft({ ...d, themes: themes.slice(0, -1) })
                  }
                />
              </div>
            )}
          </div>
        );
      }

      case "location-block": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            {(["label", "heading", "body", "imageAlt"] as const).map((field) => (
              <AdminField key={field} label={fieldLabel(field)}>
                {field === "body" ? (
                  <textarea
                    className={textareaClass}
                    rows={4}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={d[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => setDraft({ ...d, [field]: e.target.value })}
                  />
                )}
              </AdminField>
            ))}
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="Location image"
              src={d.image}
              alt={d.imageAlt}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
          </div>
        );
      }

      case "partner-cta": {
        const d = draft as Record<string, string>;
        return (
          <div className="space-y-6">
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Body">
              <textarea
                className={textareaClass}
                rows={4}
                value={d.body}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, body: e.target.value })}
              />
            </AdminField>
            <AdminField label="Primary CTA label">
              <input
                className={inputClass}
                value={d.cta}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, cta: e.target.value })}
              />
            </AdminField>
            <AdminField label="Secondary CTA label">
              <input
                className={inputClass}
                value={d.secondaryCta ?? ""}
                disabled={readOnly}
                onChange={(e) =>
                  setDraft({ ...d, secondaryCta: e.target.value })
                }
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Primary link (href)">
                <input
                  className={inputClass}
                  value={d.ctaHref ?? ""}
                  disabled={readOnly}
                  onChange={(e) => setDraft({ ...d, ctaHref: e.target.value })}
                />
              </AdminField>
              <AdminField label="Secondary link (href)">
                <input
                  className={inputClass}
                  value={d.secondaryCtaHref ?? ""}
                  disabled={readOnly}
                  onChange={(e) =>
                    setDraft({ ...d, secondaryCtaHref: e.target.value })
                  }
                />
              </AdminField>
            </div>
            <VentureImageField
              slug={slug}
              fieldPath={fp(key, "image")}
              label="CTA image"
              src={d.image}
              readOnly={readOnly}
              onUploaded={(src) => setDraft({ ...d, image: src })}
              onStatus={onStatus}
            />
          </div>
        );
      }

      case "card-list": {
        const items = draft as {
          id: string;
          title: string;
          description: string;
          image: string;
        }[];
        return (
          <div className="space-y-8">
            {items.map((item, i) => (
              <div key={i} className="space-y-4 border-b border-charcoal/10 pb-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                  Card {i + 1}
                </p>
                <AdminField label="ID">
                  <input
                    className={inputClass}
                    value={item.id}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, id: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <AdminField label="Title">
                  <input
                    className={inputClass}
                    value={item.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, title: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <AdminField label="Description">
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={item.description}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...item, description: e.target.value };
                      setDraft(next);
                    }}
                  />
                </AdminField>
                <VentureImageField
                  slug={slug}
                  fieldPath={fp(key, i, "image")}
                  label={`Card ${i + 1} image`}
                  src={item.image}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const next = [...items];
                    next[i] = { ...item, image: src };
                    setDraft(next);
                  }}
                  onStatus={onStatus}
                />
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={items.length > 1}
              onAdd={() =>
                setDraft([
                  ...items,
                  { id: "", title: "", description: "", image: "" },
                ])
              }
              onRemove={() => setDraft(items.slice(0, -1))}
            />
          </div>
        );
      }

      case "connect-page": {
        const d = draft as Record<string, unknown>;
        const hero = asRecord(d.hero);
        const intro = asRecord(d.intro);
        const form = asRecord(d.form);

        function setHero(patch: Record<string, string>) {
          setDraft({ ...d, hero: { ...hero, ...patch } });
        }
        function setIntro(patch: Record<string, string>) {
          setDraft({ ...d, intro: { ...intro, ...patch } });
        }
        function setForm(patch: Record<string, string>) {
          setDraft({ ...d, form: { ...form, ...patch } });
        }

        return (
          <div className="space-y-10">
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-charcoal">Hero</h3>
              {(
                [
                  "label",
                  "heading",
                  "subheading",
                  "cta",
                  "imageAlt",
                ] as const
              ).map((field) => (
                <AdminField key={field} label={fieldLabel(field)}>
                  {field === "subheading" ? (
                    <textarea
                      className={textareaClass}
                      rows={3}
                      value={asString(hero[field])}
                      disabled={readOnly}
                      onChange={(e) => setHero({ [field]: e.target.value })}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={asString(hero[field])}
                      disabled={readOnly}
                      onChange={(e) => setHero({ [field]: e.target.value })}
                    />
                  )}
                </AdminField>
              ))}
              <VentureImageField
                slug={slug}
                fieldPath={fp(key, "hero", "image")}
                label="Hero image"
                src={asString(hero.image)}
                alt={asString(hero.imageAlt)}
                readOnly={readOnly}
                onUploaded={(src) => setHero({ image: src })}
                onStatus={onStatus}
              />
            </div>

            <div className="space-y-6 border-t border-charcoal/10 pt-8">
              <h3 className="text-sm font-medium text-charcoal">Intro</h3>
              <AdminField label="Label">
                <input
                  className={inputClass}
                  value={asString(intro.label)}
                  disabled={readOnly}
                  onChange={(e) => setIntro({ label: e.target.value })}
                />
              </AdminField>
              <AdminField label="Statement">
                <textarea
                  className={textareaClass}
                  rows={3}
                  value={asString(intro.statement)}
                  disabled={readOnly}
                  onChange={(e) => setIntro({ statement: e.target.value })}
                />
              </AdminField>
              <AdminField label="Body">
                <textarea
                  className={textareaClass}
                  rows={4}
                  value={asString(intro.body)}
                  disabled={readOnly}
                  onChange={(e) => setIntro({ body: e.target.value })}
                />
              </AdminField>
            </div>

            <div className="space-y-6 border-t border-charcoal/10 pt-8">
              <h3 className="text-sm font-medium text-charcoal">Form copy</h3>
              {(
                [
                  "label",
                  "heading",
                  "subtext",
                  "submitLabel",
                  "successMessage",
                ] as const
              ).map((field) => (
                <AdminField key={field} label={fieldLabel(field)}>
                  {field === "subtext" || field === "successMessage" ? (
                    <textarea
                      className={textareaClass}
                      rows={field === "successMessage" ? 3 : 2}
                      value={asString(form[field])}
                      disabled={readOnly}
                      onChange={(e) => setForm({ [field]: e.target.value })}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={asString(form[field])}
                      disabled={readOnly}
                      onChange={(e) => setForm({ [field]: e.target.value })}
                    />
                  )}
                </AdminField>
              ))}
            </div>
          </div>
        );
      }

      case "community-stories": {
        const d = draft as {
          label: string;
          heading: string;
          intro: string;
          archiveIds: string[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={3}
                value={d.intro}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            <ArchiveStoryPicker
              value={d.archiveIds}
              readOnly={readOnly}
              onChange={(archiveIds) => setDraft({ ...d, archiveIds })}
            />
          </div>
        );
      }

      case "string-list-block": {
        const d = draft as {
          label: string;
          heading: string;
          intro: string;
          items: string[];
        };
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Intro">
              <textarea
                className={textareaClass}
                rows={3}
                value={d.intro}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, intro: e.target.value })}
              />
            </AdminField>
            <div className="space-y-4 border-t border-charcoal/10 pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                Items
              </p>
              {d.items.map((item, i) => (
                <AdminField key={i} label={`Item ${i + 1}`}>
                  <input
                    className={inputClass}
                    value={item}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = [...d.items];
                      items[i] = e.target.value;
                      setDraft({ ...d, items });
                    }}
                  />
                </AdminField>
              ))}
              <AddRemoveButtons
                readOnly={readOnly}
                canRemove={d.items.length > 1}
                onAdd={() => setDraft({ ...d, items: [...d.items, ""] })}
                onRemove={() => setDraft({ ...d, items: d.items.slice(0, -1) })}
              />
            </div>
          </div>
        );
      }

      case "craftsmanship-block": {
        const d = draft as {
          label: string;
          heading: string;
          body: string;
          highlights: string[];
          images: { src: string; alt: string }[];
        };
        const imageLabels = [
          "Photo 1 (top left)",
          "Photo 2 (top right)",
          "Photo 3 (wide, bottom)",
        ];
        return (
          <div className="space-y-6">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={d.label}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, label: e.target.value })}
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={d.heading}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, heading: e.target.value })}
              />
            </AdminField>
            <AdminField label="Body">
              <textarea
                className={textareaClass}
                rows={4}
                value={d.body}
                disabled={readOnly}
                onChange={(e) => setDraft({ ...d, body: e.target.value })}
              />
            </AdminField>

            <div className="space-y-4 border-t border-charcoal/10 pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                Highlights (bullet list)
              </p>
              {d.highlights.map((item, i) => (
                <AdminField key={i} label={`Highlight ${i + 1}`}>
                  <input
                    className={inputClass}
                    value={item}
                    disabled={readOnly}
                    onChange={(e) => {
                      const highlights = [...d.highlights];
                      highlights[i] = e.target.value;
                      setDraft({ ...d, highlights });
                    }}
                  />
                </AdminField>
              ))}
              <AddRemoveButtons
                readOnly={readOnly}
                canRemove={d.highlights.length > 1}
                onAdd={() =>
                  setDraft({ ...d, highlights: [...d.highlights, ""] })
                }
                onRemove={() =>
                  setDraft({ ...d, highlights: d.highlights.slice(0, -1) })
                }
              />
            </div>

            <div className="space-y-8 border-t border-charcoal/10 pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                Moodboard photos (3)
              </p>
              {d.images.map((img, i) => (
                <div key={i} className="space-y-4 border-b border-charcoal/10 pb-6">
                  <p className="text-sm font-medium text-charcoal">
                    {imageLabels[i] ?? `Photo ${i + 1}`}
                  </p>
                  <AdminField label="Alt text">
                    <input
                      className={inputClass}
                      value={img.alt}
                      disabled={readOnly}
                      onChange={(e) => {
                        const images = [...d.images];
                        images[i] = { ...img, alt: e.target.value };
                        setDraft({ ...d, images });
                      }}
                    />
                  </AdminField>
                  <VentureImageField
                    slug={slug}
                    fieldPath={fp(key, "images", i, "src")}
                    label={imageLabels[i] ?? `Photo ${i + 1}`}
                    src={img.src}
                    alt={img.alt}
                    readOnly={readOnly}
                    onUploaded={(src) => {
                      const images = [...d.images];
                      images[i] = { ...img, src };
                      setDraft({ ...d, images });
                    }}
                    onStatus={onStatus}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return (
          <p className="text-sm text-charcoal/60">
            Unknown section type: {section.type}
          </p>
        );
    }
  }

  return (
    <article className="rounded border border-charcoal/15 bg-ivory p-6">
      <header className="mb-6">
        <h2 className="font-serif text-xl text-charcoal">{section.title}</h2>
        {section.description && (
          <p className="mt-2 text-sm text-charcoal/60">{section.description}</p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFields()}
        {!readOnly && (
          <div className="border-t border-charcoal/10 pt-6">
            <SaveButton saving={saving} />
          </div>
        )}
      </form>
    </article>
  );
}
