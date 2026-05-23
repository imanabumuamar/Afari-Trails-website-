import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { expeditionsConnectConfig } from "@/lib/data/connect-expeditions";

export const metadata = {
  title: "Plan Your Journey",
  description:
    "Design your Afari Trails expedition — custom safaris, private journeys, and curated travel across Zambia and beyond.",
};

export default function ExpeditionsConnectPage() {
  return <ConnectPageView config={expeditionsConnectConfig} />;
}
