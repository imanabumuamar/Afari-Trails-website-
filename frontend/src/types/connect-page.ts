export type ConnectInquiryOption = {
  value: string;
  label: string;
};

export type ConnectCategoryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  inquiry?: string;
};

export type ConnectPageConfig = {
  hero: {
    label: string;
    heading: string;
    subheading: string;
    cta: string;
    image: string;
    imageAlt: string;
  };
  intro: {
    label?: string;
    statement: string;
    body: string;
  };
  categories: {
    label: string;
    heading: string;
    items: readonly ConnectCategoryItem[];
  };
  form: {
    label: string;
    heading: string;
    subtext: string;
    submitLabel: string;
    successMessage: string;
    inquiryOptions: readonly ConnectInquiryOption[];
  };
  direct: {
    email: string;
    location: string;
    socials: readonly { label: string; href: string }[];
  };
  gallery: readonly { src: string; alt: string }[];
  newsletter?: {
    heading: string;
    subtext: string;
    placeholder: string;
    submitLabel: string;
    successMessage: string;
  };
  closing: {
    quote: string;
  };
};
