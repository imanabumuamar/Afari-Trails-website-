import { permanentRedirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function PartnerPage() {
  permanentRedirect(ROUTES.venturesConnect);
}
