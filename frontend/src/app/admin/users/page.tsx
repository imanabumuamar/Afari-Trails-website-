import { redirect } from "next/navigation";
import { UserManagement } from "@/components/admin/UserManagement";
import { isSuperAdmin } from "@/lib/auth/rbac";
import { getStaffRole } from "@/lib/auth/staff-session";

export default async function AdminUsersPage() {
  const role = await getStaffRole();

  if (!isSuperAdmin(role)) {
    redirect("/admin/forbidden");
  }

  return <UserManagement />;
}
