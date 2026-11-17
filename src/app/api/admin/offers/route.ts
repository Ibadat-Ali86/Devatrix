import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi } from "@/lib/admin/server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";
import {
  dispatchOfferOrReminder,
  getCohortSettings,
  getOnboardingOverview,
  saveCohortSettings,
  type DispatchResult,
} from "@/lib/offer-letter/dispatch";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const db = createAdminDatabaseClient();
  if (!db) {
    return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
  }

  try {
    const overview = await getOnboardingOverview(db);
    return privateNoStore(NextResponse.json(overview));
  } catch (err) {
    console.error("[Admin Offers GET] Failed:", err);
    return privateNoStore(NextResponse.json({ error: "Unable to load offer letter analytics." }, { status: 503 }));
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  }
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const db = createAdminDatabaseClient();
  if (!db) {
    return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
  }

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return privateNoStore(NextResponse.json({ error: "Invalid request payload." }, { status: 400 }));
    }

    const action = String(body.action || "");
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    if (action === "save_cohort_settings") {
      const saved = await saveCohortSettings(
        {
          batch_start_date: typeof body.batch_start_date === "string" ? body.batch_start_date : undefined,
          batch_end_date: typeof body.batch_end_date === "string" ? body.batch_end_date : undefined,
          whatsapp_group_url: typeof body.whatsapp_group_url === "string" ? body.whatsapp_group_url : undefined,
          reminder_start_date: typeof body.reminder_start_date === "string" ? body.reminder_start_date : undefined,
          reminder_hour_pkt: typeof body.reminder_hour_pkt === "number" ? body.reminder_hour_pkt : Number(body.reminder_hour_pkt),
          auto_send_24h_enabled: typeof body.auto_send_24h_enabled === "boolean" ? body.auto_send_24h_enabled : undefined,
          auto_reminder_enabled: typeof body.auto_reminder_enabled === "boolean" ? body.auto_reminder_enabled : undefined,
        },
        db,
      );
      return privateNoStore(NextResponse.json({ success: true, settings: saved }));
    }

    if (action === "resend_single") {
      const applicationId = String(body.applicationId || "");
      const kind = body.kind === "reminder" ? "reminder" : "offer";
      if (!UUID.test(applicationId)) {
        return privateNoStore(NextResponse.json({ error: "Invalid application ID." }, { status: 400 }));
      }
      const result = await dispatchOfferOrReminder({
        db,
        applicationId,
        kind,
        origin,
        reviewerId: auth.user.id,
      });
      if (!result.success) {
        return privateNoStore(NextResponse.json({ error: result.reason || "Unable to send email." }, { status: 503 }));
      }
      return privateNoStore(NextResponse.json({ success: true, result }));
    }

    if (action === "send_all_unsent") {
      const overview = await getOnboardingOverview(db);
      const settings = await getCohortSettings(db);
      const targets = overview.applicants
        .filter((item) => item.onboarding_state === "unsent" && item.status !== "rejected")
        .slice(0, 50);

      const results: DispatchResult[] = [];
      for (const target of targets) {
        const r = await dispatchOfferOrReminder({
          db,
          applicationId: target.id,
          kind: "offer",
          origin,
          reviewerId: auth.user.id,
          settings,
        });
        results.push(r);
        // Stop early if mailer is unconfigured so we don't loop needlessly
        if (!r.success && r.reason?.includes("No email provider configured")) {
          return privateNoStore(NextResponse.json({ error: r.reason }, { status: 503 }));
        }
      }

      const sentCount = results.filter((r) => r.success && !r.skipped).length;
      const failedCount = results.filter((r) => !r.success).length;
      return privateNoStore(
        NextResponse.json({
          success: true,
          processed: results.length,
          sentCount,
          failedCount,
          results,
        }),
      );
    }

    if (action === "send_all_pending_reminders") {
      const overview = await getOnboardingOverview(db);
      const settings = await getCohortSettings(db);
      const targets = overview.applicants
        .filter((item) => item.onboarding_state === "pending_setup" && !item.account_activated)
        .slice(0, 50);

      const results: DispatchResult[] = [];
      for (const target of targets) {
        const r = await dispatchOfferOrReminder({
          db,
          applicationId: target.id,
          kind: "reminder",
          origin,
          reviewerId: auth.user.id,
          settings,
        });
        results.push(r);
        if (!r.success && r.reason?.includes("No email provider configured")) {
          return privateNoStore(NextResponse.json({ error: r.reason }, { status: 503 }));
        }
      }

      const sentCount = results.filter((r) => r.success && !r.skipped).length;
      const failedCount = results.filter((r) => !r.success).length;
      return privateNoStore(
        NextResponse.json({
          success: true,
          processed: results.length,
          sentCount,
          failedCount,
          results,
        }),
      );
    }

    return privateNoStore(NextResponse.json({ error: "Unsupported action." }, { status: 400 }));
  } catch (err) {
    console.error("[Admin Offers POST] Failed:", err);
    return privateNoStore(NextResponse.json({ error: "Unable to process offer action." }, { status: 500 }));
  }
}
