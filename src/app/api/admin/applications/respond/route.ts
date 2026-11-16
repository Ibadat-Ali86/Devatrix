import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi, validApplicationKind } from "@/lib/admin/server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TEMPLATES = new Set(["received", "shortlisted", "not_selected", "hired"]);

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function buildMessage(template: string, name: string, position: string) {
  const messages: Record<string, { subject: string; paragraph: string }> = {
    received: { subject: "Your Devatrix application is under review", paragraph: `We have received your application for ${position}. Our team is reviewing it and will follow up with you about the next step.` },
    shortlisted: { subject: "An update on your Devatrix application", paragraph: `We are pleased to let you know that your application for ${position} has been shortlisted. Our team will contact you with the next steps.` },
    not_selected: { subject: "An update on your Devatrix application", paragraph: `Thank you for your interest in ${position} at Devatrix. We will not be moving forward with this application at this time. We appreciate the time you invested and wish you success in your next steps.` },
    hired: { subject: "An update on your Devatrix application", paragraph: `We are pleased to let you know that you have been selected for ${position}. Our team will contact you with the next steps.` },
  };
  const message = messages[template];
  const safeName = escapeHtml(name);
  return {
    subject: message.subject,
    text: `Hello ${name},\n\n${message.paragraph}\n\nRegards,\nDevatrix Technologies`,
    html: `<div style="font-family:Arial,sans-serif;color:#10243e;line-height:1.65;max-width:600px;margin:auto"><p>Hello ${safeName},</p><p>${escapeHtml(message.paragraph)}</p><p>Regards,<br/>Devatrix Technologies</p></div>`,
  };
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  if (!request.headers.get("content-type")?.includes("application/json") || Number(request.headers.get("content-length") || 0) > 4096) return privateNoStore(NextResponse.json({ error: "Invalid email request." }, { status: 400 }));

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return privateNoStore(NextResponse.json({ error: "Invalid email request." }, { status: 400 }));
    const { kind, id, template, requestId } = body as Record<string, unknown>;
    if (!validApplicationKind(kind) || typeof id !== "string" || !UUID.test(id) || typeof template !== "string" || !TEMPLATES.has(template) || typeof requestId !== "string" || !UUID.test(requestId)) {
      return privateNoStore(NextResponse.json({ error: "Check the application and response template." }, { status: 400 }));
    }
    if (template === "hired" && kind !== "career") return privateNoStore(NextResponse.json({ error: "That response is only available for career applications." }, { status: 400 }));

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (process.env.ADMIN_EMAIL_SENDING_ENABLED !== "true" || !apiKey || !from) {
      return privateNoStore(NextResponse.json({ error: "Email sending is disabled until the sender and Resend settings are configured." }, { status: 503 }));
    }
    const db = createAdminDatabaseClient();
    if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));

    const table = kind === "internship" ? "internship_applications" : "career_applications";
    const columns = kind === "internship" ? "id,full_name,email,track" : "id,full_name,email,role";
    const { data: application, error: appError } = await db.from(table).select(columns).eq("id", id).maybeSingle();
    if (appError || !application) return privateNoStore(NextResponse.json({ error: "Application not found." }, { status: appError ? 503 : 404 }));

    const recipient = application.email.toLowerCase();
    const since = new Date(Date.now() - 60_000).toISOString();
    const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
    const [previous, adminRate, recipientRate] = await Promise.all([
      db.from("admin_response_log").select("delivery_status").eq("idempotency_key", requestId).maybeSingle(),
      db.from("admin_response_log").select("id", { count: "exact", head: true }).eq("admin_user_id", auth.user.id).gte("created_at", since),
      db.from("admin_response_log").select("id", { count: "exact", head: true }).eq("recipient_email", recipient).gte("created_at", hourAgo),
    ]);
    if (adminRate.error || recipientRate.error || previous.error) return privateNoStore(NextResponse.json({ error: "Unable to verify email delivery limits." }, { status: 503 }));
    if (previous.data?.delivery_status === "sent") return privateNoStore(NextResponse.json({ success: true, alreadySent: true }));
    if ((adminRate.count ?? 0) >= 10 || (recipientRate.count ?? 0) >= 3) return privateNoStore(NextResponse.json({ error: "Email sending limit reached. Please wait before sending another response." }, { status: 429 }));

    const { error: logError } = await db.from("admin_response_log").upsert({
      idempotency_key: requestId,
      application_kind: kind,
      application_id: id,
      admin_user_id: auth.user.id,
      admin_email: auth.user.email ?? "",
      recipient_email: recipient,
      template,
      delivery_status: "pending",
    }, { onConflict: "idempotency_key" });
    if (logError) return privateNoStore(NextResponse.json({ error: "Unable to prepare the response email." }, { status: 503 }));

    const position = kind === "internship" ? (application as { track: string }).track : (application as { role: string }).role;
    const message = buildMessage(template, application.full_name, position);
    const mail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `admin-response/${requestId}` },
      body: JSON.stringify({ from, to: [recipient], subject: message.subject, text: message.text, html: message.html }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await mail.json().catch(() => ({})) as { id?: string };
    if (!mail.ok || !result.id) {
      await db.from("admin_response_log").update({ delivery_status: "failed" }).eq("idempotency_key", requestId);
      console.error("Admin response email provider error", { status: mail.status });
      return privateNoStore(NextResponse.json({ error: "The email could not be delivered. The application remains saved; you can retry." }, { status: 502 }));
    }
    const { error: updateError } = await db.from("admin_response_log").update({ delivery_status: "sent", provider_message_id: result.id, sent_at: new Date().toISOString() }).eq("idempotency_key", requestId);
    if (updateError) console.error("Admin response audit update failed");
    return privateNoStore(NextResponse.json({ success: true }));
  } catch {
    return privateNoStore(NextResponse.json({ error: "Unable to send the response email." }, { status: 503 }));
  }
}
