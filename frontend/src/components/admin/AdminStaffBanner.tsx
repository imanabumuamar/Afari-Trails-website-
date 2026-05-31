import Link from "next/link";
import type { Role } from "@/lib/auth/roles";
import { ROLE_LABELS } from "@/lib/auth/roles";

type AdminStaffBannerProps = {
  role: Role;
  canManageUsers: boolean;
};

export function AdminStaffBanner({ role, canManageUsers }: AdminStaffBannerProps) {
  if (canManageUsers) {
    return (
      <div className="mb-8 flex flex-col gap-3 rounded border border-gold/30 bg-gold/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-charcoal/55">
            Super admin
          </p>
          <p className="mt-1 text-sm text-charcoal">
            Add staff and choose which CMS sections each person can view or edit.
          </p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex shrink-0 items-center justify-center bg-charcoal px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory hover:bg-charcoal/90"
        >
          Manage users →
        </Link>
      </div>
    );
  }

  return (
    <p className="mb-6 text-xs text-charcoal/50">
      Signed in as {ROLE_LABELS[role]}. Contact a super admin if you need access to
      more sections.
    </p>
  );
}
