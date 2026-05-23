import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { venturesConnectConfig } from "@/lib/data/connect-ventures";

export const metadata = {
  title: "Ventures & Partnerships",
  description:
    "Connect with Afari Trails Ventures — hospitality, conservation, community, agriculture, and aligned partnerships across Africa.",
};

export default function VenturesConnectPage() {
  return <ConnectPageView config={venturesConnectConfig} />;
}
