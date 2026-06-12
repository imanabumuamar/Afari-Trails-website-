import { PartnerConnectPageView } from "@/components/connect/PartnerConnectPageView";
import { getConnectContent } from "@/services/content/connect";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Connect With Us",
  description:
    "Partner with Afari Trails or get in touch — hospitality, conservation, collaborations, and meaningful connections across Africa.",
};

export default async function ConnectPage() {
  const content = await getConnectContent();
  return <PartnerConnectPageView config={content.contact} />;
}
