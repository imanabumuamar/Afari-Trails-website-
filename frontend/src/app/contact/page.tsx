import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { generalConnectConfig } from "@/lib/data/connect-general";

export const metadata = {
  title: "Connect With Us",
  description:
    "Begin the conversation with Afari Trails — expeditions, partnerships, media, and meaningful collaborations across Africa.",
};

export default function ConnectPage() {
  return <ConnectPageView config={generalConnectConfig} />;
}
