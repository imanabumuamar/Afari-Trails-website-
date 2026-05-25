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
  return (
    <>
      <ConnectHero config={config} />
      <ConnectIntro config={config} />
      <ConnectCategories config={config} />
      <ConnectForm config={config} source={inquirySource} />
      <ConnectDirect config={config} />
      <ConnectGallery config={config} />
      {config.newsletter && <ConnectNewsletter config={config} />}
      <ConnectClosing config={config} />
    </>
  );
}
