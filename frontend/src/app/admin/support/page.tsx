import { SupportContentEditor } from "@/components/admin/support/SupportContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminSupportPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const readOnly = role ? !hasPermission(role, "content:support:write") : true;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">Support pages</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You can view FAQ, shipping, and returns content. Ask a super admin for editor access to make changes."
            : "Edit FAQ, shipping, and returns — one save updates all three pages."}
        </p>
      </div>
      <SupportContentEditor readOnly={readOnly} />
    </div>
  );
}
