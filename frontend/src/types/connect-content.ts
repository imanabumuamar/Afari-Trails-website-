import type { ConnectPageConfig } from "@/types/connect-page";

export type ConnectWhatsAppSettings = {
  /** Digits only with country code, e.g. 260974302344 */
  number: string;
  message: string;
};

export type ConnectContentData = {
  /** Site-wide floating WhatsApp button and expedition footer links. */
  whatsapp: ConnectWhatsAppSettings;
  contact: ConnectPageConfig;
  expeditions: ConnectPageConfig;
};

export type ConnectContentDocument = {
  key: string;
  data: ConnectContentData;
  updatedAt: string;
};
