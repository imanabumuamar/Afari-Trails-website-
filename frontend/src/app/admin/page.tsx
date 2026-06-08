import Link from "next/link";
import { CMS_CONTENT_AREAS } from "@/lib/auth/content-areas";
import { hasPermission, isSuperAdmin, roleAtLeast } from "@/lib/auth/rbac";
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
  store: "Edit hero, collections, curated picks, products, and World of Afari.",
  support: "Edit FAQ, shipping policy, and returns — all in one place.",
  connect:
    "Edit contact and expeditions connect — hero, form copy, categories, and gallery.",
};

export default async function AdminDashboardPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;
  const canManageUsers = isSuperAdmin(role);
  const canViewMessages = role ? roleAtLeast(role, "admin") : false;

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

      <section className="rounded border border-gold/30 bg-gold/10 p-6 text-sm text-charcoal/80">
        <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
          Local editing (read this first)
        </h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          <li>
            In Terminal, from the <strong className="font-normal">website</strong> folder, run{" "}
            <code className="text-[11px]">npm run dev</code> — not frontend-only.
          </li>
          <li>
            Wait until the log shows <strong className="font-normal">Ready</strong>, then open{" "}
            <Link href="/admin/login" className="text-gold hover:underline">
              admin login
            </Link>{" "}
            at <code className="text-[11px]">localhost:3000</code> (not 127.0.0.1).
          </li>
          <li>Pick a section below, edit, and click Save. Leave the dev terminal open.</li>
          <li>
            If something fails, run <code className="text-[11px]">npm run doctor</code> from the
            project folder.
          </li>
        </ol>
      </section>

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

        {canManageUsers && (
          <Link
            href="/admin/users"
            className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
          >
            <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Super admin
            </h3>
            <p className="mt-2 font-serif text-xl font-light">Users & access</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Add staff and choose which CMS sections each person can view or edit.
            </p>
          </Link>
        )}
      </div>

      {visibleSections.length === 0 && !canManageUsers && (
        <p className="text-sm text-charcoal/65">
          No CMS sections are assigned to your account. Ask a super admin to grant access.
        </p>
      )}

      {canManageUsers && (
        <section className="rounded border border-charcoal/10 bg-beige/50 p-6 text-sm text-charcoal/70">
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Quick start
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>
              Open{" "}
              <Link href="/admin/users" className="text-gold hover:underline">
                Users & access
              </Link>
              .
            </li>
            <li>Select which pages each editor or admin can open.</li>
            <li>Choose view-only or can edit for those sections.</li>
            <li>Staff must sign out and back in after you change their access.</li>
          </ol>
        </section>
      )}

      {role && (
        <p className="text-xs text-charcoal/45">{ROLE_DESCRIPTIONS[role]}</p>
      )}
    </div>
  );
}
