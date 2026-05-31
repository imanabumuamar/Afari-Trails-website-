import { JournalContentEditor } from "@/components/admin/journal/JournalContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminJournalPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;
  const readOnly = role
    ? !hasPermission(role, "content:journal:write", permissions)
    : true;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-3xl font-light">Journal</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You have read-only access."
            : "Edit the journal page and every story — published (live) or draft. Use the Published filter to find live stories."}
        </p>
      </div>

      <JournalContentEditor readOnly={readOnly} />
    </div>
  );
}
