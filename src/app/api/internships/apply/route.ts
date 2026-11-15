import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
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

    const fields = ["fullName", "email", "whatsapp", "university", "track", "duration", "githubUrl", "linkedinUrl", "portfolioUrl", "resumeUrl", "statement"] as const;
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
    const id = randomUUID();
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("internship_applications").insert({
      id,
      full_name: values.fullName,
      email: values.email.toLowerCase(),
      whatsapp: values.whatsapp,
      university: values.university,
      track: values.track,
      duration: values.duration || "6 Weeks (Intensive Virtual Sprint)",
      github_url: values.githubUrl || null,
      linkedin_url: values.linkedinUrl || null,
      portfolio_url: values.portfolioUrl || null,
      resume_url: values.resumeUrl || null,
      statement: values.statement,
      created_at: timestamp,
    });
    if (error) {
      console.error("Internship application database error", { code: error.code });
      return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 503 });
    }
    const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhook) {
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, candidateId: id, fullName: values.fullName, email: values.email.toLowerCase(),
          whatsapp: values.whatsapp, university: values.university, track: values.track,
          duration: values.duration || "6 Weeks (Intensive Virtual Sprint)", githubUrl: values.githubUrl,
          linkedinUrl: values.linkedinUrl, portfolioUrl: values.portfolioUrl, resumePath: values.resumeUrl,
          statement: values.statement, status: "Under Review", createdAt: timestamp,
        }),
      }).catch(() => console.error("Internship application Google Sheets sync failed"));
    }
    return NextResponse.json({ success: true, message: "Your application has been received and is under review." }, { status: 201 });
  } catch {
    console.error("Internship application submission failed");
    return NextResponse.json({ success: false, error: "Unable to submit your application. Please try again." }, { status: 500 });
  }
}
