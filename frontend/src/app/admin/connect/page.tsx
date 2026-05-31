import { ConnectContentEditor } from "@/components/admin/connect/ConnectContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminConnectPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;
  const readOnly = role
    ? !hasPermission(role, "content:connect:write", permissions)
    : true;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">Connect pages</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You can view contact and expeditions connect content. Ask a super admin for editor access to make changes."
            : "Edit the main contact page and expeditions connect page — one save updates both."}
        </p>
      </div>
      <ConnectContentEditor readOnly={readOnly} />
    </div>
  );
}
