import { SupportPage, SupportSections } from "@/components/support/SupportPage";
import { getSupportContent } from "@/services/content/support";

export const metadata = {
  title: "Shipping",
  description:
    "Shipping information for Afari Trails — processing times, regional and international delivery, and care in transit.",
};

export default async function ShippingPage() {
  const { shipping } = await getSupportContent();

  return (
    <SupportPage
      label={shipping.label}
      title={shipping.title}
      intro={shipping.intro}
      relatedLinks={shipping.relatedLinks}
    >
      <SupportSections sections={shipping.sections} />
    </SupportPage>
  );
}
