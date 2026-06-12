"use client";

import {
  AddRemoveButtons,
  AdminField,
  SaveButton,
} from "@/components/admin/ventures/AdminField";
import { VentureImageField } from "@/components/admin/ventures/VentureImageField";
import { VentureProjectSectionVisibilityEditor } from "@/components/admin/ventures/VentureProjectSectionVisibilityEditor";
import type { VentureSlug } from "@/lib/data/venture-defaults";
import {
  applyVentureProjectListingStatus,
  getVentureProjectListingStatus,
  VENTURE_PROJECT_LISTING_OPTIONS,
} from "@/lib/ventures/venture-project-status";
import { slugifyVentureProjectId } from "@/lib/ventures/venture-projects-shared";
import { VENTURE_PROJECT_STATUSES } from "@/types/venture-project";
import type { VentureFeaturedProject } from "@/types/venture-project";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

function blankProject(): VentureFeaturedProject {
  return {
    id: "",
    title: "New Project",
    description: "",
    status: "Planned",
    image: "",
    ctaLabel: "View Project →",
    published: false,
    hidden: true,
    story: "",
    vision: "",
    locationLabel: "Location",
    locationHeading: "",
    locationBody: "",
    locationImage: "",
    gallery: [],
    communityImpact: "",
    conservation: "",
    timeline: [],
  };
}

type FeaturedProjectsEditorProps = {
  slug: VentureSlug;
  draft: VentureFeaturedProject[];
  readOnly?: boolean;
  saving?: boolean;
  setDraft: (value: VentureFeaturedProject[]) => void;
  onStatus: (message: string) => void;
  onSave?: () => Promise<void>;
};

export function FeaturedProjectsEditor({
  slug,
  draft,
  readOnly = false,
  saving = false,
  setDraft,
  onStatus,
  onSave,
}: FeaturedProjectsEditorProps) {
  function updateProject(
    index: number,
    patch: Partial<VentureFeaturedProject>,
  ) {
    const next = [...draft];
    next[index] = { ...next[index], ...patch };
    setDraft(next);
  }

  function moveProject(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[index], next[target]] = [next[target], next[index]];
    setDraft(next);
  }

  return (
    <div className="space-y-10">
      <p className="text-xs leading-relaxed text-charcoal/55">
        Add, remove, publish, or reorder featured projects. Order here controls how
        they appear on the ventures page. Each project gets its own page at{" "}
        <code className="text-[11px]">/ventures/projects/[slug]</code>.
      </p>

      {draft.map((project, index) => (
        <div
          key={`${project.id}-${index}`}
          className="space-y-6 border border-charcoal/12 bg-beige/20 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
              Project {index + 1}
              {project.title ? ` · ${project.title}` : ""}
            </p>
            {!readOnly && (
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  className="border border-charcoal/20 px-2.5 py-1 text-xs"
                  disabled={index === 0}
                  onClick={() => moveProject(index, -1)}
                  aria-label="Move project up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="border border-charcoal/20 px-2.5 py-1 text-xs"
                  disabled={index === draft.length - 1}
                  onClick={() => moveProject(index, 1)}
                  aria-label="Move project down"
                >
                  ↓
                </button>
                <span className="text-xs text-charcoal/45">#{index + 1}</span>
              </span>
            )}
          </div>

          <div className="space-y-4 rounded border border-charcoal/12 bg-beige/30 p-5">
            <div>
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
                Public status
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-charcoal/55">
                Published projects appear on the ventures page and at their project
                URL.
              </p>
            </div>
            <div className="space-y-3">
              {VENTURE_PROJECT_LISTING_OPTIONS.map((option) => {
                const selected =
                  getVentureProjectListingStatus(project) === option.value;
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
                      name={`venture-project-status-${index}`}
                      className="mt-0.5 shrink-0"
                      checked={selected}
                      disabled={readOnly}
                      onChange={() =>
                        updateProject(
                          index,
                          applyVentureProjectListingStatus(project, option.value),
                        )
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
          </div>

          <VentureProjectSectionVisibilityEditor
            project={project}
            readOnly={readOnly}
            onChange={(updated) => {
              const next = [...draft];
              next[index] = updated;
              setDraft(next);
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="URL slug">
              <input
                className={inputClass}
                value={project.id}
                disabled={readOnly}
                onChange={(e) =>
                  updateProject(index, {
                    id: slugifyVentureProjectId(e.target.value),
                  })
                }
                onBlur={() => {
                  if (!project.id.trim() && project.title.trim()) {
                    updateProject(index, {
                      id: slugifyVentureProjectId(project.title),
                    });
                  }
                }}
              />
            </AdminField>
            <AdminField label="Status">
              <select
                className={inputClass}
                value={project.status}
                disabled={readOnly}
                onChange={(e) =>
                  updateProject(index, { status: e.target.value })
                }
              >
                {VENTURE_PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <AdminField label="Project name">
            <input
              className={inputClass}
              value={project.title}
              disabled={readOnly}
              onChange={(e) => updateProject(index, { title: e.target.value })}
            />
          </AdminField>

          <AdminField label="Short description (card)">
            <textarea
              className={textareaClass}
              rows={3}
              value={project.description}
              disabled={readOnly}
              onChange={(e) =>
                updateProject(index, { description: e.target.value })
              }
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Button label">
              <input
                className={inputClass}
                value={project.ctaLabel ?? ""}
                disabled={readOnly}
                onChange={(e) =>
                  updateProject(index, { ctaLabel: e.target.value })
                }
              />
            </AdminField>
            <AdminField label="Card image alt text">
              <input
                className={inputClass}
                value={project.imageAlt ?? ""}
                disabled={readOnly}
                onChange={(e) =>
                  updateProject(index, { imageAlt: e.target.value })
                }
              />
            </AdminField>
          </div>

          <VentureImageField
            slug={slug}
            fieldPath={`featuredProjects.${index}.image`}
            label="Card & hero image"
            src={project.image}
            alt={project.title}
            readOnly={readOnly}
            onUploaded={(src) => updateProject(index, { image: src })}
            onStatus={onStatus}
          />

          <AdminField label="Project story">
            <textarea
              className={textareaClass}
              rows={5}
              value={project.story}
              disabled={readOnly}
              onChange={(e) => updateProject(index, { story: e.target.value })}
            />
          </AdminField>

          <AdminField label="Vision & goals">
            <textarea
              className={textareaClass}
              rows={4}
              value={project.vision}
              disabled={readOnly}
              onChange={(e) => updateProject(index, { vision: e.target.value })}
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Location label">
              <input
                className={inputClass}
                value={project.locationLabel ?? ""}
                disabled={readOnly}
                onChange={(e) =>
                  updateProject(index, { locationLabel: e.target.value })
                }
              />
            </AdminField>
            <AdminField label="Location heading">
              <input
                className={inputClass}
                value={project.locationHeading ?? ""}
                disabled={readOnly}
                onChange={(e) =>
                  updateProject(index, { locationHeading: e.target.value })
                }
              />
            </AdminField>
          </div>

          <AdminField label="Location description">
            <textarea
              className={textareaClass}
              rows={3}
              value={project.locationBody}
              disabled={readOnly}
              onChange={(e) =>
                updateProject(index, { locationBody: e.target.value })
              }
            />
          </AdminField>

          <VentureImageField
            slug={slug}
            fieldPath={`featuredProjects.${index}.locationImage`}
            label="Location image"
            src={project.locationImage ?? ""}
            readOnly={readOnly}
            onUploaded={(src) => updateProject(index, { locationImage: src })}
            onStatus={onStatus}
          />

          <AdminField label="Community impact">
            <textarea
              className={textareaClass}
              rows={4}
              value={project.communityImpact}
              disabled={readOnly}
              onChange={(e) =>
                updateProject(index, { communityImpact: e.target.value })
              }
            />
          </AdminField>

          <AdminField label="Conservation aspects">
            <textarea
              className={textareaClass}
              rows={4}
              value={project.conservation}
              disabled={readOnly}
              onChange={(e) =>
                updateProject(index, { conservation: e.target.value })
              }
            />
          </AdminField>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
              Photos / renders
            </p>
            {project.gallery.map((frame, frameIndex) => (
              <div
                key={frameIndex}
                className="space-y-3 border-b border-charcoal/10 pb-4"
              >
                <p className="text-[11px] text-charcoal/45">Image {frameIndex + 1}</p>
                <VentureImageField
                  slug={slug}
                  fieldPath={`featuredProjects.${index}.gallery.${frameIndex}.src`}
                  label="Gallery image"
                  src={frame.src}
                  alt={frame.alt}
                  readOnly={readOnly}
                  onUploaded={(src) => {
                    const gallery = [...project.gallery];
                    gallery[frameIndex] = { ...gallery[frameIndex], src };
                    updateProject(index, { gallery });
                  }}
                  onStatus={onStatus}
                />
                <AdminField label="Alt text">
                  <input
                    className={inputClass}
                    value={frame.alt}
                    disabled={readOnly}
                    onChange={(e) => {
                      const gallery = [...project.gallery];
                      gallery[frameIndex] = {
                        ...gallery[frameIndex],
                        alt: e.target.value,
                      };
                      updateProject(index, { gallery });
                    }}
                  />
                </AdminField>
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={project.gallery.length > 0}
              onAdd={() =>
                updateProject(index, {
                  gallery: [...project.gallery, { src: "", alt: "" }],
                })
              }
              onRemove={() =>
                updateProject(index, {
                  gallery: project.gallery.slice(0, -1),
                })
              }
            />
          </div>

          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
              Timeline / progress
            </p>
            {project.timeline.map((entry, entryIndex) => (
              <div
                key={entryIndex}
                className="space-y-3 border-b border-charcoal/10 pb-4"
              >
                <p className="text-[11px] text-charcoal/45">
                  Milestone {entryIndex + 1}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Date / period">
                    <input
                      className={inputClass}
                      value={entry.date}
                      disabled={readOnly}
                      onChange={(e) => {
                        const timeline = [...project.timeline];
                        timeline[entryIndex] = {
                          ...timeline[entryIndex],
                          date: e.target.value,
                        };
                        updateProject(index, { timeline });
                      }}
                    />
                  </AdminField>
                  <AdminField label="Title">
                    <input
                      className={inputClass}
                      value={entry.title}
                      disabled={readOnly}
                      onChange={(e) => {
                        const timeline = [...project.timeline];
                        timeline[entryIndex] = {
                          ...timeline[entryIndex],
                          title: e.target.value,
                        };
                        updateProject(index, { timeline });
                      }}
                    />
                  </AdminField>
                </div>
                <AdminField label="Update">
                  <textarea
                    className={textareaClass}
                    rows={2}
                    value={entry.body ?? ""}
                    disabled={readOnly}
                    onChange={(e) => {
                      const timeline = [...project.timeline];
                      timeline[entryIndex] = {
                        ...timeline[entryIndex],
                        body: e.target.value,
                      };
                      updateProject(index, { timeline });
                    }}
                  />
                </AdminField>
              </div>
            ))}
            <AddRemoveButtons
              readOnly={readOnly}
              canRemove={project.timeline.length > 0}
              onAdd={() =>
                updateProject(index, {
                  timeline: [
                    ...project.timeline,
                    { date: "", title: "", body: "" },
                  ],
                })
              }
              onRemove={() =>
                updateProject(index, {
                  timeline: project.timeline.slice(0, -1),
                })
              }
            />
          </div>

          {!readOnly && onSave && (
            <div className="border-t border-charcoal/10 pt-6">
              <SaveButton
                saving={saving}
                label={
                  project.title.trim()
                    ? `Save ${project.title}`
                    : `Save project ${index + 1}`
                }
                onClick={onSave}
              />
            </div>
          )}
        </div>
      ))}

      <AddRemoveButtons
        readOnly={readOnly}
        canRemove={draft.length > 0}
        onAdd={() => setDraft([...draft, blankProject()])}
        onRemove={() => setDraft(draft.slice(0, -1))}
      />
    </div>
  );
}
