type AdminFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminField({ label, children, className = "" }: AdminFieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs uppercase tracking-[0.2em] text-charcoal/55">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export const inputClass =
  "w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60";

export const textareaClass =
  "w-full border border-charcoal/20 bg-beige px-4 py-3 text-sm disabled:opacity-60";

export function SaveButton({
  saving,
  label = "Save section",
  onClick,
}: {
  saving: boolean;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={saving}
      onClick={onClick}
      className="bg-charcoal px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ivory disabled:opacity-40"
    >
      {saving ? "Saving…" : label}
    </button>
  );
}

export function AddRemoveButtons({
  onAdd,
  onRemove,
  canRemove,
  readOnly,
}: {
  onAdd: () => void;
  onRemove: () => void;
  canRemove: boolean;
  readOnly?: boolean;
}) {
  if (readOnly) return null;
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onAdd}
        className="border border-charcoal/25 px-3 py-1.5 text-xs uppercase tracking-[0.15em] hover:border-charcoal"
        aria-label="Add item"
      >
        +
      </button>
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="border border-charcoal/25 px-3 py-1.5 text-xs uppercase tracking-[0.15em] hover:border-charcoal disabled:opacity-30"
        aria-label="Remove item"
      >
        −
      </button>
    </div>
  );
}
