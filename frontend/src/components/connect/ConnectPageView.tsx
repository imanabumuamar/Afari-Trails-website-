import type { InquirySource } from "@/lib/inquiry/submit-inquiry";
import type { ConnectPageConfig } from "@/types/connect-page";
import { ConnectCategories } from "@/components/connect/ConnectCategories";
import { ConnectClosing } from "@/components/connect/ConnectClosing";
import { ConnectDirect } from "@/components/connect/ConnectDirect";
import { ConnectForm } from "@/components/connect/ConnectForm";
import { ConnectGallery } from "@/components/connect/ConnectGallery";
import { ConnectHero } from "@/components/connect/ConnectHero";
import { ConnectIntro } from "@/components/connect/ConnectIntro";
import { ConnectNewsletter } from "@/components/connect/ConnectNewsletter";

type ConnectPageViewProps = {
  config: ConnectPageConfig;
  inquirySource: InquirySource;
};

export function ConnectPageView({ config, inquirySource }: ConnectPageViewProps) {
  const isVentures = inquirySource === "ventures-connect";

  return (
    <>
      <ConnectHero config={config} />
      <ConnectIntro config={config} compact={isVentures} />
      {!isVentures && <ConnectCategories config={config} />}
      <ConnectForm config={config} source={inquirySource} compact={isVentures} />
      <ConnectDirect config={config} compact={isVentures} />
      <ConnectGallery config={config} />
      {config.newsletter && <ConnectNewsletter config={config} />}
      <ConnectClosing config={config} compact={isVentures} />
    </>
  );
}
