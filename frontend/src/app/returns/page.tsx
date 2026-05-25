import { SupportPage, SupportSections } from "@/components/support/SupportPage";
import { getSupportContent } from "@/services/content/support";

export const metadata = {
  title: "Returns",
  description:
    "Returns and exchanges policy for Afari Trails store orders — eligibility, refunds, and how to get in touch.",
};

export default async function ReturnsPage() {
  const { returns } = await getSupportContent();

  return (
    <SupportPage
      label={returns.label}
      title={returns.title}
      intro={returns.intro}
      relatedLinks={returns.relatedLinks}
    >
      <SupportSections sections={returns.sections} />
    </SupportPage>
  );
}
