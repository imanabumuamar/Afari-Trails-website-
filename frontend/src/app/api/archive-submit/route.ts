import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { saveArchiveSubmissionPhoto } from "@/lib/archive/submission-upload";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (String(formData.get("website") ?? "").trim()) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const photo = formData.get("photo");

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!location) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }
  if (!story) {
    return NextResponse.json({ error: "Story is required" }, { status: 400 });
  }
  if (!photo || !(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "Photo is required" }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json({ error: "Photo must be an image" }, { status: 400 });
  }

  let photoUrl: string;
  try {
    const buffer = Buffer.from(await photo.arrayBuffer());
    ({ photoUrl } = saveArchiveSubmissionPhoto(buffer, photo.type));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save photo";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { ok, status, data } = await backendFetch<{ id: string }>("/inquiries", {
    method: "POST",
    body: JSON.stringify({
      source: "archive-submit",
      name,
      email: email || undefined,
      company: instagram || undefined,
      inquiryType: location,
      message: story,
      photoUrl,
      pageUrl: request.headers.get("referer") ?? undefined,
    }),
  });

  if (!ok) {
    const errBody = data as { error?: string } | null;
    return NextResponse.json(
      { error: errBody?.error ?? "Could not submit photo" },
      { status: status || 502 },
    );
  }

  return NextResponse.json(data, { status: 201 });
}
