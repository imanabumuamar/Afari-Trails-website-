import type { Role } from "@/lib/auth/roles";
import { ROLE_LABELS } from "@/lib/auth/roles";

type AdminStaffBannerProps = {
  role: Role;
};

export function AdminStaffBanner({ role }: AdminStaffBannerProps) {
  if (role === "super_admin") {
    return null;
  }

  return (
    <p className="mb-6 text-xs text-charcoal/50">
      Signed in as {ROLE_LABELS[role]}. Contact a super admin if you need access to
      more sections.
    </p>
  );
}
