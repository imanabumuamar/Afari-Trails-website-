import { redirect } from "next/navigation";

/** @deprecated Use /admin/homepage */
export default function LegacyStoreAdminRedirect() {
  redirect("/admin/homepage");
}
