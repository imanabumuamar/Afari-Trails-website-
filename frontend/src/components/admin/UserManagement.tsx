"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { env } from "@/config/env";
import type { ContentAccessLevel } from "@/lib/auth/content-areas";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, type Role } from "@/lib/auth/roles";

type ContentAreaOption = { id: string; label: string };

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  contentAreas?: string[];
  accessLevel?: ContentAccessLevel;
  createdAt: string;
};

type UsersPayload = {
  users: AdminUser[];
  assignableRoles: Role[];
  contentAreas: ContentAreaOption[];
};

const emptyForm = {
  email: "",
  password: "",
  name: "",
  role: "editor" as Role,
  contentAreas: [] as string[],
  accessLevel: "edit" as ContentAccessLevel,
};

function apiUrl(path: string) {
  return `${env.apiUrl.replace(/\/$/, "")}${path}`;
}

async function staffFetch(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(apiUrl(path), { ...init, headers });
}

function formatAreas(user: AdminUser, catalog: ContentAreaOption[]) {
  const ids = user.contentAreas ?? [];
  if (user.role === "super_admin") return "All sections";
  if (!ids.length) return "Role default";
  const labels = ids
    .map((id) => catalog.find((a) => a.id === id)?.label ?? id)
    .join(", ");
  const level =
    user.accessLevel === "view" || user.role === "viewer" ? "view only" : "can edit";
  return `${labels} (${level})`;
}

function ContentAreasPicker({
  areas,
  selected,
  accessLevel,
  role,
  onAreasChange,
  onAccessChange,
}: {
  areas: ContentAreaOption[];
  selected: string[];
  accessLevel: ContentAccessLevel;
  role: Role;
  onAreasChange: (ids: string[]) => void;
  onAccessChange: (level: ContentAccessLevel) => void;
}) {
  if (role === "super_admin") {
    return (
      <p className="text-sm text-charcoal/60">
        Super admins have full access to every CMS section and user management.
      </p>
    );
  }

  function toggle(id: string) {
    onAreasChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id],
    );
  }

  const effectiveAccess: ContentAccessLevel =
    role === "viewer" ? "view" : accessLevel;

  const allSelected = selected.length === areas.length && areas.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onAreasChange(allSelected ? [] : areas.map((a) => a.id))
          }
          className="border border-charcoal/30 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-charcoal/75 hover:border-charcoal/60"
        >
          {allSelected ? "Clear all" : "Select all sections"}
        </button>
        <span className="text-xs text-charcoal/50">
          {selected.length} of {areas.length} selected
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["view", "edit"] as ContentAccessLevel[]).map((level) => (
          <button
            key={level}
            type="button"
            disabled={role === "viewer"}
            onClick={() => onAccessChange(level)}
            className={`border px-3 py-1.5 text-xs uppercase tracking-[0.12em] disabled:opacity-40 ${
              effectiveAccess === level
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
            }`}
          >
            {level === "view" ? "View only" : "Can edit"}
          </button>
        ))}
      </div>
      {role === "viewer" && (
        <p className="text-xs text-charcoal/55">Viewer role is always view-only.</p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {areas.map((area) => (
          <label
            key={area.id}
            className="flex cursor-pointer items-center gap-2 rounded border border-charcoal/15 bg-beige px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(area.id)}
              onChange={() => toggle(area.id)}
              className="accent-charcoal"
            />
            {area.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function UserManagement() {
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken;

  const [data, setData] = useState<UsersPayload | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAreas, setEditAreas] = useState<string[]>([]);
  const [editAccess, setEditAccess] = useState<ContentAccessLevel>("edit");
  const [currentPassword, setCurrentPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await staffFetch("/staff/users", token);
    setLoading(false);

    if (!res.ok) {
      setStatus(
        res.status === 403
          ? "Only super admins can manage users."
          : "Could not load users. Is the API running on port 4000?",
      );
      return;
    }

    const json = (await res.json()) as UsersPayload;
    setData(json);
  }, [token]);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    void load();
  }, [load, sessionStatus]);

  function requireCurrentPassword() {
    if (currentPassword.trim().length < 1) {
      setStatus("Enter your current super admin password to continue.");
      return false;
    }
    return true;
  }

  function validateAreas(role: Role, areas: string[]) {
    if (role === "super_admin") return true;
    if (!areas.length) {
      setStatus("Select at least one content section for this user.");
      return false;
    }
    return true;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !requireCurrentPassword()) return;
    if (!validateAreas(form.role, form.contentAreas)) return;

    setStatus("Creating user…");
    const res = await staffFetch("/staff/users", token, {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        name: form.name,
        role: form.role,
        contentAreas: form.contentAreas,
        accessLevel: form.role === "viewer" ? "view" : form.accessLevel,
        currentPassword,
      }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setStatus(err.error ?? "Could not create user.");
      return;
    }

    const createdRole = form.role;
    setForm(emptyForm);
    setStatus(
      `${ROLE_LABELS[createdRole]} created. They can sign in at /admin/login.`,
    );
    await load();
  }

  function startEditAccess(user: AdminUser) {
    setEditingId(user.id);
    setEditAreas(user.contentAreas ?? []);
    setEditAccess(
      user.accessLevel === "view" || user.role === "viewer" ? "view" : "edit",
    );
  }

  async function saveEditAccess(user: AdminUser) {
    if (!token || !requireCurrentPassword()) return;
    if (user.role !== "super_admin" && !validateAreas(user.role as Role, editAreas)) {
      return;
    }

    setStatus("Updating access…");
    const res = await staffFetch("/staff/users", token, {
      method: "PATCH",
      body: JSON.stringify({
        id: user.id,
        contentAreas: editAreas,
        accessLevel: user.role === "viewer" ? "view" : editAccess,
        currentPassword,
      }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setStatus(err.error ?? "Could not update access.");
      return;
    }

    setEditingId(null);
    setStatus("Content access updated. Ask them to sign out and back in.");
    await load();
  }

  async function updateRole(userId: string, role: Role) {
    if (!token || !requireCurrentPassword()) return;

    setStatus("Updating role…");
    const res = await staffFetch("/staff/users", token, {
      method: "PATCH",
      body: JSON.stringify({ id: userId, role, currentPassword }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setStatus(err.error ?? "Could not update user.");
      return;
    }

    setStatus(`Role updated to ${ROLE_LABELS[role]}.`);
    await load();
  }

  async function resetPassword(userId: string, email: string) {
    if (!token || !requireCurrentPassword()) return;

    const password = window.prompt(`New password for ${email} (min 10 characters):`);
    if (!password) return;
    if (password.length < 10) {
      setStatus("Password must be at least 10 characters.");
      return;
    }

    setStatus("Resetting password…");
    const res = await staffFetch("/staff/users", token, {
      method: "PATCH",
      body: JSON.stringify({ id: userId, password, currentPassword }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setStatus(err.error ?? "Could not reset password.");
      return;
    }

    setStatus(`Password updated for ${email}.`);
  }

  async function removeUser(userId: string, email: string) {
    if (!token || !requireCurrentPassword()) return;
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return;

    setStatus("Deleting user…");
    const res = await staffFetch(`/staff/users/${userId}`, token, {
      method: "DELETE",
      body: JSON.stringify({ currentPassword }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setStatus(err.error ?? "Could not delete user.");
      return;
    }

    setStatus("User deleted.");
    await load();
  }

  if (sessionStatus === "loading" || loading) {
    return <p className="text-sm text-charcoal/60">Loading users…</p>;
  }

  if (!token) {
    return (
      <p className="text-sm text-charcoal/65">
        Session expired. <a href="/admin/login" className="text-gold underline">Sign in again</a>.
      </p>
    );
  }

  if (!data) {
    return <p className="text-sm text-red-800/80">{status || "Failed to load."}</p>;
  }

  if (data.assignableRoles.length === 0) {
    return (
      <p className="text-sm text-charcoal/65">
        Your account cannot manage users. Sign in as a super admin.
      </p>
    );
  }

  const catalog = data.contentAreas;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-3xl font-light">Users & access</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          Super admins only. Choose which CMS sections each person can open, and whether
          they can edit or only view. Sensitive actions require your current password.
        </p>
      </div>

      <section className="rounded border border-charcoal/15 bg-ivory p-6">
        <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
          Security confirmation
        </h3>
        <p className="mt-2 text-sm text-charcoal/60">
          Enter your current password before creating, editing, or deleting users.
        </p>
        <div className="mt-4 max-w-md">
          <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/55">
            Your current password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="overflow-x-auto rounded border border-charcoal/15">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.15em] text-charcoal/55">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">CMS access</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="border-t border-charcoal/10 align-top">
                <td className="px-4 py-3">
                  <div>{user.email}</div>
                  {user.name && (
                    <div className="text-xs text-charcoal/55">{user.name}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value as Role)}
                    className="border border-charcoal/20 bg-beige px-2 py-1.5 text-xs"
                  >
                    {data.assignableRoles.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {editingId === user.id && user.role !== "super_admin" ? (
                    <div className="space-y-3">
                      <ContentAreasPicker
                        areas={catalog}
                        selected={editAreas}
                        accessLevel={editAccess}
                        role={user.role as Role}
                        onAreasChange={setEditAreas}
                        onAccessChange={setEditAccess}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveEditAccess(user)}
                          className="bg-charcoal px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ivory"
                        >
                          Save access
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-xs uppercase tracking-[0.12em] text-charcoal/60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-charcoal/75">{formatAreas(user, catalog)}</p>
                  )}
                </td>
                <td className="space-x-3 px-4 py-3 text-right whitespace-nowrap">
                  {user.role !== "super_admin" && editingId !== user.id && (
                    <button
                      type="button"
                      onClick={() => startEditAccess(user)}
                      className="text-xs uppercase tracking-[0.12em] text-charcoal/70 hover:text-charcoal"
                    >
                      Edit access
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => resetPassword(user.id, user.email)}
                    className="text-xs uppercase tracking-[0.12em] text-charcoal/70 hover:text-charcoal"
                  >
                    Reset password
                  </button>
                  <button
                    type="button"
                    onClick={() => removeUser(user.id, user.email)}
                    className="text-xs uppercase tracking-[0.12em] text-red-900/70 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded border border-charcoal/15 bg-ivory p-6">
        <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
          Add staff member
        </h3>

        <form onSubmit={handleCreate} className="mt-6 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/55">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/55">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/55">
                Password
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/55">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => {
                  const role = e.target.value as Role;
                  setForm({
                    ...form,
                    role,
                    accessLevel: role === "viewer" ? "view" : form.accessLevel,
                  });
                }}
                className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
              >
                {data.assignableRoles.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Content sections
            </h4>
            <div className="mt-4">
              <ContentAreasPicker
                areas={catalog}
                selected={form.contentAreas}
                accessLevel={form.accessLevel}
                role={form.role}
                onAreasChange={(contentAreas) => setForm({ ...form, contentAreas })}
                onAccessChange={(accessLevel) => setForm({ ...form, accessLevel })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory"
          >
            Create {ROLE_LABELS[form.role].toLowerCase()}
          </button>
        </form>
      </section>

      {status && (
        <p className="text-sm text-charcoal/70" role="status">
          {status}
        </p>
      )}

      <section className="rounded border border-charcoal/15 bg-ivory p-6">
        <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
          Role notes
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
            <div key={role}>
              <dt className="text-sm font-medium text-charcoal">{ROLE_LABELS[role]}</dt>
              <dd className="mt-1 text-sm text-charcoal/60">{ROLE_DESCRIPTIONS[role]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
