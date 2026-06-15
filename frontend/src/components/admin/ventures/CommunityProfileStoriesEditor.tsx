"use client";

import {
  applyCommunityStoryListingStatus,
  COMMUNITY_STORY_LISTING_OPTIONS,
  getCommunityStoryListingStatus,
  type CommunityStoryProfile,
} from "@/lib/ventures/community-stories-shared";

const inputClass =
  "w-full border border-charcoal/20 bg-ivory px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none";
const textareaClass = `${inputClass} resize-y`;

type CommunityProfileStoriesEditorProps = {
  profiles: CommunityStoryProfile[];
  readOnly?: boolean;
  onChange: (profiles: CommunityStoryProfile[]) => void;
};

export function CommunityProfileStoriesEditor({
  profiles,
  readOnly = false,
  onChange,
}: CommunityProfileStoriesEditorProps) {
  function updateProfile(
    index: number,
    patch: Partial<CommunityStoryProfile>,
  ) {
    const next = [...profiles];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  return (
    <div className="space-y-4 border-t border-charcoal/10 pt-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/55">
          Default story cards
        </p>
        <p className="mt-2 text-sm text-charcoal/60">
          These cards show when no archive stories are selected above. Publish or
          hide each card individually.
        </p>
      </div>

      {profiles.map((profile, index) => (
        <div
          key={`${profile.name}-${index}`}
          className="space-y-4 rounded border border-charcoal/12 bg-beige/20 p-5"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-charcoal/50">
            Story {index + 1}
            {profile.name ? ` · ${profile.name}` : ""}
          </p>

          <div className="space-y-3">
            {COMMUNITY_STORY_LISTING_OPTIONS.map((option) => {
              const selected =
                getCommunityStoryListingStatus(profile) === option.value;
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
                    name={`community-profile-status-${index}`}
                    className="mt-0.5 shrink-0"
                    checked={selected}
                    disabled={readOnly}
                    onChange={() =>
                      updateProfile(
                        index,
                        applyCommunityStoryListingStatus(profile, option.value),
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-charcoal/55">
              Name
              <input
                className={`${inputClass} mt-1`}
                value={profile.name}
                disabled={readOnly}
                onChange={(e) => updateProfile(index, { name: e.target.value })}
              />
            </label>
            <label className="block text-xs text-charcoal/55">
              Role
              <input
                className={`${inputClass} mt-1`}
                value={profile.role}
                disabled={readOnly}
                onChange={(e) => updateProfile(index, { role: e.target.value })}
              />
            </label>
          </div>

          <label className="block text-xs text-charcoal/55">
            Quote
            <textarea
              className={`${textareaClass} mt-1`}
              rows={3}
              value={profile.quote}
              disabled={readOnly}
              onChange={(e) => updateProfile(index, { quote: e.target.value })}
            />
          </label>

          <label className="block text-xs text-charcoal/55">
            Image URL
            <input
              className={`${inputClass} mt-1`}
              value={profile.image}
              disabled={readOnly}
              onChange={(e) => updateProfile(index, { image: e.target.value })}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
