import { ConnectClosing } from "@/components/connect/ConnectClosing";
import { ConnectDirect } from "@/components/connect/ConnectDirect";
import { ConnectForm } from "@/components/connect/ConnectForm";
import { ConnectHero } from "@/components/connect/ConnectHero";
import { ConnectIntro } from "@/components/connect/ConnectIntro";
import { ConnectNewsletter } from "@/components/connect/ConnectNewsletter";
import { PartnerCollaborators } from "@/components/ventures/partner/PartnerCollaborators";
import { PartnerVision } from "@/components/ventures/partner/PartnerVision";
import type { ConnectPageConfig } from "@/types/connect-page";

type PartnerConnectPageViewProps = {
  config: ConnectPageConfig;
};

/** Unified partner / get-in-touch page — submissions use source `contact`. */
export function PartnerConnectPageView({ config }: PartnerConnectPageViewProps) {
  return (
    <>
      <ConnectHero config={config} />
      <ConnectIntro config={config} compact />
      <PartnerVision />
      <PartnerCollaborators />
      <ConnectForm config={config} source="contact" compact />
      <ConnectDirect config={config} compact />
      {config.newsletter && <ConnectNewsletter config={config} />}
      <ConnectClosing config={config} compact />
    </>
  );
}
