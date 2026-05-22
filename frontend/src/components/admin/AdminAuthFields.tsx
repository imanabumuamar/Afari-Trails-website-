"use client";

type AdminAuthFieldsProps = {
  secret: string;
  onSecretChange: (value: string) => void;
  onSaveSecret: () => void;
  hasSavedSecret: boolean;
};

export function AdminAuthFields({
  secret,
  onSecretChange,
  onSaveSecret,
  hasSavedSecret,
}: AdminAuthFieldsProps) {
  return (
    <div className="rounded border border-charcoal/15 bg-ivory p-6">
      <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
        Admin secret
      </label>
      <input
        type="password"
        value={secret}
        onChange={(e) => onSecretChange(e.target.value)}
        className="mt-2 w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm"
        placeholder="From ADMIN_SECRET in .env.local"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={onSaveSecret}
        className="mt-3 bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory"
      >
        {hasSavedSecret ? "Update session secret" : "Authenticate session"}
      </button>
      {hasSavedSecret && (
        <p className="mt-2 text-xs text-charcoal/50">Authenticated for this browser session.</p>
      )}
    </div>
  );
}
