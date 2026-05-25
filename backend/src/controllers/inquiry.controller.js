import * as inquiryService from "../services/inquiry.service.js";

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip ?? req.socket?.remoteAddress ?? undefined;
}

export async function submitInquiry(req, res, next) {
  try {
    const result = await inquiryService.createInquirySubmission(req.body, {
      ip: clientIp(req),
      userAgent:
        typeof req.headers["user-agent"] === "string"
          ? req.headers["user-agent"]
          : undefined,
    });
    res.status(201).json(result);
  } catch (err) {
    if (err.status === 400 || err.status === 429) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}
