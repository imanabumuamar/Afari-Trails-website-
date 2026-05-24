import { redirect } from "next/navigation";
import { UserManagement } from "@/components/admin/UserManagement";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffRole } from "@/lib/auth/staff-session";

export default async function AdminUsersPage() {
  const role = await getStaffRole();

  if (!role || !hasPermission(role, "users:read")) {
    redirect("/admin/forbidden");
  }

  return <UserManagement />;
}
