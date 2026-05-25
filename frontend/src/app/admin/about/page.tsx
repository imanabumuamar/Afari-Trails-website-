import { AboutContentEditor } from "@/components/admin/about/AboutContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminAboutPage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const readOnly = role ? !hasPermission(role, "content:about:write") : true;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">About page</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You can view about page content. Ask a super admin for editor access to make changes."
            : "Edit every section on /about — hero, brand story, visual strip, philosophy, vision, and contact CTA."}
        </p>
      </div>
      <AboutContentEditor readOnly={readOnly} />
    </div>
  );
}
