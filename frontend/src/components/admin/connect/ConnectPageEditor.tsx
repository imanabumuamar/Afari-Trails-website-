"use client";

import {
  AddRemoveButtons,
  AdminField,
  inputClass,
  textareaClass,
} from "@/components/admin/ventures/AdminField";
import { ConnectImageField } from "@/components/admin/connect/ConnectImageField";
import { CONNECT_PAGE_SECTIONS } from "@/lib/connect/connect-page-sections";
import type { ConnectContentData } from "@/types/connect-content";
import type { ConnectPageConfig } from "@/types/connect-page";

type ConnectPageKey = keyof ConnectContentData;

type ConnectPageEditorProps = {
  pageKey: ConnectPageKey;
  config: ConnectPageConfig;
  readOnly?: boolean;
  onChange: (config: ConnectPageConfig) => void;
  onDocumentSynced?: (data: ConnectContentData) => void;
  onStatus: (message: string) => void;
};

function fp(pageKey: string, ...parts: (string | number)[]): string {
  return [pageKey, ...parts.map(String)].join(".");
}

function fieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function ConnectPageEditor({
  pageKey,
  config,
  readOnly = false,
  onChange,
  onDocumentSynced,
  onStatus,
}: ConnectPageEditorProps) {
  function patch(partial: Partial<ConnectPageConfig>) {
    onChange({ ...config, ...partial });
  }

  const show = CONNECT_PAGE_SECTIONS[pageKey];
  const hero = config.hero;
  const intro = config.intro;
  const categories = config.categories;
  const form = config.form;
  const direct = config.direct;
  const gallery = [...config.gallery];
  const newsletter = config.newsletter;
  const closing = config.closing;

  return (
    <div className="space-y-10">
      {show.hero && (
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-charcoal">Hero</h3>
        {(["label", "heading", "cta", "imageAlt"] as const).map((field) => (
          <AdminField key={field} label={fieldLabel(field)}>
            <input
              className={inputClass}
              value={hero[field]}
              disabled={readOnly}
              onChange={(e) =>
                patch({ hero: { ...hero, [field]: e.target.value } })
              }
            />
          </AdminField>
        ))}
        <AdminField label="Subheading">
          <textarea
            className={textareaClass}
            rows={3}
            value={hero.subheading}
            disabled={readOnly}
            onChange={(e) =>
              patch({ hero: { ...hero, subheading: e.target.value } })
            }
          />
        </AdminField>
        <ConnectImageField
          fieldPath={fp(pageKey, "hero", "image")}
          label="Hero image"
          src={hero.image}
          alt={hero.imageAlt}
          readOnly={readOnly}
          onUploaded={(src) => patch({ hero: { ...hero, image: src } })}
          onDocumentSynced={onDocumentSynced}
          onStatus={onStatus}
        />
      </div>
      )}

      {show.intro && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Intro</h3>
        <AdminField label="Label">
          <input
            className={inputClass}
            value={intro.label ?? ""}
            disabled={readOnly}
            onChange={(e) =>
              patch({ intro: { ...intro, label: e.target.value } })
            }
          />
        </AdminField>
        <AdminField label="Statement">
          <textarea
            className={textareaClass}
            rows={3}
            value={intro.statement}
            disabled={readOnly}
            onChange={(e) =>
              patch({ intro: { ...intro, statement: e.target.value } })
            }
          />
        </AdminField>
        <AdminField label="Body">
          <textarea
            className={textareaClass}
            rows={4}
            value={intro.body}
            disabled={readOnly}
            onChange={(e) => patch({ intro: { ...intro, body: e.target.value } })}
          />
        </AdminField>
      </div>
      )}

      {show.categories && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Categories</h3>
        <AdminField label="Section label">
          <input
            className={inputClass}
            value={categories.label}
            disabled={readOnly}
            onChange={(e) =>
              patch({
                categories: { ...categories, label: e.target.value },
              })
            }
          />
        </AdminField>
        <AdminField label="Section heading">
          <input
            className={inputClass}
            value={categories.heading}
            disabled={readOnly}
            onChange={(e) =>
              patch({
                categories: { ...categories, heading: e.target.value },
              })
            }
          />
        </AdminField>
        {categories.items.map((item, i) => (
          <div
            key={i}
            className="space-y-4 rounded border border-charcoal/10 p-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
              Category {i + 1}
            </p>
            {(["id", "title", "description", "href", "inquiry"] as const).map(
              (field) => (
                <AdminField key={field} label={fieldLabel(field)}>
                  <input
                    className={inputClass}
                    value={item[field] ?? ""}
                    disabled={readOnly}
                    onChange={(e) => {
                      const items = categories.items.map((it, j) =>
                        j === i ? { ...it, [field]: e.target.value } : it,
                      );
                      patch({ categories: { ...categories, items } });
                    }}
                  />
                </AdminField>
              ),
            )}
            <ConnectImageField
              fieldPath={fp(pageKey, "categories", "items", i, "image")}
              label="Category image"
              src={item.image}
              readOnly={readOnly}
              onUploaded={(src) => {
                const items = categories.items.map((it, j) =>
                  j === i ? { ...it, image: src } : it,
                );
                patch({ categories: { ...categories, items } });
              }}
              onDocumentSynced={onDocumentSynced}
              onStatus={onStatus}
            />
          </div>
        ))}
        <AddRemoveButtons
          readOnly={readOnly}
          canRemove={categories.items.length > 1}
          onAdd={() =>
            patch({
              categories: {
                ...categories,
                items: [
                  ...categories.items,
                  {
                    id: "",
                    title: "",
                    description: "",
                    image: "",
                    href: "",
                  },
                ],
              },
            })
          }
          onRemove={() =>
            patch({
              categories: {
                ...categories,
                items: categories.items.slice(0, -1),
              },
            })
          }
        />
      </div>
      )}

      {show.form && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Form</h3>
        {(
          ["label", "heading", "subtext", "submitLabel", "successMessage"] as const
        ).map((field) => (
          <AdminField key={field} label={fieldLabel(field)}>
            {field === "subtext" || field === "successMessage" ? (
              <textarea
                className={textareaClass}
                rows={field === "successMessage" ? 3 : 2}
                value={form[field]}
                disabled={readOnly}
                onChange={(e) =>
                  patch({ form: { ...form, [field]: e.target.value } })
                }
              />
            ) : (
              <input
                className={inputClass}
                value={form[field]}
                disabled={readOnly}
                onChange={(e) =>
                  patch({ form: { ...form, [field]: e.target.value } })
                }
              />
            )}
          </AdminField>
        ))}
        <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
          Inquiry options
        </p>
        {form.inquiryOptions.map((opt, i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-2">
            <AdminField label={`Option ${i + 1} — value`}>
              <input
                className={inputClass}
                value={opt.value}
                disabled={readOnly}
                onChange={(e) => {
                  const inquiryOptions = form.inquiryOptions.map((o, j) =>
                    j === i ? { ...o, value: e.target.value } : o,
                  );
                  patch({ form: { ...form, inquiryOptions } });
                }}
              />
            </AdminField>
            <AdminField label="Label">
              <input
                className={inputClass}
                value={opt.label}
                disabled={readOnly}
                onChange={(e) => {
                  const inquiryOptions = form.inquiryOptions.map((o, j) =>
                    j === i ? { ...o, label: e.target.value } : o,
                  );
                  patch({ form: { ...form, inquiryOptions } });
                }}
              />
            </AdminField>
          </div>
        ))}
        <AddRemoveButtons
          readOnly={readOnly}
          canRemove={form.inquiryOptions.length > 1}
          onAdd={() =>
            patch({
              form: {
                ...form,
                inquiryOptions: [
                  ...form.inquiryOptions,
                  { value: "", label: "" },
                ],
              },
            })
          }
          onRemove={() =>
            patch({
              form: {
                ...form,
                inquiryOptions: form.inquiryOptions.slice(0, -1),
              },
            })
          }
        />
      </div>
      )}

      {show.direct && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Direct contact</h3>
        <AdminField label="Email">
          <input
            className={inputClass}
            value={direct.email}
            disabled={readOnly}
            onChange={(e) =>
              patch({ direct: { ...direct, email: e.target.value } })
            }
          />
        </AdminField>
        <AdminField label="Location">
          <input
            className={inputClass}
            value={direct.location}
            disabled={readOnly}
            onChange={(e) =>
              patch({ direct: { ...direct, location: e.target.value } })
            }
          />
        </AdminField>
        {direct.socials.map((social, i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-2">
            <AdminField label={`Social ${i + 1} — label`}>
              <input
                className={inputClass}
                value={social.label}
                disabled={readOnly}
                onChange={(e) => {
                  const socials = direct.socials.map((s, j) =>
                    j === i ? { ...s, label: e.target.value } : s,
                  );
                  patch({ direct: { ...direct, socials } });
                }}
              />
            </AdminField>
            <AdminField label="URL">
              <input
                className={inputClass}
                value={social.href}
                disabled={readOnly}
                onChange={(e) => {
                  const socials = direct.socials.map((s, j) =>
                    j === i ? { ...s, href: e.target.value } : s,
                  );
                  patch({ direct: { ...direct, socials } });
                }}
              />
            </AdminField>
          </div>
        ))}
        <AddRemoveButtons
          readOnly={readOnly}
          canRemove={direct.socials.length > 0}
          onAdd={() =>
            patch({
              direct: {
                ...direct,
                socials: [...direct.socials, { label: "", href: "" }],
              },
            })
          }
          onRemove={() =>
            patch({
              direct: {
                ...direct,
                socials: direct.socials.slice(0, -1),
              },
            })
          }
        />
      </div>
      )}

      {show.gallery && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Gallery</h3>
        {gallery.map((img, i) => (
          <div key={i} className="space-y-4 rounded border border-charcoal/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">
              Image {i + 1}
            </p>
            <AdminField label="Alt text">
              <input
                className={inputClass}
                value={img.alt}
                disabled={readOnly}
                onChange={(e) => {
                  const next = gallery.map((g, j) =>
                    j === i ? { ...g, alt: e.target.value } : g,
                  );
                  patch({ gallery: next });
                }}
              />
            </AdminField>
            <ConnectImageField
              fieldPath={fp(pageKey, "gallery", i, "src")}
              label="Gallery image"
              src={img.src}
              alt={img.alt}
              readOnly={readOnly}
              onUploaded={(src) => {
                const next = gallery.map((g, j) =>
                  j === i ? { ...g, src } : g,
                );
                patch({ gallery: next });
              }}
              onDocumentSynced={onDocumentSynced}
              onStatus={onStatus}
            />
          </div>
        ))}
        <AddRemoveButtons
          readOnly={readOnly}
          canRemove={gallery.length > 0}
          onAdd={() => patch({ gallery: [...gallery, { src: "", alt: "" }] })}
          onRemove={() => patch({ gallery: gallery.slice(0, -1) })}
        />
      </div>
      )}

      {show.newsletter && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Newsletter</h3>
        {!newsletter ? (
          <p className="text-sm text-charcoal/55">
            No newsletter block on this page.
            {!readOnly && (
              <>
                {" "}
                <button
                  type="button"
                  className="underline hover:text-gold"
                  onClick={() =>
                    patch({
                      newsletter: {
                        heading: "",
                        subtext: "",
                        placeholder: "",
                        submitLabel: "",
                        successMessage: "",
                      },
                    })
                  }
                >
                  Add newsletter section
                </button>
              </>
            )}
          </p>
        ) : (
          <>
            {(
              [
                "heading",
                "subtext",
                "placeholder",
                "submitLabel",
                "successMessage",
              ] as const
            ).map((field) => (
              <AdminField key={field} label={fieldLabel(field)}>
                <textarea
                  className={textareaClass}
                  rows={field === "subtext" ? 2 : 1}
                  value={newsletter[field]}
                  disabled={readOnly}
                  onChange={(e) =>
                    patch({
                      newsletter: { ...newsletter, [field]: e.target.value },
                    })
                  }
                />
              </AdminField>
            ))}
            {!readOnly && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-charcoal/55 underline hover:text-gold"
                onClick={() => patch({ newsletter: undefined })}
              >
                Remove newsletter section
              </button>
            )}
          </>
        )}
      </div>
      )}

      {show.closing && (
      <div className="space-y-6 border-t border-charcoal/10 pt-8">
        <h3 className="text-sm font-medium text-charcoal">Closing quote</h3>
        <AdminField label="Quote">
          <textarea
            className={textareaClass}
            rows={3}
            value={closing.quote}
            disabled={readOnly}
            onChange={(e) =>
              patch({ closing: { quote: e.target.value } })
            }
          />
        </AdminField>
      </div>
      )}
    </div>
  );
}
