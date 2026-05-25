import { FaqList, SupportPage } from "@/components/support/SupportPage";
import { getSupportContent } from "@/services/content/support";

export const metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Afari Trails expeditions, ventures, store orders, and collaborations across Africa.",
};

export default async function FaqPage() {
  const { faq } = await getSupportContent();

  return (
    <SupportPage
      label={faq.label}
      title={faq.title}
      intro={faq.intro}
      relatedLinks={faq.relatedLinks}
    >
      <FaqList items={faq.items} />
    </SupportPage>
  );
}
