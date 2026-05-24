"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { env } from "@/config/env";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, type Role } from "@/lib/auth/roles";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
};

type UsersPayload = {
  users: AdminUser[];
  assignableRoles: Role[];
};

const emptyForm = {
  email: "",
  password: "",
  name: "",
  role: "editor" as Role,
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

export function UserManagement() {
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken;

  const [data, setData] = useState<UsersPayload | null>(null);
  const [form, setForm] = useState(emptyForm);
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

  function setQuickRole(role: Role) {
    setForm((f) => ({ ...f, role }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setStatus("Creating user…");
    const res = await staffFetch("/staff/users", token, {
      method: "POST",
      body: JSON.stringify(form),
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

  async function updateRole(userId: string, role: Role) {
    if (!token) return;

    setStatus("Updating role…");
    const res = await staffFetch("/staff/users", token, {
      method: "PATCH",
      body: JSON.stringify({ id: userId, role }),
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
    if (!token) return;

    const password = window.prompt(
      `New password for ${email} (min 10 characters):`,
    );
    if (!password) return;
    if (password.length < 10) {
      setStatus("Password must be at least 10 characters.");
      return;
    }

    setStatus("Resetting password…");
    const res = await staffFetch("/staff/users", token, {
      method: "PATCH",
      body: JSON.stringify({ id: userId, password }),
    });

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setStatus(err.error ?? "Could not reset password.");
      return;
    }

    setStatus(`Password updated for ${email}.`);
  }

  async function removeUser(userId: string, email: string) {
    if (!token) return;
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return;

    setStatus("Deleting user…");
    const res = await staffFetch(`/staff/users/${userId}`, token, {
      method: "DELETE",
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
        Session expired.{" "}
        <a href="/admin/login" className="text-gold underline">
          Sign in again
        </a>
        .
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

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-3xl font-light">Users & roles</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          Stored in <strong>MongoDB</strong>. Add admins and editors who sign in
          at <code className="text-xs">/admin/login</code>.
        </p>
      </div>

      <section className="overflow-x-auto rounded border border-charcoal/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.15em] text-charcoal/55">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id} className="border-t border-charcoal/10">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-charcoal/70">{user.name ?? "—"}</td>
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
                <td className="space-x-3 px-4 py-3 text-right whitespace-nowrap">
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
          Add admin or editor
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["editor", "admin", "super_admin"] as Role[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setQuickRole(role)}
              className={`border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                form.role === role
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreate} className="mt-6 grid gap-4 sm:grid-cols-2">
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
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm"
            >
              {data.assignableRoles.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory"
            >
              Create {ROLE_LABELS[form.role].toLowerCase()}
            </button>
          </div>
        </form>
      </section>

      {status && (
        <p className="text-sm text-charcoal/70" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
