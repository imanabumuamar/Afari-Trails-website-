export type VenturePartnerLogo = {
  id: string;
  name: string;
  logo?: string;
  href?: string;
};

export type VenturesPartnersCollaborations = {
  visible: boolean;
  heading: string;
  description: string;
  partners: VenturePartnerLogo[];
  ctaLabel: string;
  ctaHref: string;
};
