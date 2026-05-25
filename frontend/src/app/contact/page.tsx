import { ConnectPageView } from "@/components/connect/ConnectPageView";
import { getConnectContent } from "@/services/content/connect";

export const metadata = {
  title: "Connect With Us",
  description:
    "Begin the conversation with Afari Trails — expeditions, partnerships, media, and meaningful collaborations across Africa.",
};

export default async function ConnectPage() {
  const content = await getConnectContent();
  return (
    <ConnectPageView config={content.contact} inquirySource="contact" />
  );
}
