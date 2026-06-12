import { ArchiveContentEditor } from "@/components/admin/archive/ArchiveContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminArchivePage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;
  const readOnly = role
    ? !hasPermission(role, "content:archive:write", permissions)
    : true;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">Archive</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You can view archive content. Ask a super admin for editor access to make changes."
            : "Edit the archive page — hero, collections, photograph of the month, latest moments, submit CTA, and every gallery image."}
        </p>
      </div>
      <ArchiveContentEditor readOnly={readOnly} />
    </div>
  );
}
