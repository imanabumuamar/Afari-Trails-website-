"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { AdminPasswordConfirmModal } from "@/components/admin/AdminPasswordConfirmModal";
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
  messageCategories?: string[];
  messageAccessLevel?: ContentAccessLevel;
  createdAt: string;
};

type UsersPayload = {
  users: AdminUser[];
  assignableRoles: Role[];
  contentAreas: ContentAreaOption[];
  messageCategories: ContentAreaOption[];
};

const emptyForm = {
  email: "",
  password: "",
  name: "",
  role: "editor" as Role,
  contentAreas: [] as string[],
  accessLevel: "edit" as ContentAccessLevel,
  messageCategories: [] as string[],
  messageAccessLevel: "edit" as ContentAccessLevel,
};

type PendingAction =
  | { kind: "create"; form: typeof emptyForm }
  | {
      kind: "updateAccess";
      user: AdminUser;
      areas: string[];
      access: ContentAccessLevel;
      messageCategories: string[];
      messageAccess: ContentAccessLevel;
    }
  | { kind: "updateRole"; userId: string; email: string; role: Role }
  | { kind: "resetPassword"; userId: string; email: string; password: string }
  | { kind: "delete"; userId: string; email: string };

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

function formatMessageAreas(user: AdminUser, catalog: ContentAreaOption[]) {
  const ids = user.messageCategories ?? [];
  if (user.role === "super_admin") return "All message types";
  if (!ids.length) return "None";
  const labels = ids
    .map((id) => catalog.find((a) => a.id === id)?.label ?? id)
    .join(", ");
  const level =
    user.messageAccessLevel === "view" || user.role === "viewer"
      ? "view only"
      : "can edit";
  return `${labels} (${level})`;
}

function modalCopy(action: PendingAction): {
  title: string;
  description: string;
  confirmLabel: string;
} {
  switch (action.kind) {
    case "create":
      return {
        title: "Create staff member",
        description: `Create ${ROLE_LABELS[action.form.role].toLowerCase()} account for ${action.form.email}?`,
        confirmLabel: "Create user",
      };
    case "updateAccess":
      return {
        title: "Update access",
        description: `Save content and message access for ${action.user.email}?`,
        confirmLabel: "Save access",
      };
    case "updateRole":
      return {
        title: "Change role",
        description: `Change ${action.email} to ${ROLE_LABELS[action.role]}?`,
        confirmLabel: "Change role",
      };
    case "resetPassword":
      return {
        title: "Reset password",
        description: `Set a new password for ${action.email}?`,
        confirmLabel: "Reset password",
      };
    case "delete":
      return {
        title: "Delete user",
        description: `Delete ${action.email}? This cannot be undone.`,
        confirmLabel: "Delete user",
      };
  }
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
        Super admins have full access to every CMS section.
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

function MessageCategoriesPicker({
  categories,
  selected,
  accessLevel,
  role,
  onCategoriesChange,
  onAccessChange,
}: {
  categories: ContentAreaOption[];
  selected: string[];
  accessLevel: ContentAccessLevel;
  role: Role;
  onCategoriesChange: (ids: string[]) => void;
  onAccessChange: (level: ContentAccessLevel) => void;
}) {
  if (role === "super_admin") {
    return (
      <p className="text-sm text-charcoal/60">
        Super admins can read and manage every message type.
      </p>
    );
  }

  function toggle(id: string) {
    onCategoriesChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  }

  const effectiveAccess: ContentAccessLevel =
    role === "viewer" ? "view" : accessLevel;

  const allSelected =
    selected.length === categories.length && categories.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            onCategoriesChange(
              allSelected ? [] : categories.map((category) => category.id),
            )
          }
          className="border border-charcoal/30 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-charcoal/75 hover:border-charcoal/60"
        >
          {allSelected ? "Clear all" : "Select all message types"}
        </button>
        <span className="text-xs text-charcoal/50">
          {selected.length} of {categories.length} selected
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
      <div className="grid gap-2 sm:grid-cols-2">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex cursor-pointer items-center gap-2 rounded border border-charcoal/15 bg-beige px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(category.id)}
              onChange={() => toggle(category.id)}
              className="accent-charcoal"
            />
            {category.label}
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
  const [editMessageCategories, setEditMessageCategories] = useState<string[]>([]);
  const [editMessageAccess, setEditMessageAccess] =
    useState<ContentAccessLevel>("edit");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddStaff, setShowAddStaff] = useState(false);

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

  function validateUserAccess(
    role: Role,
    areas: string[],
    messageCategories: string[],
  ) {
    if (role === "super_admin") return true;
    if (!areas.length && !messageCategories.length) {
      setStatus(
        "Select at least one content section or message category for this user.",
      );
      return false;
    }
    return true;
  }

  function openConfirm(action: PendingAction) {
    setConfirmError("");
    setPendingAction(action);
  }

  function closeConfirm() {
    if (confirmBusy) return;
    setPendingAction(null);
    setConfirmError("");
  }

  async function runConfirmedAction(currentPassword: string) {
    if (!token || !pendingAction) return;

    setConfirmBusy(true);
    setConfirmError("");

    try {
      if (pendingAction.kind === "create") {
        const { form: createForm } = pendingAction;
        const res = await staffFetch("/staff/users", token, {
          method: "POST",
          body: JSON.stringify({
            email: createForm.email,
            password: createForm.password,
            name: createForm.name,
            role: createForm.role,
            contentAreas: createForm.contentAreas,
            accessLevel:
              createForm.role === "viewer" ? "view" : createForm.accessLevel,
            messageCategories: createForm.messageCategories,
            messageAccessLevel:
              createForm.role === "viewer"
                ? "view"
                : createForm.messageAccessLevel,
            currentPassword,
          }),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          setConfirmError(err.error ?? "Could not create user.");
          return;
        }

        const createdRole = createForm.role;
        setForm(emptyForm);
        setShowAddStaff(false);
        setStatus(
          `${ROLE_LABELS[createdRole]} created. They can sign in at /admin/login.`,
        );
      }

      if (pendingAction.kind === "updateAccess") {
        const { user, areas, access, messageCategories, messageAccess } =
          pendingAction;
        const res = await staffFetch("/staff/users", token, {
          method: "PATCH",
          body: JSON.stringify({
            id: user.id,
            contentAreas: areas,
            accessLevel: user.role === "viewer" ? "view" : access,
            messageCategories,
            messageAccessLevel:
              user.role === "viewer" ? "view" : messageAccess,
            currentPassword,
          }),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          setConfirmError(err.error ?? "Could not update access.");
          return;
        }

        setEditingId(null);
        setStatus("Access updated. Ask them to sign out and back in.");
      }

      if (pendingAction.kind === "updateRole") {
        const { userId, role } = pendingAction;
        const res = await staffFetch("/staff/users", token, {
          method: "PATCH",
          body: JSON.stringify({ id: userId, role, currentPassword }),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          setConfirmError(err.error ?? "Could not update user.");
          return;
        }

        setStatus(`Role updated to ${ROLE_LABELS[role]}.`);
      }

      if (pendingAction.kind === "resetPassword") {
        const { userId, email, password } = pendingAction;
        const res = await staffFetch("/staff/users", token, {
          method: "PATCH",
          body: JSON.stringify({ id: userId, password, currentPassword }),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          setConfirmError(err.error ?? "Could not reset password.");
          return;
        }

        setStatus(`Password updated for ${email}.`);
      }

      if (pendingAction.kind === "delete") {
        const { userId } = pendingAction;
        const res = await staffFetch(`/staff/users/${userId}`, token, {
          method: "DELETE",
          body: JSON.stringify({ currentPassword }),
        });

        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          setConfirmError(err.error ?? "Could not delete user.");
          return;
        }

        setStatus("User deleted.");
      }

      setPendingAction(null);
      await load();
    } finally {
      setConfirmBusy(false);
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (
      !validateUserAccess(
        form.role,
        form.contentAreas,
        form.messageCategories,
      )
    ) {
      return;
    }
    openConfirm({ kind: "create", form: { ...form } });
  }

  function startEditAccess(user: AdminUser) {
    setEditingId(user.id);
    setEditAreas(user.contentAreas ?? []);
    setEditAccess(
      user.accessLevel === "view" || user.role === "viewer" ? "view" : "edit",
    );
    setEditMessageCategories(user.messageCategories ?? []);
    setEditMessageAccess(
      user.messageAccessLevel === "view" || user.role === "viewer"
        ? "view"
        : "edit",
    );
  }

  function saveEditAccess(user: AdminUser) {
    if (
      user.role !== "super_admin" &&
      !validateUserAccess(
        user.role as Role,
        editAreas,
        editMessageCategories,
      )
    ) {
      return;
    }
    openConfirm({
      kind: "updateAccess",
      user,
      areas: editAreas,
      access: editAccess,
      messageCategories: editMessageCategories,
      messageAccess: editMessageAccess,
    });
  }

  function requestRoleChange(user: AdminUser, role: Role) {
    if (role === user.role) return;
    openConfirm({
      kind: "updateRole",
      userId: user.id,
      email: user.email,
      role,
    });
  }

  function requestPasswordReset(userId: string, email: string) {
    const password = window.prompt(`New password for ${email} (min 10 characters):`);
    if (!password) return;
    if (password.length < 10) {
      setStatus("Password must be at least 10 characters.");
      return;
    }
    openConfirm({ kind: "resetPassword", userId, email, password });
  }

  function requestDelete(userId: string, email: string) {
    openConfirm({ kind: "delete", userId, email });
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

  const catalog = data.contentAreas;
  const messageCatalog = data.messageCategories ?? [];

  return (
    <div className="space-y-12">
      <AdminPasswordConfirmModal
        open={pendingAction !== null}
        title={pendingAction ? modalCopy(pendingAction).title : ""}
        description={pendingAction ? modalCopy(pendingAction).description : ""}
        confirmLabel={pendingAction ? modalCopy(pendingAction).confirmLabel : "Confirm"}
        busy={confirmBusy}
        error={confirmError}
        onCancel={closeConfirm}
        onConfirm={(password) => void runConfirmedAction(password)}
      />

      <div>
        <h2 className="font-serif text-3xl font-light">Users & access</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          Super admins only. Choose CMS sections and message types for each
          person, with separate view or edit access. Each action asks for your
          password to confirm.
        </p>
      </div>

      <section className="overflow-x-auto rounded border border-charcoal/15">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 bg-ivory px-4 py-3">
          <p className="text-xs uppercase tracking-[0.15em] text-charcoal/55">
            Staff accounts
          </p>
          {!showAddStaff && (
            <button
              type="button"
              onClick={() => setShowAddStaff(true)}
              className="bg-charcoal px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-charcoal/90"
            >
              Add more staff
            </button>
          )}
        </div>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ivory text-xs uppercase tracking-[0.15em] text-charcoal/55">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">CMS access</th>
              <th className="px-4 py-3 font-medium">Messages</th>
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
                  {user.role === "super_admin" ? (
                    <span className="text-charcoal/75">{ROLE_LABELS.super_admin}</span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        requestRoleChange(user, e.target.value as Role)
                      }
                      className="border border-charcoal/20 bg-beige px-2 py-1.5 text-xs"
                    >
                      {data.assignableRoles.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === user.id && user.role !== "super_admin" ? (
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/45">
                        Content sections
                      </p>
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
                <td className="px-4 py-3">
                  {editingId === user.id && user.role !== "super_admin" ? (
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-charcoal/45">
                        Message types
                      </p>
                      <MessageCategoriesPicker
                        categories={messageCatalog}
                        selected={editMessageCategories}
                        accessLevel={editMessageAccess}
                        role={user.role as Role}
                        onCategoriesChange={setEditMessageCategories}
                        onAccessChange={setEditMessageAccess}
                      />
                    </div>
                  ) : (
                    <p className="text-charcoal/75">
                      {formatMessageAreas(user, messageCatalog)}
                    </p>
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
                  {user.role !== "super_admin" && (
                    <>
                      <button
                        type="button"
                        onClick={() => requestPasswordReset(user.id, user.email)}
                        className="text-xs uppercase tracking-[0.12em] text-charcoal/70 hover:text-charcoal"
                      >
                        Reset password
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDelete(user.id, user.email)}
                        className="text-xs uppercase tracking-[0.12em] text-red-900/70 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showAddStaff && (
      <section className="rounded border border-charcoal/15 bg-ivory p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Add staff member
          </h3>
          <button
            type="button"
            onClick={() => {
              setShowAddStaff(false);
              setForm(emptyForm);
            }}
            className="text-xs uppercase tracking-[0.15em] text-charcoal/55 hover:text-charcoal"
          >
            Cancel
          </button>
        </div>

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
                    messageAccessLevel:
                      role === "viewer" ? "view" : form.messageAccessLevel,
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

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
              Message types
            </h4>
            <div className="mt-4">
              <MessageCategoriesPicker
                categories={messageCatalog}
                selected={form.messageCategories}
                accessLevel={form.messageAccessLevel}
                role={form.role}
                onCategoriesChange={(messageCategories) =>
                  setForm({ ...form, messageCategories })
                }
                onAccessChange={(messageAccessLevel) =>
                  setForm({ ...form, messageAccessLevel })
                }
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
      )}

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
          {data.assignableRoles.map((role) => (
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
