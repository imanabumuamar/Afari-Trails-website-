import { VenturesStructuredEditor } from "@/components/admin/ventures/VenturesStructuredEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminVenturesPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const readOnly = role ? !hasPermission(role, "content:ventures:write") : true;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Ventures content</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          {readOnly
            ? "You have read-only access. Contact a super admin to request edit permissions."
            : "Edit venture pages section by section — hero, stats, focus areas, images, and more."}
        </p>
      </div>

      <VenturesStructuredEditor readOnly={readOnly} />
    </div>
  );
}
