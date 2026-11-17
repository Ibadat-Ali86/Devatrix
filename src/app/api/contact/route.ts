import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient } from "@/lib/admin/server";
import { isMailerConfigured, sendDevatrixEmail } from "@/lib/email/mailer";

function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function saveLocalInquiry(record: Record<string, unknown>) {
  try {
    const dir = path.join(process.cwd(), "data");
    const file = path.join(dir, "contact-inquiries.json");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let list: unknown[] = [];
    if (fs.existsSync(file)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        list = [];
      }
    }
    list.unshift(record);
    fs.writeFileSync(file, JSON.stringify(list.slice(0, 500), null, 2), "utf-8");
  } catch (err) {
    console.warn("[Contact Inquiry] Local save error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!hasAllowedOrigin(request)) {
      return NextResponse.json({ success: false, error: "Please submit from the Devatrix website." }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid inquiry submission." }, { status: 400 });
    }

    const source = body.source === "estimator" ? "estimator" : "contact";
    const fullName = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const service = typeof body.service === "string" ? body.service.trim() : "";
    const budget = typeof body.budget === "string" ? body.budget.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? body.metadata : {};

    if (!fullName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please provide a valid name and email address." }, { status: 400 });
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const record = {
      id,
      source,
      full_name: fullName,
      email,
      company: company || null,
      service: service || null,
      budget: budget || null,
      message: message || null,
      metadata,
      status: "new",
      created_at: createdAt,
    };

    // 1. Save to Supabase if table exists
    let savedInSupabase = false;
    const db = createAdminDatabaseClient();
    if (db) {
      try {
        const { error } = await db.from("contact_inquiries").insert(record);
        if (!error) savedInSupabase = true;
      } catch {
        // Non-blocking fallback
      }
    }

    // 2. Always persist locally as fail-safe
    saveLocalInquiry(record);

    // 3. Optional company email notification
    if (isMailerConfigured()) {
      const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || "devatrixtechnologies@gmail.com";
      const label = source === "estimator" ? "New Project Estimator Lead" : "New Website Contact Inquiry";
      await sendDevatrixEmail({
        to: notifyTo,
        subject: `${label}: ${fullName} (${company || email})`,
        text: `Source: ${source}\nName: ${fullName}\nEmail: ${email}\nCompany: ${company || "N/A"}\nService: ${service || "N/A"}\nBudget: ${budget || "N/A"}\n\nMessage:\n${message || "N/A"}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;"><h3>${label}</h3><p><strong>Name:</strong> ${fullName}<br/><strong>Email:</strong> ${email}<br/><strong>Company:</strong> ${company || "N/A"}<br/><strong>Service:</strong> ${service || "N/A"}<br/><strong>Budget:</strong> ${budget || "N/A"}</p><p><strong>Message:</strong><br/>${message || "N/A"}</p></div>`,
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true, id, savedInSupabase }, { status: 201 });
  } catch (err) {
    console.error("[Contact API] Submission failed:", err);
    return NextResponse.json({ success: false, error: "Unable to submit your inquiry right now." }, { status: 500 });
  }
}
