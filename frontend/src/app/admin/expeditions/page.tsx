import { ExpeditionsContentEditor } from "@/components/admin/expeditions/ExpeditionsContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminExpeditionsPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const readOnly = role ? !hasPermission(role, "content:expeditions:write") : true;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Expeditions</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You have read-only access."
            : "Manage the main expeditions page, choose featured journeys, and add or edit every expedition shown on View All Expeditions and detail pages."}
        </p>
      </div>

      <ExpeditionsContentEditor readOnly={readOnly} />
    </div>
  );
}
