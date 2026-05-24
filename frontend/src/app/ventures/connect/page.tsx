import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { venturesConnectConfig as defaultConfig } from "@/lib/data/connect-ventures";
import { getVenturePageContent } from "@/services/content/ventures";
import type { ConnectPageConfig } from "@/types/connect-page";

export const metadata = {
  title: "Ventures & Partnerships",
  description:
    "Connect with Afari Trails Ventures — hospitality, conservation, community, agriculture, and aligned partnerships across Africa.",
};

export default async function VenturesConnectPage() {
  const content = await getVenturePageContent("connect");
  const config = content.venturesConnectConfig as ConnectPageConfig;

  return <ConnectPageView config={config ?? defaultConfig} />;
}
