import type { InquirySource } from "@/lib/inquiry/submit-inquiry";
import type { ConnectPageConfig } from "@/types/connect-page";
import { CONNECT_PAGE_SECTIONS } from "@/lib/connect/connect-page-sections";
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
  const pageKey =
    inquirySource === "expeditions-connect"
      ? "expeditions"
      : inquirySource === "contact"
        ? "contact"
        : null;
  const sections = pageKey ? CONNECT_PAGE_SECTIONS[pageKey] : null;
  const showGallery = sections
    ? sections.gallery
    : config.gallery.length > 0;

  return (
    <>
      <ConnectHero config={config} />
      <ConnectIntro config={config} compact={isVentures} />
      {sections?.categories && <ConnectCategories config={config} />}
      <ConnectForm config={config} source={inquirySource} compact={isVentures} />
      <ConnectDirect config={config} compact={isVentures} />
      {showGallery && <ConnectGallery config={config} />}
      {config.newsletter && <ConnectNewsletter config={config} />}
      <ConnectClosing config={config} compact={isVentures} />
    </>
  );
}
