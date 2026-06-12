import { permanentRedirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function VenturesConnectPage() {
  permanentRedirect(ROUTES.contact);
}
