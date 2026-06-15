"use client";

type AdminPasswordConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (password: string) => void;
};

export function AdminPasswordConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  busy = false,
  error,
  onCancel,
  onConfirm,
}: AdminPasswordConfirmModalProps) {
  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = new FormData(form).get("password");
    if (typeof password === "string" && password.trim()) {
      onConfirm(password);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-matte-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-password-confirm-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-charcoal/15 bg-ivory p-6 shadow-lg"
      >
        <h3
          id="admin-password-confirm-title"
          className="font-serif text-2xl font-light text-charcoal"
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/65">{description}</p>

        <div className="mt-6">
          <label
            htmlFor="admin-confirm-password"
            className="block text-xs uppercase tracking-[0.15em] text-charcoal/55"
          >
            Your current password
          </label>
          <input
            id="admin-confirm-password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            disabled={busy}
            className="mt-2 w-full border border-charcoal/20 bg-beige px-3 py-2 text-sm disabled:opacity-60"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-800/80" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 text-xs uppercase tracking-[0.15em] text-charcoal/60 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="bg-charcoal px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory disabled:opacity-50"
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
