import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { getConnectContent } from "@/services/content/connect";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plan Your Journey",
  description:
    "Design your Afari Trails expedition — custom safaris, private journeys, and curated travel across Zambia and beyond.",
};

export default async function ExpeditionsConnectPage() {
  const content = await getConnectContent();
  return (
    <ConnectPageView
      config={content.expeditions}
      inquirySource="expeditions-connect"
    />
  );
}
