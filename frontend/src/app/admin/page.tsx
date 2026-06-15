import Link from "next/link";
import { CMS_CONTENT_AREAS } from "@/lib/auth/content-areas";
import { hasPermission } from "@/lib/auth/rbac";
import { hasAnyInboxRead } from "@/lib/auth/inbox-categories";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/auth/roles";
import { getStaffSession } from "@/lib/auth/staff-session";

const SECTION_BLURBS: Record<string, string> = {
  homepage: "Edit hero, images, and copy on the main site.",
  ventures: "Edit all venture pages — copy, images, and section data.",
  expeditions:
    "Add expeditions, edit journeys, and pick which appear on the main page.",
  journal: "Edit the journal page, stories, featured articles, and images.",
  archive:
    "Edit collections, gallery images, Afari Lens copy, and submit page text.",
  about: "Edit hero, brand story, philosophy, vision pillars, and contact CTA.",
  store: "Edit page copy, collections, new arrivals, and store items.",
  support: "Edit FAQ, shipping policy, and returns — all in one place.",
  connect:
    "Edit contact and expeditions connect — hero, form copy, and newsletter text.",
};

export default async function AdminDashboardPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;
  const canViewMessages = role
    ? hasAnyInboxRead(role, permissions)
    : false;

  const visibleSections = CMS_CONTENT_AREAS.filter((area) =>
    role ? hasPermission(role, `content:${area.id}:read`, permissions) : false,
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Dashboard</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          {session?.user?.email && role && (
            <>
              Signed in as <span className="text-charcoal">{session.user.email}</span> (
              {ROLE_LABELS[role]}).
            </>
          )}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {visibleSections.map((area) => (
          <Link
            key={area.id}
            href={area.href}
            className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
          >
            <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
            <p className="mt-2 font-serif text-xl font-light">{area.label}</p>
            <p className="mt-2 text-sm text-charcoal/60">
              {SECTION_BLURBS[area.id] ?? "Edit this section."}
            </p>
          </Link>
        ))}

        {canViewMessages && (
          <Link
            href="/admin/messages"
            className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
          >
            <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Inbox
            </h3>
            <p className="mt-2 font-serif text-xl font-light">Messages</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Read contact, connect, partner, expedition, newsletter, and Afari
              Lens photo submissions.
            </p>
          </Link>
        )}

      </div>

      {visibleSections.length === 0 && (
        <p className="text-sm text-charcoal/65">
          No CMS sections are assigned to your account. Ask a super admin to grant access.
        </p>
      )}

      {role && (
        <p className="text-xs text-charcoal/45">{ROLE_DESCRIPTIONS[role]}</p>
      )}
    </div>
  );
}
