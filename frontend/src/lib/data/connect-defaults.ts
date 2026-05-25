import type { ConnectContentData } from "@/types/connect-content";
import { generalConnectConfig } from "./connect-general";
import { expeditionsConnectConfig } from "./connect-expeditions";

export const CONNECT_CONTENT_DEFAULTS: ConnectContentData = {
  contact: generalConnectConfig,
  expeditions: expeditionsConnectConfig,
};
