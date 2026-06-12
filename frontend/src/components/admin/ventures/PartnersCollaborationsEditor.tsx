"use client";

import {
  AddRemoveButtons,
  AdminField,
} from "@/components/admin/ventures/AdminField";
import { VentureImageField } from "@/components/admin/ventures/VentureImageField";
import type { VentureSlug } from "@/lib/data/venture-defaults";
import type {
  VenturePartnerLogo,
  VenturesPartnersCollaborations,
} from "@/types/ventures-partners";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

function blankPartner(index: number): VenturePartnerLogo {
  return {
    id: `partner-${index + 1}`,
    name: "Partner Logo",
    logo: "",
    href: "",
  };
}

type PartnersCollaborationsEditorProps = {
  slug: VentureSlug;
  draft: VenturesPartnersCollaborations;
  readOnly?: boolean;
  setDraft: (value: VenturesPartnersCollaborations) => void;
  onStatus: (message: string) => void;
};

export function PartnersCollaborationsEditor({
  slug,
  draft,
  readOnly = false,
  setDraft,
  onStatus,
}: PartnersCollaborationsEditorProps) {
  function updatePartner(index: number, patch: Partial<VenturePartnerLogo>) {
    const partners = [...draft.partners];
    partners[index] = { ...partners[index], ...patch };
    setDraft({ ...draft, partners });
  }

  return (
    <div className="space-y-8">
      <label
        className={`flex cursor-pointer gap-4 rounded border px-5 py-4 transition-colors ${
          draft.visible
            ? "border-safari-green/35 bg-ivory"
            : "border-charcoal/10 bg-ivory/60"
        } ${readOnly ? "cursor-default" : "hover:border-charcoal/25"}`}
      >
        <input
          type="checkbox"
          className="mt-1 shrink-0"
          checked={draft.visible}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-charcoal">
            Show section on live website
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-charcoal/55">
            When hidden, the Partners & Collaborations section is removed from
            the ventures page with no empty spacing.
          </span>
        </span>
      </label>

      <AdminField label="Section heading">
        <input
          className={inputClass}
          value={draft.heading}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
        />
      </AdminField>

      <AdminField label="Description">
        <textarea
          className={textareaClass}
          rows={4}
          value={draft.description}
          disabled={readOnly}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </AdminField>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Partner logos
          </p>
          {!readOnly && (
            <AddRemoveButtons
              onAdd={() =>
                setDraft({
                  ...draft,
                  partners: [...draft.partners, blankPartner(draft.partners.length)],
                })
              }
              onRemove={() =>
                setDraft({
                  ...draft,
                  partners: draft.partners.slice(0, -1),
                })
              }
              canRemove={draft.partners.length > 1}
            />
          )}
        </div>

        {draft.partners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="space-y-4 border border-charcoal/12 bg-beige/20 p-5"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/45">
              Partner {index + 1}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Display name">
                <input
                  className={inputClass}
                  value={partner.name}
                  disabled={readOnly}
                  onChange={(e) =>
                    updatePartner(index, { name: e.target.value })
                  }
                />
              </AdminField>
              <AdminField label="Link (optional)">
                <input
                  className={inputClass}
                  value={partner.href ?? ""}
                  disabled={readOnly}
                  placeholder="/contact or https://"
                  onChange={(e) =>
                    updatePartner(index, { href: e.target.value })
                  }
                />
              </AdminField>
            </div>

            <VentureImageField
              slug={slug}
              fieldPath={`venturesPartnersCollaborations.partners.${index}.logo`}
              label="Logo image"
              src={partner.logo ?? ""}
              alt={partner.name}
              readOnly={readOnly}
              onUploaded={(src) => updatePartner(index, { logo: src })}
              onStatus={onStatus}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="CTA label">
          <input
            className={inputClass}
            value={draft.ctaLabel}
            disabled={readOnly}
            onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
          />
        </AdminField>
        <AdminField label="CTA link">
          <input
            className={inputClass}
            value={draft.ctaHref}
            disabled={readOnly}
            onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
          />
        </AdminField>
      </div>
    </div>
  );
}
