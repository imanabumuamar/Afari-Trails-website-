import Link from "next/link";
import { hasPermission } from "@/lib/auth/rbac";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/auth/roles";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminDashboardPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const canManageUsers = role ? hasPermission(role, "users:read") : false;

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
        <Link
          href="/admin/homepage"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Homepage</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit hero, images, and copy on the main site.
          </p>
        </Link>

        <Link
          href="/admin/ventures"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Ventures</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit all venture pages — copy, images, and section data.
          </p>
        </Link>

        <Link
          href="/admin/expeditions"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Expeditions</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Add expeditions, edit journeys, and pick which appear on the main page.
          </p>
        </Link>

        <Link
          href="/admin/journal"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Journal</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit the journal page, stories, featured articles, and images.
          </p>
        </Link>

        <Link
          href="/admin/archive"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Archive</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit collections, gallery images, Afari Lens copy, and submit page text.
          </p>
        </Link>

        <Link
          href="/admin/about"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">About</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit hero, brand story, philosophy, vision pillars, and contact CTA.
          </p>
        </Link>

        <Link
          href="/admin/store"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Store</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit hero, collections, curated picks, products, and World of Afari.
          </p>
        </Link>

        <Link
          href="/admin/support"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Support</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit FAQ, shipping policy, and returns — all in one place.
          </p>
        </Link>

        <Link
          href="/admin/connect"
          className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
        >
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">Content</h3>
          <p className="mt-2 font-serif text-xl font-light">Connect</p>
          <p className="mt-2 text-sm text-charcoal/60">
            Edit contact and expeditions connect — hero, form copy, categories, and gallery.
          </p>
        </Link>

        {canManageUsers && (
          <Link
            href="/admin/users"
            className="rounded border border-charcoal/15 bg-ivory p-6 transition hover:border-gold/40"
          >
            <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Super admin
            </h3>
            <p className="mt-2 font-serif text-xl font-light">Users & roles</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Add admins, editors, and viewers. Only super admins see this.
            </p>
          </Link>
        )}
      </div>

      {canManageUsers && (
        <section className="rounded border border-charcoal/10 bg-beige/50 p-6 text-sm text-charcoal/70">
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Quick start
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Open <Link href="/admin/users" className="text-gold hover:underline">Users & roles</Link>.</li>
            <li>Click <strong>Add user</strong> — pick <strong>Editor</strong> for content-only staff.</li>
            <li>Pick <strong>Admin</strong> for full CMS access without user management.</li>
            <li>Use <strong>Super admin</strong> only for people who must add or remove accounts.</li>
          </ol>
        </section>
      )}

      {role && (
        <p className="text-xs text-charcoal/45">{ROLE_DESCRIPTIONS[role]}</p>
      )}
    </div>
  );
}
