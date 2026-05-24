import { PartnerFormClient } from "@/components/ventures/partner/PartnerFormClient";
import { partnerForm as defaultPartnerForm } from "@/lib/data/partner";
import { getVenturePageContent } from "@/services/content/ventures";

export async function PartnerForm() {
  const content = await getVenturePageContent("partner");
  const partnerForm = content.partnerForm as typeof defaultPartnerForm;

  return <PartnerFormClient partnerForm={partnerForm} />;
}
