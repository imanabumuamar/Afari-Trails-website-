export type InquirySource =
  | "contact"
  | "expeditions-connect"
  | "ventures-connect"
  | "partner"
  | "expedition"
  | "newsletter";

export type InquiryPayload = {
  source: InquirySource;
  name?: string;
  email: string;
  company?: string;
  inquiryType?: string;
  partnershipType?: string;
  message?: string;
  expeditionId?: string;
  expeditionName?: string;
  dates?: string;
  guests?: string;
  pageUrl?: string;
  /** Honeypot — must be empty */
  website?: string;
};

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitInquiry(
  payload: InquiryPayload,
): Promise<InquiryResult> {
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        pageUrl: payload.pageUrl ?? window.location.href,
      }),
    });

    if (res.ok) return { ok: true };

    let error = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      if (typeof body.error === "string" && body.error) error = body.error;
    } catch {
      // ignore
    }
    return { ok: false, error };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Check your connection and try again.",
    };
  }
}

export function inquiryPayloadFromForm(
  form: HTMLFormElement,
  source: InquirySource,
  extras?: Partial<InquiryPayload>,
): InquiryPayload {
  const data = new FormData(form);
  return {
    source,
    name: String(data.get("name") ?? "").trim() || undefined,
    email: String(data.get("email") ?? "").trim(),
    company: String(data.get("company") ?? "").trim() || undefined,
    inquiryType: String(data.get("inquiryType") ?? "").trim() || undefined,
    partnershipType:
      String(data.get("partnershipType") ?? "").trim() || undefined,
    message: String(data.get("message") ?? "").trim() || undefined,
    expeditionId: String(data.get("expedition") ?? "").trim() || undefined,
    dates: String(data.get("dates") ?? "").trim() || undefined,
    guests: String(data.get("guests") ?? "").trim() || undefined,
    website: String(data.get("website") ?? "").trim() || undefined,
    ...extras,
  };
}
