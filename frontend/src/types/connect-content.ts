import type { ConnectPageConfig } from "@/types/connect-page";

export type ConnectContentData = {
  contact: ConnectPageConfig;
  expeditions: ConnectPageConfig;
};

export type ConnectContentDocument = {
  key: string;
  data: ConnectContentData;
  updatedAt: string;
};
