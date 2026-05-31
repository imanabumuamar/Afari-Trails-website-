import Link from "next/link";
import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/api/backend";
import { roleAtLeast } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

type InquirySource =
  | "contact"
  | "expeditions-connect"
  | "ventures-connect"
  | "partner"
  | "expedition"
  | "newsletter";

type Submission = {
  id: string;
  source: InquirySource;
  name: string | null;
  email: string;
  company: string | null;
  inquiryType: string | null;
  partnershipType: string | null;
  message: string | null;
  expeditionId: string | null;
  expeditionName: string | null;
  dates: string | null;
  guests: string | null;
  pageUrl: string | null;
  createdAt: string;
};

type InquiriesResponse = {
  submissions: Submission[];
  counts: { total: number; bySource: Record<string, number> };
};

const SOURCE_LABELS: Record<InquirySource, string> = {
  contact: "Contact",
  "expeditions-connect": "Expeditions connect",
  "ventures-connect": "Ventures connect",
  partner: "Partner",
  expedition: "Expedition request",
  newsletter: "Newsletter",
};

const SOURCE_ORDER: InquirySource[] = [
  "contact",
  "expeditions-connect",
  "ventures-connect",
  "partner",
  "expedition",
  "newsletter",
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;

  if (!role || !roleAtLeast(role, "admin")) {
    redirect("/admin/forbidden");
  }

  const token = session?.accessToken ?? null;
  const { source } = await searchParams;
  const activeSource = SOURCE_ORDER.includes(source as InquirySource)
    ? (source as InquirySource)
    : null;

  const query = activeSource ? `?source=${activeSource}` : "";
  const { data, ok, status } = await backendFetch<InquiriesResponse>(
    `/inquiries${query}`,
    { token },
  );

  if (!ok || !data) {
    return (
      <div className="space-y-4">
        <h2 className="font-serif text-3xl font-light">Messages</h2>
        <p className="text-sm text-red-800/80">
          {status === 503
            ? "API is not running. From the project root run: npm run dev."
            : "Could not load messages. Try refreshing."}
        </p>
      </div>
    );
  }

  const { submissions, counts } = data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">Messages</h2>
        <p className="mt-3 max-w-xl text-sm text-charcoal/65">
          Form submissions from the website — contact, connect, partner, expedition
          requests, and newsletter sign-ups. Newest first.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em]">
        <Link
          href="/admin/messages"
          className={`border px-3 py-1.5 ${
            activeSource === null
              ? "border-charcoal bg-charcoal text-ivory"
              : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
          }`}
        >
          All ({counts.total})
        </Link>
        {SOURCE_ORDER.map((src) => (
          <Link
            key={src}
            href={`/admin/messages?source=${src}`}
            className={`border px-3 py-1.5 ${
              activeSource === src
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
            }`}
          >
            {SOURCE_LABELS[src]} ({counts.bySource[src] ?? 0})
          </Link>
        ))}
      </div>

      {submissions.length === 0 ? (
        <p className="rounded border border-charcoal/15 bg-ivory p-6 text-sm text-charcoal/65">
          No messages yet
          {activeSource ? ` for ${SOURCE_LABELS[activeSource]}` : ""}.
        </p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="rounded border border-charcoal/15 bg-ivory p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded bg-charcoal/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-charcoal/70">
                  {SOURCE_LABELS[s.source] ?? s.source}
                </span>
                <span className="text-xs text-charcoal/50">
                  {formatDate(s.createdAt)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {s.name && (
                  <span className="font-medium text-charcoal">{s.name}</span>
                )}
                <a
                  href={`mailto:${s.email}`}
                  className="text-sm text-gold hover:underline"
                >
                  {s.email}
                </a>
                {s.company && (
                  <span className="text-sm text-charcoal/55">· {s.company}</span>
                )}
              </div>

              {(s.inquiryType ||
                s.partnershipType ||
                s.expeditionName ||
                s.dates ||
                s.guests) && (
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-charcoal/70 sm:grid-cols-2">
                  {s.inquiryType && (
                    <div>
                      <dt className="inline text-charcoal/45">Type: </dt>
                      <dd className="inline">{s.inquiryType}</dd>
                    </div>
                  )}
                  {s.partnershipType && (
                    <div>
                      <dt className="inline text-charcoal/45">Partnership: </dt>
                      <dd className="inline">{s.partnershipType}</dd>
                    </div>
                  )}
                  {s.expeditionName && (
                    <div>
                      <dt className="inline text-charcoal/45">Expedition: </dt>
                      <dd className="inline">{s.expeditionName}</dd>
                    </div>
                  )}
                  {s.dates && (
                    <div>
                      <dt className="inline text-charcoal/45">Dates: </dt>
                      <dd className="inline">{s.dates}</dd>
                    </div>
                  )}
                  {s.guests && (
                    <div>
                      <dt className="inline text-charcoal/45">Guests: </dt>
                      <dd className="inline">{s.guests}</dd>
                    </div>
                  )}
                </dl>
              )}

              {s.message && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-charcoal/80">
                  {s.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
