import { InquirySubmission } from "../models/InquirySubmission.model.js";

const SOURCES = new Set([
  "contact",
  "expeditions-connect",
  "ventures-connect",
  "partner",
  "expedition",
  "newsletter",
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
