import type { ConnectWhatsAppSettings } from "@/types/connect-content";

/** Default pre-filled message when opening WhatsApp. */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello Afari Trails — I'd like to learn more about your expeditions.";

/**
 * Fallback when CMS and env are unset (local dev only).
 * Prefer Admin → Connect → WhatsApp or NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
export const WHATSAPP_NUMBER = "";

export function resolveWhatsAppSettings(
  cms?: Partial<ConnectWhatsAppSettings> | null,
): ConnectWhatsAppSettings {
  const number =
    cms?.number?.replace(/\D/g, "") ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    WHATSAPP_NUMBER.replace(/\D/g, "");

  const message =
    cms?.message?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim() ||
    WHATSAPP_DEFAULT_MESSAGE;

  return { number, message };
}

export function buildWhatsAppHref(
  number: string,
  message: string = WHATSAPP_DEFAULT_MESSAGE,
): string {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
