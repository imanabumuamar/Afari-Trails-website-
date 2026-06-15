import type { ConnectContentData } from "@/types/connect-content";
import { generalConnectConfig } from "./connect-general";
import { expeditionsConnectConfig } from "./connect-expeditions";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/config/whatsapp";

export const CONNECT_CONTENT_DEFAULTS: ConnectContentData = {
  whatsapp: {
    number: "260974302344",
    message: WHATSAPP_DEFAULT_MESSAGE,
  },
  contact: generalConnectConfig,
  expeditions: expeditionsConnectConfig,
};
