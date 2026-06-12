import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageActions } from "@/components/admin/messages/MessageActions";
import { backendFetch } from "@/lib/api/backend";
import { hasPermission } from "@/lib/auth/rbac";
import { getStaffSession } from "@/lib/auth/staff-session";

type InquirySource =
  | "contact"
  | "expeditions-connect"
  | "ventures-connect"
  | "partner"
  | "expedition"
  | "newsletter"
  | "archive-submit";

type MessageGroup = "connect" | "expeditions";

type Submission = {
  id: string;
  source: InquirySource;
  name: string | null;
  email: string | null;
  company: string | null;
  inquiryType: string | null;
  partnershipType: string | null;
  message: string | null;
  expeditionId: string | null;
  expeditionName: string | null;
  dates: string | null;
  guests: string | null;
  pageUrl: string | null;
  photoUrl: string | null;
  createdAt: string;
};

type InquiriesResponse = {
  submissions: Submission[];
  counts: {
    total: number;
    archived: number;
    inboxTotal?: number;
    bySource: Record<string, number>;
  };
};

const MESSAGE_GROUPS: Record<
  MessageGroup,
  { label: string; sources: InquirySource[] }
> = {
  connect: {
    label: "Connect messages",
    sources: ["contact", "ventures-connect", "partner"],
  },
  expeditions: {
    label: "Expedition messages",
    sources: ["expeditions-connect", "expedition"],
  },
};

const SOURCE_LABELS: Record<InquirySource, string> = {
  contact: "Connect",
  "expeditions-connect": "Plan your journey",
  "ventures-connect": "Connect (legacy)",
  partner: "Connect (legacy)",
  expedition: "Expedition request",
  newsletter: "Newsletter",
  "archive-submit": "Afari Lens photo",
};

const OTHER_SOURCES: InquirySource[] = ["newsletter", "archive-submit"];

function messagesHref({
  source = null,
  group = null,
  view,
}: {
  source?: InquirySource | null;
  group?: MessageGroup | null;
  view: "inbox" | "archived";
}) {
  const params = new URLSearchParams();
  if (group) params.set("group", group);
  else if (source) params.set("source", source);
  if (view === "archived") params.set("view", "archived");
  const q = params.toString();
  return `/admin/messages${q ? `?${q}` : ""}`;
}

function groupCount(
  group: MessageGroup,
  bySource: Record<string, number>,
): number {
  return MESSAGE_GROUPS[group].sources.reduce(
    (sum, src) => sum + (bySource[src] ?? 0),
    0,
  );
}

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
  searchParams: Promise<{ source?: string; group?: string; view?: string }>;
}) {
  const session = await getStaffSession();
  const role = session?.user?.role ?? null;
  const permissions = session?.user?.permissions;

  if (!role || !hasPermission(role, "inbox:read", permissions)) {
    redirect("/admin/forbidden");
  }

  const token = session?.accessToken ?? null;
  const { source, group, view } = await searchParams;
  const activeGroup =
    group === "connect" || group === "expeditions" ? group : null;
  const activeSource =
    !activeGroup &&
    [
      ...MESSAGE_GROUPS.connect.sources,
      ...MESSAGE_GROUPS.expeditions.sources,
      ...OTHER_SOURCES,
    ].includes(source as InquirySource)
      ? (source as InquirySource)
      : null;
  const isArchivedView = view === "archived";

  const queryParts: string[] = [];
  if (activeSource) queryParts.push(`source=${activeSource}`);
  if (isArchivedView) queryParts.push("archived=true");
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";

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

  const { counts } = data;
  let submissions = data.submissions;

  if (activeGroup) {
    const sources = MESSAGE_GROUPS[activeGroup].sources;
    submissions = submissions.filter((s) => sources.includes(s.source));
  }

  const inboxCount = counts.inboxTotal ?? counts.total;
  const archivedCount = counts.archived ?? 0;
  const connectCount = groupCount("connect", counts.bySource);
  const expeditionsCount = groupCount("expeditions", counts.bySource);

  const activeFilterLabel = activeGroup
    ? MESSAGE_GROUPS[activeGroup].label
    : activeSource
      ? SOURCE_LABELS[activeSource]
      : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-light">Messages</h2>
        <p className="mt-3 max-w-2xl text-sm text-charcoal/65">
          <strong className="font-normal">Connect messages</strong> come from
          /contact (partner with us and get in touch).{" "}
          <strong className="font-normal">Expedition messages</strong> come from
          /expeditions/connect (plan your journey) and expedition enquiry forms.
          Newsletter sign-ups only include an email. Refresh after testing a form.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em]">
        <Link
          href={messagesHref({ view: "inbox" })}
          className={`border px-3 py-1.5 ${
            !isArchivedView
              ? "border-charcoal bg-charcoal text-ivory"
              : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
          }`}
        >
          Inbox ({inboxCount})
        </Link>
        <Link
          href={messagesHref({ view: "archived" })}
          className={`border px-3 py-1.5 ${
            isArchivedView
              ? "border-charcoal bg-charcoal text-ivory"
              : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
          }`}
        >
          Archived ({archivedCount})
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em]">
        <Link
          href={messagesHref({
            view: isArchivedView ? "archived" : "inbox",
          })}
          className={`border px-3 py-1.5 ${
            !activeGroup && !activeSource
              ? "border-charcoal/40 bg-charcoal/5 text-charcoal"
              : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
          }`}
        >
          All types
        </Link>
        {(Object.keys(MESSAGE_GROUPS) as MessageGroup[]).map((key) => (
          <Link
            key={key}
            href={messagesHref({
              group: key,
              view: isArchivedView ? "archived" : "inbox",
            })}
            className={`border px-3 py-1.5 ${
              activeGroup === key
                ? "border-charcoal/40 bg-charcoal/5 text-charcoal"
                : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
            }`}
          >
            {MESSAGE_GROUPS[key].label} (
            {key === "connect" ? connectCount : expeditionsCount})
          </Link>
        ))}
        {OTHER_SOURCES.map((src) => (
          <Link
            key={src}
            href={messagesHref({
              source: src,
              view: isArchivedView ? "archived" : "inbox",
            })}
            className={`border px-3 py-1.5 ${
              activeSource === src
                ? "border-charcoal/40 bg-charcoal/5 text-charcoal"
                : "border-charcoal/25 text-charcoal/70 hover:border-charcoal/50"
            }`}
          >
            {SOURCE_LABELS[src]} ({counts.bySource[src] ?? 0})
          </Link>
        ))}
      </div>

      {submissions.length === 0 ? (
        <p className="rounded border border-charcoal/15 bg-ivory p-6 text-sm text-charcoal/65">
          {isArchivedView ? "No archived messages" : "No messages yet"}
          {activeFilterLabel ? ` for ${activeFilterLabel}` : ""}.
        </p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="rounded border border-charcoal/15 bg-ivory p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-charcoal/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-charcoal/70">
                    {SOURCE_LABELS[s.source] ?? s.source}
                  </span>
                  <span className="text-xs text-charcoal/50">
                    {formatDate(s.createdAt)}
                  </span>
                </div>
                <MessageActions id={s.id} archived={isArchivedView} />
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {s.name && (
                  <span className="font-medium text-charcoal">{s.name}</span>
                )}
                {s.email && (
                  <a
                    href={`mailto:${s.email}`}
                    className="text-sm text-gold hover:underline"
                  >
                    {s.email}
                  </a>
                )}
                {s.company && s.source === "archive-submit" && (
                  <span className="text-sm text-charcoal/55">
                    · Instagram {s.company}
                  </span>
                )}
                {s.company && s.source !== "archive-submit" && (
                  <span className="text-sm text-charcoal/55">· {s.company}</span>
                )}
              </div>

              {s.photoUrl && (
                <a
                  href={s.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-4 block aspect-[4/3] max-w-sm overflow-hidden bg-charcoal/5"
                >
                  <Image
                    src={s.photoUrl}
                    alt={s.name ? `Photo from ${s.name}` : "Submitted photo"}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </a>
              )}

              {(s.inquiryType ||
                s.partnershipType ||
                s.expeditionName ||
                s.dates ||
                s.guests) && (
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-charcoal/70 sm:grid-cols-2">
                  {s.inquiryType && (
                    <div>
                      <dt className="inline text-charcoal/45">
                        {s.source === "archive-submit" ? "Location: " : "Type: "}
                      </dt>
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

              {s.message ? (
                <div className="mt-3">
                  {s.source === "archive-submit" && (
                    <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-charcoal/45">
                      Story
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-charcoal/80">
                    {s.message}
                  </p>
                </div>
              ) : s.source === "newsletter" ? (
                <p className="mt-3 text-sm text-charcoal/55">
                  Newsletter signup — email only, no message.
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
