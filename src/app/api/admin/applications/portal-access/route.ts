import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi } from "@/lib/admin/server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  if (!request.headers.get("content-type")?.includes("application/json") || Number(request.headers.get("content-length") || 0) > 2048) return privateNoStore(NextResponse.json({ error: "Invalid portal email request." }, { status: 400 }));

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return privateNoStore(NextResponse.json({ error: "Invalid portal email request." }, { status: 400 }));
    const { id, requestId } = body as Record<string, unknown>;
    if (typeof id !== "string" || !UUID.test(id) || typeof requestId !== "string" || !UUID.test(requestId)) return privateNoStore(NextResponse.json({ error: "Check the application and try again." }, { status: 400 }));

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (process.env.ADMIN_EMAIL_SENDING_ENABLED !== "true" || !apiKey || !from) return privateNoStore(NextResponse.json({ error: "Email sending is disabled until the sender and Resend settings are configured." }, { status: 503 }));

    const db = createAdminDatabaseClient();
    if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
    const { data: application, error: appError } = await db.from("internship_applications")
      .select("id,full_name,email,track,status,tracking_code")
      .eq("id", id)
      .maybeSingle();
    if (appError || !application) return privateNoStore(NextResponse.json({ error: "Application not found." }, { status: appError ? 503 : 404 }));
    if (application.status !== "accepted" || typeof application.tracking_code !== "string" || !application.tracking_code) return privateNoStore(NextResponse.json({ error: "Accept this application before sending learner portal access." }, { status: 409 }));

    const { data: access, error: accessError } = await db.from("intern_portal_access")
      .select("user_id")
      .eq("application_id", id)
      .eq("is_active", true)
      .maybeSingle();
    if (accessError || !access) return privateNoStore(NextResponse.json({ error: "Portal access is not active for this application yet." }, { status: accessError ? 503 : 409 }));

    const { data: authUser, error: userError } = await db.auth.admin.getUserById(access.user_id);
    if (userError || !authUser.user?.email || authUser.user.email.toLowerCase() !== application.email.toLowerCase()) return privateNoStore(NextResponse.json({ error: "The learner account could not be safely matched to this application." }, { status: 503 }));

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
    if ((adminRate.count ?? 0) >= 10 || (recipientRate.count ?? 0) >= 3) return privateNoStore(NextResponse.json({ error: "Email sending limit reached. Please wait before sending another message." }, { status: 429 }));

    const { error: logError } = await db.from("admin_response_log").upsert({
      idempotency_key: requestId,
      application_kind: "internship",
      application_id: id,
      admin_user_id: auth.user.id,
      admin_email: auth.user.email ?? "",
      recipient_email: recipient,
      template: "portal_setup",
      delivery_status: "pending",
    }, { onConflict: "idempotency_key" });
    if (logError) return privateNoStore(NextResponse.json({ error: "Unable to prepare the portal email." }, { status: 503 }));

    const portalSignInUrl = new URL("/portal/sign-in", request.nextUrl.origin).toString();
    let actionLink: string | null = null;
    if (!authUser.user.email_confirmed_at) {
      const { data: linkData, error: linkError } = await db.auth.admin.generateLink({
        type: "magiclink",
        email: recipient,
      });
      const tokenHash = linkData?.properties?.hashed_token;
      if (tokenHash) {
        const setupUrl = new URL("/portal/set-password", request.nextUrl.origin);
        setupUrl.hash = new URLSearchParams({ token_hash: tokenHash, email: recipient }).toString();
        actionLink = setupUrl.toString();
      }
      if (linkError || !actionLink) {
        await db.from("admin_response_log").update({ delivery_status: "failed" }).eq("idempotency_key", requestId);
        console.error("Portal access link generation failed", { code: linkError?.code });
        return privateNoStore(NextResponse.json({ error: "We couldn’t prepare the secure setup link. No email was sent." }, { status: 503 }));
      }
    }

    const safeName = escapeHtml(application.full_name);
    const safeTrack = escapeHtml(application.track);
    const safeTrackingCode = escapeHtml(application.tracking_code);
    const safeLink = actionLink ? escapeHtml(actionLink) : "";
    const setupParagraph = actionLink
      ? `<p>Use the secure, single-use link below to verify your email address and create your own portal password. This link expires and can only be used once.</p><p><a href="${safeLink}" style="display:inline-block;background:#f59e0b;color:#071a36;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px">Set up learner portal access</a></p>`
      : "<p>Your learner account is ready. Sign in using your existing Devatrix portal email and password.</p>";
    const html = `<div style="font-family:Arial,sans-serif;color:#10243e;line-height:1.65;max-width:600px;margin:auto"><p>Hello ${safeName},</p><p>Your application for <strong>${safeTrack}</strong> has been accepted. Your private application tracking ID is <strong>${safeTrackingCode}</strong>.</p>${setupParagraph}<p>Open <a href="${escapeHtml(portalSignInUrl)}">the Devatrix learner portal</a> to view your internship progress.</p>${actionLink ? "<p>If you weren’t expecting this message, contact Devatrix Technologies and do not share the link.</p>" : ""}<p>Regards,<br/>Devatrix Technologies</p></div>`;
    const mail = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `portal-setup/${requestId}` },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: "Your Devatrix learner portal access",
        text: `Hello ${application.full_name},\n\nYour application for ${application.track} has been accepted. Your private application tracking ID is ${application.tracking_code}.\n\n${actionLink ? `Use this single-use link to verify your email address and create your own portal password: ${actionLink}\n\n` : "Your learner account is ready. Sign in using your existing Devatrix portal email and password.\n\n"}Open the Devatrix learner portal: ${portalSignInUrl}\n\nRegards,\nDevatrix Technologies`,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await mail.json().catch(() => ({})) as { id?: string };
    if (!mail.ok || !result.id) {
      await db.from("admin_response_log").update({ delivery_status: "failed" }).eq("idempotency_key", requestId);
      console.error("Portal access email provider error", { status: mail.status });
      return privateNoStore(NextResponse.json({ error: "The portal email could not be delivered. The application remains saved; you can retry." }, { status: 502 }));
    }

    const { error: updateError } = await db.from("admin_response_log").update({ delivery_status: "sent", provider_message_id: result.id, sent_at: new Date().toISOString() }).eq("idempotency_key", requestId);
    if (updateError) console.error("Portal access email audit update failed");
    return privateNoStore(NextResponse.json({ success: true }));
  } catch {
    return privateNoStore(NextResponse.json({ error: "Unable to send the portal email." }, { status: 503 }));
  }
}
