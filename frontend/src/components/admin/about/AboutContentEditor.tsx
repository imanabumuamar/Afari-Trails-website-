"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AdminField } from "@/components/admin/ventures/AdminField";
import { AboutImageField } from "@/components/admin/about/AboutImageField";
import { readAdminApiError } from "@/lib/admin/cms-client-error";
import { mergeAboutData } from "@/lib/about/merge-about-data";
import type { AboutContentData } from "@/types/about-content";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

const PRINCIPLE_ICONS = ["explore", "authentic", "leaf", "slow", "connect"];
const PILLAR_ICONS = ["venture", "expedition", "archive", "store"];

type AboutContentEditorProps = {
  readOnly?: boolean;
};

export function AboutContentEditor({ readOnly = false }: AboutContentEditorProps) {
  const [data, setData] = useState<AboutContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/admin/content/about");
    setLoading(false);

    if (!res.ok) {
      setStatus(await readAdminApiError(res, "Could not load about content."));
      return;
    }

    const doc = await res.json();
    setData(mergeAboutData(doc.data as AboutContentData));
    setUpdatedAt(doc.updatedAt ?? null);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = useCallback(async (next: AboutContentData) => {
    setStatus("Saving…");
    const res = await fetch("/api/admin/content/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    });

    const doc = (await res.json()) as {
      data?: AboutContentData;
      updatedAt?: string;
      warning?: string;
      error?: string;
    };

    if (!res.ok || !doc.data) {
      setStatus(doc.error ?? "Save failed.");
      return;
    }

    setData(mergeAboutData(doc.data));
    setUpdatedAt(doc.updatedAt ?? null);
    setStatus(doc.warning ?? "Saved.");
    setTimeout(() => setStatus(""), doc.warning ? 5000 : 2500);
  }, []);

  async function save(next: AboutContentData) {
    await persist(next);
  }

  function schedulePersist(next: AboutContentData) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(next);
    }, 500);
  }

  function mergeSyncedBehindPeople(
    current: AboutContentData,
    synced: AboutContentData,
  ): AboutContentData {
    const images = mergeAboutData(synced).behindTheBrand.images.map(
      (syncedImg, idx) => {
        const draft = current.behindTheBrand.images[idx];
        if (!draft) return syncedImg;
        return {
          ...syncedImg,
          name: draft.name || syncedImg.name,
          position: draft.position || syncedImg.position,
        };
      },
    );
    return {
      ...mergeAboutData(synced),
      behindTheBrand: {
        ...mergeAboutData(synced).behindTheBrand,
        images,
      },
    };
  }

  if (loading) {
    return <p className="text-sm text-charcoal/60">Loading about page…</p>;
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "No data."}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 border-b border-charcoal/10 pb-4">
        <Link
          href="/about"
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save(data);
        }}
        className="space-y-14"
      >
        <section>
          <h3 className="font-serif text-2xl font-light">Hero</h3>
          <div className="mt-6 space-y-4">
            <AdminField label="Label">
              <input
                className={inputClass}
                value={data.hero.label}
                disabled={readOnly}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data.hero, label: e.target.value } })
                }
              />
            </AdminField>
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={data.hero.heading}
                disabled={readOnly}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data.hero, heading: e.target.value } })
                }
              />
            </AdminField>
            <AdminField label="Subtext">
              <textarea
                className={textareaClass}
                rows={3}
                value={data.hero.subtext}
                disabled={readOnly}
                onChange={(e) =>
                  setData({ ...data, hero: { ...data.hero, subtext: e.target.value } })
                }
              />
            </AdminField>
            <AboutImageField
              fieldPath="hero.image"
              label="Hero background"
              src={data.hero.image}
              readOnly={readOnly}
              onUploaded={(src) =>
                setData({ ...data, hero: { ...data.hero, image: src } })
              }
              onDocumentSynced={setData}
              onStatus={setStatus}
            />
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">Brand story</h3>
          <div className="mt-6 space-y-4">
            <AdminField label="Section label">
              <input
                className={inputClass}
                value={data.brandStory.label}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    brandStory: { ...data.brandStory, label: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Left column (one line per paragraph)">
              <textarea
                className={textareaClass}
                rows={10}
                value={data.brandStory.leftManifesto.join("\n")}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    brandStory: {
                      ...data.brandStory,
                      leftManifesto: e.target.value.split("\n").filter((l) => l.length > 0),
                    },
                  })
                }
              />
            </AdminField>
            <AdminField label="Right column (one paragraph per line block, blank line between)">
              <textarea
                className={textareaClass}
                rows={8}
                value={data.brandStory.rightBody.join("\n\n")}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    brandStory: {
                      ...data.brandStory,
                      rightBody: e.target.value.split("\n\n").filter((p) => p.trim()),
                    },
                  })
                }
              />
            </AdminField>
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">Visual strip</h3>
          <div className="mt-6 space-y-6">
            <AdminField label="Section label">
              <input
                className={inputClass}
                value={data.visualStrip.sectionLabel}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    visualStrip: {
                      ...data.visualStrip,
                      sectionLabel: e.target.value,
                    },
                  })
                }
              />
            </AdminField>
            {data.visualStrip.images.map((img, i) => (
              <div key={i} className="space-y-3 border-t border-charcoal/10 pt-6">
                <p className="text-xs text-charcoal/45">Image {i + 1}</p>
                <AdminField label="Alt text">
                  <input
                    className={inputClass}
                    value={img.alt}
                    disabled={readOnly}
                    onChange={(e) => {
                      const images = [...data.visualStrip.images];
                      images[i] = { ...img, alt: e.target.value };
                      setData({
                        ...data,
                        visualStrip: { ...data.visualStrip, images },
                      });
                    }}
                  />
                </AdminField>
                <AboutImageField
                  fieldPath={`visualStrip.images.${i}.src`}
                  label="Image"
                  src={img.src}
                  alt={img.alt}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const images = [...data.visualStrip.images];
                    images[i] = { ...img, src };
                    setData({ ...data, visualStrip: { ...data.visualStrip, images } });
                  }}
                  onDocumentSynced={setData}
                  onStatus={setStatus}
                />
              </div>
            ))}
            {!readOnly && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-charcoal/55"
                onClick={() =>
                  setData({
                    ...data,
                    visualStrip: {
                      ...data.visualStrip,
                      images: [
                        ...data.visualStrip.images,
                        {
                          src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
                          alt: "",
                        },
                      ],
                    },
                  })
                }
              >
                + Add strip image
              </button>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">Afari Philosophy</h3>
          <p className="mt-2 text-xs text-charcoal/50">
            Dark panel with principles on the left; quote and photo on the right.
          </p>
          <div className="mt-6 space-y-4">
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={data.philosophy.heading}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    philosophy: { ...data.philosophy, heading: e.target.value },
                  })
                }
              />
            </AdminField>
            {data.philosophy.principles.map((p, i) => (
              <div key={i} className="grid gap-3 border-t border-charcoal/10 pt-4 sm:grid-cols-2">
                <AdminField label={`Principle ${i + 1} title`}>
                  <input
                    className={inputClass}
                    value={p.title}
                    disabled={readOnly}
                    onChange={(e) => {
                      const principles = [...data.philosophy.principles];
                      principles[i] = { ...p, title: e.target.value };
                      setData({
                        ...data,
                        philosophy: { ...data.philosophy, principles },
                      });
                    }}
                  />
                </AdminField>
                <AdminField label="Icon">
                  <select
                    className={inputClass}
                    value={p.icon}
                    disabled={readOnly}
                    onChange={(e) => {
                      const principles = [...data.philosophy.principles];
                      principles[i] = { ...p, icon: e.target.value };
                      setData({
                        ...data,
                        philosophy: { ...data.philosophy, principles },
                      });
                    }}
                  >
                    {PRINCIPLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </AdminField>
              </div>
            ))}
            <AdminField label="Quote (over photo)">
              <textarea
                className={textareaClass}
                rows={3}
                value={data.whyWeExist.quote}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    whyWeExist: { ...data.whyWeExist, quote: e.target.value },
                  })
                }
              />
            </AdminField>
            <AboutImageField
              fieldPath="whyWeExist.image"
              label="Philosophy section photo"
              src={data.whyWeExist.image}
              readOnly={readOnly}
              onUploaded={(src) =>
                setData({
                  ...data,
                  whyWeExist: { ...data.whyWeExist, image: src },
                })
              }
              onDocumentSynced={setData}
              onStatus={setStatus}
            />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-serif text-2xl font-light">Behind the brand</h3>
            <p className="text-xs text-charcoal/50">
              {data.behindTheBrand.images.length}{" "}
              {data.behindTheBrand.images.length === 1 ? "person" : "people"} —
              photo, name, and position each (name & position auto-save)
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={data.behindTheBrand.heading}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    behindTheBrand: {
                      ...data.behindTheBrand,
                      heading: e.target.value,
                    },
                  })
                }
              />
            </AdminField>
            {data.behindTheBrand.images.map((img, i) => (
              <div
                key={i}
                className="space-y-3 rounded border border-charcoal/10 bg-beige/30 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                    Person {i + 1}
                  </p>
                  {!readOnly && (
                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.12em] text-red-800/70 hover:text-red-900"
                      onClick={() => {
                        const next = {
                          ...data,
                          behindTheBrand: {
                            ...data.behindTheBrand,
                            images: data.behindTheBrand.images.filter(
                              (_, idx) => idx !== i,
                            ),
                          },
                        };
                        setData(next);
                        void persist(next);
                      }}
                    >
                      Delete person
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AdminField label="Name">
                    <input
                      className={inputClass}
                      value={img.name}
                      placeholder="e.g. Sarah Mwale"
                      disabled={readOnly}
                      onChange={(e) => {
                        const images = [...data.behindTheBrand.images];
                        images[i] = { ...img, name: e.target.value };
                        const next = {
                          ...data,
                          behindTheBrand: { ...data.behindTheBrand, images },
                        };
                        setData(next);
                        schedulePersist(next);
                      }}
                    />
                  </AdminField>
                  <AdminField label="Position">
                    <input
                      className={inputClass}
                      value={img.position}
                      placeholder="e.g. Founder"
                      disabled={readOnly}
                      onChange={(e) => {
                        const images = [...data.behindTheBrand.images];
                        images[i] = { ...img, position: e.target.value };
                        const next = {
                          ...data,
                          behindTheBrand: { ...data.behindTheBrand, images },
                        };
                        setData(next);
                        schedulePersist(next);
                      }}
                    />
                  </AdminField>
                </div>
                <AboutImageField
                  fieldPath={`behindTheBrand.images.${i}.src`}
                  label="Photo"
                  src={img.src}
                  alt={img.name || img.position}
                  readOnly={readOnly}
                  onUploaded={(newSrc) => {
                    const images = [...data.behindTheBrand.images];
                    images[i] = { ...img, src: newSrc };
                    const next = {
                      ...data,
                      behindTheBrand: { ...data.behindTheBrand, images },
                    };
                    setData(next);
                    schedulePersist(next);
                  }}
                  onDocumentSynced={(next) =>
                    setData(mergeSyncedBehindPeople(data, next))
                  }
                  onStatus={setStatus}
                />
              </div>
            ))}
            {!readOnly && (
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-charcoal/55"
                onClick={() => {
                  const next = {
                    ...data,
                    behindTheBrand: {
                      ...data.behindTheBrand,
                      images: [
                        ...data.behindTheBrand.images,
                        { src: "", name: "", position: "" },
                      ],
                    },
                  };
                  setData(next);
                  void persist(next);
                }}
              >
                + Add person
              </button>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">Future vision</h3>
          <div className="mt-6 space-y-4">
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={data.futureVision.heading}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    futureVision: { ...data.futureVision, heading: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <textarea
                className={textareaClass}
                rows={4}
                value={data.futureVision.body}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    futureVision: { ...data.futureVision, body: e.target.value },
                  })
                }
              />
            </AdminField>
            {data.futureVision.pillars.map((pillar, i) => (
              <div
                key={pillar.href}
                className="grid gap-3 border-t border-charcoal/10 pt-4 sm:grid-cols-3"
              >
                <AdminField label="Label">
                  <input
                    className={inputClass}
                    value={pillar.label}
                    disabled={readOnly}
                    onChange={(e) => {
                      const pillars = [...data.futureVision.pillars];
                      pillars[i] = { ...pillar, label: e.target.value };
                      setData({
                        ...data,
                        futureVision: { ...data.futureVision, pillars },
                      });
                    }}
                  />
                </AdminField>
                <AdminField label="Link">
                  <input
                    className={inputClass}
                    value={pillar.href}
                    disabled={readOnly}
                    onChange={(e) => {
                      const pillars = [...data.futureVision.pillars];
                      pillars[i] = { ...pillar, href: e.target.value };
                      setData({
                        ...data,
                        futureVision: { ...data.futureVision, pillars },
                      });
                    }}
                  />
                </AdminField>
                <AdminField label="Icon">
                  <select
                    className={inputClass}
                    value={pillar.icon}
                    disabled={readOnly}
                    onChange={(e) => {
                      const pillars = [...data.futureVision.pillars];
                      pillars[i] = { ...pillar, icon: e.target.value };
                      setData({
                        ...data,
                        futureVision: { ...data.futureVision, pillars },
                      });
                    }}
                  >
                    {PILLAR_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </AdminField>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">Final quote</h3>
          <div className="mt-6">
            <AdminField label="Quote">
              <textarea
                className={textareaClass}
                rows={3}
                value={data.finalQuote.text}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    finalQuote: { text: e.target.value },
                  })
                }
              />
            </AdminField>
          </div>
        </section>

        <section>
          <h3 className="font-serif text-2xl font-light">Get in touch</h3>
          <div className="mt-6 space-y-4">
            <AdminField label="Heading">
              <input
                className={inputClass}
                value={data.getInTouch.heading}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    getInTouch: { ...data.getInTouch, heading: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <textarea
                className={textareaClass}
                rows={3}
                value={data.getInTouch.body}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    getInTouch: { ...data.getInTouch, body: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Button label">
              <input
                className={inputClass}
                value={data.getInTouch.cta}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    getInTouch: { ...data.getInTouch, cta: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Button link">
              <input
                className={inputClass}
                value={data.getInTouch.href}
                disabled={readOnly}
                onChange={(e) =>
                  setData({
                    ...data,
                    getInTouch: { ...data.getInTouch, href: e.target.value },
                  })
                }
              />
            </AdminField>
          </div>
        </section>

        {!readOnly && (
          <button
            type="submit"
            className="bg-charcoal px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-matte-black"
          >
            Save about page
          </button>
        )}
      </form>
    </div>
  );
}
