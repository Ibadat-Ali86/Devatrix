import { randomBytes, randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { after, NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MAX_REQUEST_BYTES = 5 * 1024 * 1024;
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

function saveLocalCareerApplication(record: Record<string, unknown>) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "career-applications.json");
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
    const idx = existingData.findIndex((item) => item.application_id === record.application_id);
    if (idx >= 0) {
      existingData[idx] = record;
    } else {
      existingData.unshift(record);
    }
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`[Devatrix Careers] Saved application ${record.application_id} for ${record.full_name}`);
    return true;
  } catch (err) {
    console.error("Local career application file save error:", err);
    return false;
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
    if (contentLength > MAX_REQUEST_BYTES) {
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
        const safeName = `JOB_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);
        savedResumePath = `/uploads/resumes/${safeName}`;
      } catch (uploadErr) {
        console.error("Local resume upload error:", uploadErr);
      }
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

    const cleanLinkedin = sanitizeUrl(values.linkedinUrl);
    const cleanGithub = sanitizeUrl(values.githubUrl);
    const cleanResume = savedResumePath || sanitizeUrl(values.resumeUrl);

    const appId = applicationId();
    const timestamp = new Date().toISOString();

    const applicationRecord = {
      application_id: appId,
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
      linkedin_url: cleanLinkedin,
      github_url: cleanGithub,
      resume_url: cleanResume,
      cover_note: values.coverNote || null,
      status: "review_pending",
      created_at: timestamp,
    };

    let savedInSupabase = false;

    // 1. Attempt Supabase insert if credentials are provided
    const supabaseUrl = process.env.SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;
    if (supabaseUrl && secret) {
      try {
        const supabase = createClient(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });
        for (let attempt = 0; attempt < 3; attempt++) {
          const result = await supabase.from("career_applications").insert(applicationRecord).select("application_id, created_at").single();
          if (!result.error) {
            savedInSupabase = true;
            break;
          }
        }
      } catch (sbErr) {
        console.warn("Supabase career registration not available, falling back to local database:", sbErr);
      }
    }

    // 2. Always persist locally
    saveLocalCareerApplication(applicationRecord);

    // 3. Webhook sync
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
                  applicationId: appId,
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
                  linkedinUrl: cleanLinkedin,
                  githubUrl: cleanGithub,
                  resumeUrl: cleanResume,
                  coverNote: values.coverNote,
                  status: "Review Pending",
                  createdAt: timestamp,
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
      applicationId: appId,
      message: "Your application has been received.",
      savedInSupabase,
    }, { status: 201 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err) {
    console.error("Career application submission failed:", err);
    return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationIdParam = searchParams.get("applicationId");

    const filePath = path.join(process.cwd(), "data", "career-applications.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ total: 0, items: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: any[] = JSON.parse(fileContent);

    if (applicationIdParam) {
      const match = data.find((item) => item.application_id === applicationIdParam);
      if (match) {
        return NextResponse.json({
          found: true,
          candidate: match,
        });
      } else {
        return NextResponse.json({ found: false, error: "Application ID not found" }, { status: 404 });
      }
    }

    return NextResponse.json({
      total: data.length,
      items: data.slice(0, 15),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
