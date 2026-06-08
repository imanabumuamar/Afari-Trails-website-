import { InquirySubmission } from "../models/InquirySubmission.model.js";

const SOURCES = new Set([
  "contact",
  "expeditions-connect",
  "ventures-connect",
  "partner",
  "expedition",
  "newsletter",
  "archive-submit",
]);

const MAX_PER_IP_HOUR = 8;
const MAX_MESSAGE_LENGTH = 8000;
const MAX_NAME_LENGTH = 200;

function normalizeEmail(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function trimField(value, maxLen) {
  const s = String(value ?? "").trim();
  if (!s) return undefined;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export async function createInquirySubmission(body, meta = {}) {
  if (body?.website) {
    const err = new Error("Invalid submission");
    err.status = 400;
    throw err;
  }

  const source = String(body?.source ?? "").trim();
  if (!SOURCES.has(source)) {
    const err = new Error("Invalid inquiry source");
    err.status = 400;
    throw err;
  }

  if (source === "archive-submit") {
    const name = trimField(body.name, MAX_NAME_LENGTH);
    if (!name) {
      const err = new Error("Name is required");
      err.status = 400;
      throw err;
    }

    const location = trimField(body.inquiryType, 200);
    if (!location) {
      const err = new Error("Location is required");
      err.status = 400;
      throw err;
    }

    const message = trimField(body.message, MAX_MESSAGE_LENGTH);
    if (!message) {
      const err = new Error("Story is required");
      err.status = 400;
      throw err;
    }

    const photoUrl = trimField(body.photoUrl, 500);
    if (!photoUrl) {
      const err = new Error("Photo is required");
      err.status = 400;
      throw err;
    }

    const emailRaw = trimField(body.email, 200);
    const email = emailRaw ? normalizeEmail(emailRaw) : null;
    if (email && !isValidEmail(email)) {
      const err = new Error("Valid email is required");
      err.status = 400;
      throw err;
    }

    if (meta.ip) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recent = await InquirySubmission.countDocuments({
        ip: meta.ip,
        createdAt: { $gte: hourAgo },
      });
      if (recent >= MAX_PER_IP_HOUR) {
        const err = new Error("Too many submissions. Please try again later.");
        err.status = 429;
        throw err;
      }
    }

    const doc = await InquirySubmission.create({
      source,
      name,
      email,
      company: trimField(body.company, 200),
      inquiryType: location,
      message,
      photoUrl,
      pageUrl: trimField(body.pageUrl, 500),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    if (process.env.NODE_ENV !== "test") {
      console.log(`[inquiry] ${source} from ${name}`);
    }

    return toClient(doc);
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    const err = new Error("Valid email is required");
    err.status = 400;
    throw err;
  }

  if (source === "newsletter") {
    const doc = await InquirySubmission.create({
      source,
      email,
      pageUrl: trimField(body.pageUrl, 500),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    return toClient(doc);
  }

  const name = trimField(body.name, MAX_NAME_LENGTH);
  if (!name) {
    const err = new Error("Name is required");
    err.status = 400;
    throw err;
  }

  const message = trimField(body.message, MAX_MESSAGE_LENGTH);
  if (source !== "expedition" && !message) {
    const err = new Error("Message is required");
    err.status = 400;
    throw err;
  }

  if (meta.ip) {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await InquirySubmission.countDocuments({
      ip: meta.ip,
      createdAt: { $gte: hourAgo },
    });
    if (recent >= MAX_PER_IP_HOUR) {
      const err = new Error("Too many submissions. Please try again later.");
      err.status = 429;
      throw err;
    }
  }

  const doc = await InquirySubmission.create({
    source,
    name,
    email,
    company: trimField(body.company, 200),
    inquiryType: trimField(body.inquiryType, 100),
    partnershipType: trimField(body.partnershipType, 100),
    message,
    expeditionId: trimField(body.expeditionId, 100),
    expeditionName: trimField(body.expeditionName, 200),
    dates: trimField(body.dates, 200),
    guests: trimField(body.guests, 50),
    pageUrl: trimField(body.pageUrl, 500),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  if (process.env.NODE_ENV !== "test") {
    console.log(`[inquiry] ${source} from ${email}`);
  }

  return toClient(doc);
}

function toClient(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    source: o.source,
    createdAt: (o.createdAt ?? new Date()).toISOString(),
  };
}

function toAdminClient(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    source: o.source,
    name: o.name ?? null,
    email: o.email,
    company: o.company ?? null,
    inquiryType: o.inquiryType ?? null,
    partnershipType: o.partnershipType ?? null,
    message: o.message ?? null,
    expeditionId: o.expeditionId ?? null,
    expeditionName: o.expeditionName ?? null,
    dates: o.dates ?? null,
    guests: o.guests ?? null,
    pageUrl: o.pageUrl ?? null,
    photoUrl: o.photoUrl ?? null,
    archivedAt: o.archivedAt ? o.archivedAt.toISOString() : null,
    createdAt: (o.createdAt ?? new Date()).toISOString(),
  };
}

function activeFilter() {
  return { archivedAt: null };
}

function archivedFilter() {
  return { archivedAt: { $ne: null } };
}

async function countBySource(match) {
  const rows = await InquirySubmission.aggregate([
    { $match: match },
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);
  const bySource = {};
  let total = 0;
  for (const row of rows) {
    bySource[row._id] = row.count;
    total += row.count;
  }
  return { total, bySource };
}

export async function listInquirySubmissions({ source, limit, archived } = {}) {
  const query = archived ? archivedFilter() : activeFilter();
  if (source && SOURCES.has(source)) {
    query.source = source;
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 200, 1), 500);

  const [docs, activeCounts, archivedCounts] = await Promise.all([
    InquirySubmission.find(query).sort({ createdAt: -1 }).limit(safeLimit),
    countBySource(activeFilter()),
    countBySource(archivedFilter()),
  ]);

  const counts = archived
    ? {
        total: archivedCounts.total,
        archived: archivedCounts.total,
        bySource: archivedCounts.bySource,
        inboxTotal: activeCounts.total,
      }
    : {
        total: activeCounts.total,
        archived: archivedCounts.total,
        bySource: activeCounts.bySource,
        inboxTotal: activeCounts.total,
      };

  return {
    submissions: docs.map(toAdminClient),
    counts,
  };
}

export async function setInquiryArchived(id, archived) {
  const doc = await InquirySubmission.findByIdAndUpdate(
    id,
    { archivedAt: archived ? new Date() : null },
    { new: true },
  );
  if (!doc) {
    const err = new Error("Message not found");
    err.status = 404;
    throw err;
  }
  return toAdminClient(doc);
}

export async function deleteInquirySubmission(id) {
  const doc = await InquirySubmission.findByIdAndDelete(id);
  if (!doc) {
    const err = new Error("Message not found");
    err.status = 404;
    throw err;
  }
  return { ok: true };
}
