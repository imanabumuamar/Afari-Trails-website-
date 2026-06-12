import { StoreAdminPage } from "@/components/admin/store/StoreAdminPage";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminStoreCollectionsPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;
  const readOnly = role
    ? !hasPermission(role, "content:store:write", permissions)
    : true;

  return <StoreAdminPage section="collections" readOnly={readOnly} />;
}
