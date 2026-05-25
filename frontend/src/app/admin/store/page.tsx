import { StoreContentEditor } from "@/components/admin/store/StoreContentEditor";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

export default async function AdminStorePage() {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const readOnly = role ? !hasPermission(role, "content:store:write") : true;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">Store</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          {readOnly
            ? "You can view store content. Ask a super admin for editor access to make changes."
            : "Edit the store hero, collections, curated essentials, World of Afari block, and all products."}
        </p>
      </div>
      <StoreContentEditor readOnly={readOnly} />
    </div>
  );
}
