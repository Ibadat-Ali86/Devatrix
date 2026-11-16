import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { after, NextRequest, NextResponse } from "next/server";
import { randomBytes, randomInt, randomUUID } from "crypto";
import { sendApplicationReceipt } from "@/lib/email/send-application-receipt";

function generateTrackingCode(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code: string;
  do {
    code = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("");
  } while (!/[A-Z]/.test(code) || !/[0-9]/.test(code));
  return code;
}

function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

async function ensureApplicantAccount(supabase: SupabaseClient, email: string): Promise<string | null> {
  const candidateId = randomUUID();
  const reserved = await supabase.from("intern_accounts").insert({ user_id: candidateId, email }).select("user_id").single();
  let userId = reserved.data?.user_id as string | undefined;
  if (reserved.error) {
    if (reserved.error.code !== "23505") return null;
    const existing = await supabase.from("intern_accounts").select("user_id").eq("email", email).maybeSingle();
    if (existing.error || !existing.data) return null;
    userId = existing.data.user_id as string;
  }
  if (!userId) return null;

  const matchesReservation = (user: { id: string; email?: string; app_metadata: Record<string, unknown> } | null) =>
    user?.id === userId && user.email?.toLowerCase() === email && user.app_metadata?.devatrix_applicant_id === userId;
  let auth = await supabase.auth.admin.getUserById(userId);
  if (auth.data.user) return matchesReservation(auth.data.user) ? userId : null;
  if (auth.error?.status !== 404) return null;

  // This random bootstrap password is never returned, logged, or stored as readable text.
  // After acceptance, a single-use setup link lets the verified applicant choose a password.
  const created = await supabase.auth.admin.createUser({
    id: userId, email, password: randomBytes(32).toString("base64url"), email_confirm: false,
    app_metadata: { devatrix_applicant_id: userId },
  });
  if (created.data.user) return matchesReservation(created.data.user) ? userId : null;
  // Another submission may have created the same reserved account concurrently.
  auth = await supabase.auth.admin.getUserById(userId);
  return matchesReservation(auth.data.user) ? userId : null;
}

export async function POST(req: NextRequest) {
  try {
    if (!hasAllowedOrigin(req)) {
      return NextResponse.json({ success: false, error: "Please submit the application from the Devatrix website." }, { status: 403 });
    }
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data") && !contentType.includes("application/json")) {
      return NextResponse.json({ success: false, error: "Please submit the application form." }, { status: 415 });
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 65536) {
      return NextResponse.json({ success: false, error: "The application is too large. Please shorten your answers." }, { status: 413 });
    }
    const form = contentType.includes("multipart/form-data") ? await req.formData() : null;
    const json: unknown = form ? null : await req.json();
    if (!form && (!json || typeof json !== "object" || Array.isArray(json))) {
      return NextResponse.json({ success: false, error: "Please submit valid application details." }, { status: 400 });
    }
    const resumeFile = form?.get("resumeFile");
    if (resumeFile && typeof resumeFile !== "string" && resumeFile.size > 0) {
      return NextResponse.json(
        { success: false, error: "Résumé uploads are not available yet. Please provide a résumé link instead." },
        { status: 400 },
      );
    }

    const fields = ["fullName", "email", "whatsapp", "university", "track", "duration", "githubUrl", "linkedinUrl", "portfolioUrl", "resumeUrl", "statement", "submissionId"] as const;
    const values = Object.fromEntries(fields.map((field) => {
      const value = form ? form.get(field) : (json as Record<string, unknown>)[field];
      return [field, typeof value === "string" ? value.trim() : ""];
    })) as Record<(typeof fields)[number], string>;

    if (!values.fullName || !values.email || !values.whatsapp || !values.university || !values.track || !values.statement) {
      return NextResponse.json({ success: false, error: "Please complete all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || fields.some((field) => values[field].length > (field === "statement" ? 5000 : 500))) {
      return NextResponse.json({ success: false, error: "Please check your email and the length of your answers." }, { status: 400 });
    }
    if (values.submissionId && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(values.submissionId)) {
      return NextResponse.json({ success: false, error: "Please refresh the page and try again." }, { status: 400 });
    }
    for (const field of ["githubUrl", "linkedinUrl", "portfolioUrl", "resumeUrl"] as const) {
      if (values[field]) {
        try {
          const url = new URL(values[field]);
          if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Invalid protocol");
        } catch {
          return NextResponse.json({ success: false, error: "Please enter valid website links." }, { status: 400 });
        }
      }
    }

    const url = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secret) throw new Error("Application storage is not configured");
    const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    const id = values.submissionId || randomUUID();
    let isRetry = false;
    let trackSlug: string | null = null;
    if (values.submissionId) {
      const existing = await supabase.from("internship_applications").select("id, track_slug").eq("id", id).maybeSingle();
      if (existing.error) {
        console.error("Internship retry lookup failed", { code: existing.error.code });
        return NextResponse.json({ success: false, error: "Applications are temporarily unavailable. Please try again later." }, { status: 503 });
      }
      isRetry = Boolean(existing.data);
      if (typeof existing.data?.track_slug === "string") trackSlug = existing.data.track_slug;
    }
    if (!isRetry) {
      const { data: publishedTrack, error: trackLookupError } = await supabase
        .from("site_content")
        .select("slug")
        .eq("content_type", "internship_track")
        .eq("is_published", true)
        .eq("title", values.track)
        .maybeSingle();
      if (trackLookupError) {
        console.error("Published internship track lookup failed", { code: trackLookupError.code });
        return NextResponse.json({ success: false, error: "Applications are temporarily unavailable. Please try again later." }, { status: 503 });
      }
      if (!publishedTrack) {
        return NextResponse.json({ success: false, error: "Please choose a currently available internship track." }, { status: 400 });
      }
      trackSlug = publishedTrack.slug;
    }
    const timestamp = new Date().toISOString();
    const email = values.email.toLowerCase();
    const userId = await ensureApplicantAccount(supabase, email);
    if (!userId) {
      console.error("Internship account provisioning failed");
      return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again or contact our team." }, { status: 503 });
    }
    const application = {
      id,
      full_name: values.fullName,
      email,
      whatsapp: values.whatsapp,
      university: values.university,
      track: values.track,
      track_slug: trackSlug,
      duration: values.duration || "6 Weeks (Intensive Virtual Sprint)",
      github_url: values.githubUrl || null,
      linkedin_url: values.linkedinUrl || null,
      portfolio_url: values.portfolioUrl || null,
      resume_url: values.resumeUrl || null,
      statement: values.statement,
      created_at: timestamp,
    };
    let error = null;
    let saved = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const result = await supabase.rpc("register_internship_application", {
        p_user_id: userId,
        p_application: { ...application, tracking_code: generateTrackingCode() },
      });
      error = result.error;
      saved = result.data;
      if (!error || error.code !== "23505" || !error.details?.includes("(tracking_code)")) break;
    }
    if (error) {
      console.error("Internship application database error", { code: error.code });
      if (error.code === "P0002") {
        return NextResponse.json({ success: false, error: "This request conflicts with a previous submission. Refresh the page to start a new application." }, { status: 409 });
      }
      return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 503 });
    }
    let receiptEmailSent = false;
    if (saved === "created") {
      try {
        receiptEmailSent = await sendApplicationReceipt({
          idempotencyKey: id,
          name: values.fullName,
          email,
          track: values.track,
        });
      } catch {
        console.error("Application receipt email delivery failed");
      }
    }

    const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhook && saved === "created") {
      try {
        if (new URL(webhook).protocol === "https:") {
          after(async () => {
            try {
              const webhookResponse = await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id, candidateId: id, fullName: values.fullName, email: values.email.toLowerCase(),
                  whatsapp: values.whatsapp, university: values.university, track: values.track,
                  duration: values.duration || "6 Weeks (Intensive Virtual Sprint)", githubUrl: values.githubUrl,
                  linkedinUrl: values.linkedinUrl, portfolioUrl: values.portfolioUrl, resumePath: values.resumeUrl,
                  statement: values.statement, status: "Under Review", createdAt: timestamp,
                }),
                signal: AbortSignal.timeout(5_000),
              });
              if (!webhookResponse.ok) console.error("Internship application Google Sheets sync failed", { status: webhookResponse.status });
            } catch {
              console.error("Internship application Google Sheets sync failed");
            }
          });
        }
      } catch {
        console.error("Internship application Google Sheets sync URL is invalid");
      }
    }
    const response = NextResponse.json({
      success: true,
      message: "Your application has been received and is under review.",
      receiptEmailSent,
    }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    console.error("Internship application submission failed");
    return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 500 });
  }
}
