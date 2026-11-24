import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { after, NextRequest, NextResponse } from "next/server";
import { randomBytes, randomInt, randomUUID } from "crypto";
import fs from "fs";
import path from "path";
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

function sanitizeUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const val = raw.trim();
  if (val.includes("...") || val.includes(" ") || val.length < 5) return null;
  try {
    const parsed = new URL(val);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function saveLocalInternshipApplication(record: Record<string, unknown>) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "internship-applications.json");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    let existingData: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) existingData = [];
      } catch {
        existingData = [];
      }
    }
    const idx = existingData.findIndex((item) => item.id === record.id);
    if (idx >= 0) {
      existingData[idx] = record;
    } else {
      existingData.unshift(record);
    }
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`[Devatrix Internships] Saved application ${record.id} for ${record.full_name}`);
    return true;
  } catch (err) {
    console.error("Local internship application file save error:", err);
    return false;
  }
}

async function ensureApplicantAccount(supabase: SupabaseClient, email: string): Promise<string | null> {
  try {
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

    const created = await supabase.auth.admin.createUser({
      id: userId, email, password: randomBytes(32).toString("base64url"), email_confirm: false,
      app_metadata: { devatrix_applicant_id: userId },
    });
    if (created.data.user) return matchesReservation(created.data.user) ? userId : null;
    auth = await supabase.auth.admin.getUserById(userId);
    return matchesReservation(auth.data.user) ? userId : null;
  } catch (err) {
    console.warn("Supabase applicant account provisioning error:", err);
    return null;
  }
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
    if (contentLength > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "The application is too large. Please shorten your answers or reduce file size." }, { status: 413 });
    }

    const form = contentType.includes("multipart/form-data") ? await req.formData() : null;
    const json: unknown = form ? null : await req.json();
    if (!form && (!json || typeof json !== "object" || Array.isArray(json))) {
      return NextResponse.json({ success: false, error: "Please submit valid application details." }, { status: 400 });
    }

    // Handle optional file upload
    let savedResumePath: string | null = null;
    const resumeFile = form?.get("resumeFile");
    if (resumeFile && typeof resumeFile === "object" && "size" in resumeFile && (resumeFile as File).size > 0) {
      try {
        const file = resumeFile as File;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeName = `INT_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);
        savedResumePath = `/uploads/resumes/${safeName}`;
      } catch (uploadErr) {
        console.error("Local resume upload error:", uploadErr);
      }
    }

    const fields = ["fullName", "email", "whatsapp", "university", "track", "duration", "githubUrl", "linkedinUrl", "portfolioUrl", "resumeUrl", "statement", "submissionId"] as const;
    const values = Object.fromEntries(fields.map((field) => {
      const value = form ? form.get(field) : (json as Record<string, unknown>)[field];
      return [field, typeof value === "string" ? value.trim() : ""];
    })) as Record<(typeof fields)[number], string>;

    if (!values.fullName || !values.email || !values.whatsapp || !values.university || !values.track) {
      return NextResponse.json({ success: false, error: "Please complete all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return NextResponse.json({ success: false, error: "Please check your email address." }, { status: 400 });
    }

    const cleanGithub = sanitizeUrl(values.githubUrl);
    const cleanLinkedin = sanitizeUrl(values.linkedinUrl);
    const cleanPortfolio = sanitizeUrl(values.portfolioUrl);
    const cleanResume = savedResumePath || sanitizeUrl(values.resumeUrl);

    const id = values.submissionId && /^[0-9a-f-]{36}$/i.test(values.submissionId) ? values.submissionId : randomUUID();
    const timestamp = new Date().toISOString();
    const email = values.email.toLowerCase();
    const trackingCode = generateTrackingCode();
    const trackSlug = values.track.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const application = {
      id,
      tracking_code: trackingCode,
      full_name: values.fullName,
      email,
      whatsapp: values.whatsapp,
      university: values.university,
      track: values.track,
      track_slug: trackSlug,
      duration: values.duration || "6 Weeks (Intensive Virtual Sprint)",
      github_url: cleanGithub,
      linkedin_url: cleanLinkedin,
      portfolio_url: cleanPortfolio,
      resume_url: cleanResume,
      statement: values.statement || "General 6-week cohort enrollment.",
      status: "under_review",
      created_at: timestamp,
    };

    let receiptEmailSent = false;
    let savedInSupabase = false;

    // 1. Try Supabase storage if credentials exist
    const url = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;
    if (url && secret) {
      try {
        const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
        const userId = await ensureApplicantAccount(supabase, email);
        if (userId) {
          for (let attempt = 0; attempt < 3; attempt++) {
            const result = await supabase.rpc("register_internship_application", {
              p_user_id: userId,
              p_application: application,
            });
            if (!result.error) {
              savedInSupabase = true;
              break;
            }
          }
        }
      } catch (sbErr) {
        console.warn("Supabase registration not available, proceeding with local persistent database:", sbErr);
      }
    }

    // 2. Always persist to local database as primary storage or backup
    saveLocalInternshipApplication(application);

    // 3. Optional receipt email if configured
    try {
      receiptEmailSent = await sendApplicationReceipt({
        idempotencyKey: id,
        name: values.fullName,
        email,
        track: values.track,
      });
    } catch {
      // Non-blocking
    }

    // 4. Background Sync to Google Sheets if webhook configured
    const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhook) {
      try {
        if (new URL(webhook).protocol === "https:") {
          after(async () => {
            try {
              const webhookResponse = await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id, candidateId: id, fullName: values.fullName, email,
                  whatsapp: values.whatsapp, university: values.university, track: values.track,
                  duration: values.duration || "6 Weeks (Intensive Virtual Sprint)", githubUrl: cleanGithub,
                  linkedinUrl: cleanLinkedin, portfolioUrl: cleanPortfolio, resumePath: cleanResume,
                  statement: values.statement, status: "Under Review", trackingCode, createdAt: timestamp,
                }),
                signal: AbortSignal.timeout(5_000),
              });
              if (!webhookResponse.ok) console.error("Internship application Google Sheets sync failed", { status: webhookResponse.status });
            } catch (sheetErr) {
              console.error("Internship application Google Sheets sync error:", sheetErr);
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
      candidateId: id,
      trackingCode,
      savedInSupabase,
    }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err) {
    console.error("Internship application submission error:", err);
    return NextResponse.json({ success: false, error: "Unable to submit your application. Please check your fields and try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");

    const filePath = path.join(process.cwd(), "data", "internship-applications.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ total: 0, items: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: any[] = JSON.parse(fileContent);

    if (candidateId) {
      const match = data.find((item) => item.id === candidateId || item.tracking_code === candidateId);
      if (match) {
        return NextResponse.json({
          found: true,
          candidate: {
            candidateId: match.id,
            trackingCode: match.tracking_code,
            fullName: match.full_name,
            track: match.track,
            duration: match.duration,
            status: match.status,
            createdAt: match.created_at,
          },
        });
      } else {
        return NextResponse.json({ found: false, error: "Candidate ID not found" }, { status: 404 });
      }
    }

    return NextResponse.json({
      total: data.length,
      recentCount: Math.min(data.length, 10),
      items: data.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
