import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { after, NextRequest, NextResponse } from "next/server";

const MAX_REQUEST_BYTES = 64 * 1024;
const MAX_LENGTHS: Record<string, number> = {
  fullName: 120,
  email: 254,
  phone: 40,
  location: 160,
  role: 160,
  experience: 120,
  previousCompany: 160,
  previousSalary: 80,
  expectedSalary: 80,
  noticePeriod: 80,
  linkedinUrl: 2048,
  githubUrl: 2048,
  resumeUrl: 2048,
  coverNote: 5000,
};

function validWebLink(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
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

function applicationId(): string {
  return `DEV-JOB-${new Date().getUTCFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;
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
    if (contentLength > MAX_REQUEST_BYTES) {
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
        { success: false, error: "Résumé file uploads are not available yet. Please provide a private résumé link instead." },
        { status: 400 },
      );
    }

    const values = Object.fromEntries(Object.keys(MAX_LENGTHS).map((field) => {
      const raw = form ? form.get(field) : (json as Record<string, unknown>)[field];
      return [field, typeof raw === "string" ? raw.trim() : ""];
    })) as Record<keyof typeof MAX_LENGTHS, string>;

    if (!values.fullName || !values.email || !values.phone || !values.location) {
      return NextResponse.json({ success: false, error: "Please complete your name, email, phone, and location." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || Object.entries(MAX_LENGTHS).some(([key, limit]) => values[key].length > limit)) {
      return NextResponse.json({ success: false, error: "Please check your email and the length of your answers." }, { status: 400 });
    }
    if (!validWebLink(values.linkedinUrl) || !validWebLink(values.githubUrl) || !validWebLink(values.resumeUrl)) {
      return NextResponse.json({ success: false, error: "Please enter valid website links." }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;
    if (!supabaseUrl || !secret) throw new Error("Career application storage is not configured");
    const supabase = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });

    let result: { data: { application_id: string; created_at: string } | null; error: { code?: string } | null } | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      result = await supabase.from("career_applications").insert({
        application_id: applicationId(),
        full_name: values.fullName,
        email: values.email.toLowerCase(),
        phone: values.phone,
        location: values.location,
        role: values.role || "General / Future Openings",
        experience: values.experience || null,
        previous_company: values.previousCompany || null,
        previous_salary: values.previousSalary || null,
        expected_salary: values.expectedSalary || null,
        notice_period: values.noticePeriod || null,
        linkedin_url: values.linkedinUrl || null,
        github_url: values.githubUrl || null,
        resume_url: values.resumeUrl || null,
        cover_note: values.coverNote || null,
        status: "review_pending",
      }).select("application_id, created_at").single();
      if (!result.error || result.error.code !== "23505") break;
    }

    if (result?.error || !result?.data) {
      console.error("Career application database insert failed", { code: result?.error?.code });
      return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 503 });
    }
    const savedApplication = result.data;

    const webhookUrl = process.env.GOOGLE_SHEET_CAREERS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        if (new URL(webhookUrl).protocol === "https:") {
          after(async () => {
            try {
              const webhookResponse = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  applicationId: savedApplication.application_id,
                  fullName: values.fullName,
                  email: values.email.toLowerCase(),
                  phone: values.phone,
                  location: values.location,
                  role: values.role || "General / Future Openings",
                  experience: values.experience,
                  previousCompany: values.previousCompany,
                  previousSalary: values.previousSalary,
                  expectedSalary: values.expectedSalary,
                  noticePeriod: values.noticePeriod,
                  linkedinUrl: values.linkedinUrl,
                  githubUrl: values.githubUrl,
                  resumeUrl: values.resumeUrl,
                  coverNote: values.coverNote,
                  status: "Review Pending",
                  createdAt: savedApplication.created_at,
                }),
                signal: AbortSignal.timeout(5_000),
              });
              if (!webhookResponse.ok) console.error("Career application sheet sync failed", { status: webhookResponse.status });
            } catch {
              console.error("Career application sheet sync failed");
            }
          });
        }
      } catch {
        console.error("Career application sheet sync URL is invalid");
      }
    }

    const response = NextResponse.json({
      success: true,
      applicationId: savedApplication.application_id,
      message: "Your application has been received.",
    }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    console.error("Career application submission failed");
    return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 500 });
  }
}
