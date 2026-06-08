import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { venturesConnectConfig as defaultConfig } from "@/lib/data/connect-ventures";
import { mergeConnectPage } from "@/services/content/connect";
import { getVenturePageContent } from "@/services/content/ventures";
import type { ConnectPageConfig } from "@/types/connect-page";

export const metadata = {
  title: "Ventures & Partnerships",
  description:
    "Connect with Afari Trails Ventures — hospitality, conservation, community, agriculture, and aligned partnerships across Africa.",
};

export default async function VenturesConnectPage() {
  const content = await getVenturePageContent("connect");
  const remote = content.venturesConnectConfig as Partial<ConnectPageConfig> | undefined;
  const config = mergeConnectPage(defaultConfig, remote);

  return (
    <ConnectPageView
      config={config}
      inquirySource="ventures-connect"
    />
  );
}
