import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient } from "@/lib/admin/server";
import { dispatchOfferOrReminder, getOnboardingOverview } from "@/lib/offer-letter/dispatch";

export const dynamic = "force-dynamic";

function getPktDateAndHour(now = new Date()): { pktDate: string; pktHour: number } {
  // Pakistan Standard Time is UTC+5 year-round (no DST)
  const pktMs = now.getTime() + 5 * 60 * 60 * 1000;
  const pkt = new Date(pktMs);
  const pktDate = pkt.toISOString().slice(0, 10);
  const pktHour = pkt.getUTCHours();
  return { pktDate, pktHour };
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminDatabaseClient();
  if (!db) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  try {
    const overview = await getOnboardingOverview(db);
    const { settings } = overview;
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    let offersSent = 0;
    let offersFailed = 0;
    let remindersSent = 0;
    let remindersFailed = 0;

    // 1. Automated 24-Hour Offer Letter Queue
    if (settings.auto_send_24h_enabled) {
      const cutoffMs = Date.now() - 24 * 60 * 60 * 1000;
      const dueForOffer = overview.applicants
        .filter((app) => app.onboarding_state === "unsent" && app.status !== "rejected" && Date.parse(app.created_at) <= cutoffMs)
        .slice(0, 25);

      for (const app of dueForOffer) {
        const res = await dispatchOfferOrReminder({
          db,
          applicationId: app.id,
          kind: "offer",
          origin,
          reviewerId: null,
          settings,
        });
        if (res.success && !res.skipped) offersSent++;
        else if (!res.success) {
          offersFailed++;
          if (res.reason?.includes("No email provider configured")) break;
        }
      }
    }

    // 2. Cohort-Driven Daily Reminder Engine (PKT Timezone, Hobby daily-cron safe)
    const { pktDate, pktHour } = getPktDateAndHour();
    if (
      settings.auto_reminder_enabled &&
      settings.reminder_start_date &&
      pktDate >= settings.reminder_start_date
    ) {
      const dueForReminder = overview.applicants
        .filter((app) => {
          if (app.onboarding_state !== "pending_setup" || app.account_activated) return false;
          // Prevent sending more than once per PKT calendar day
          if (app.reminder_sent_at) {
            const lastPktDate = getPktDateAndHour(new Date(app.reminder_sent_at)).pktDate;
            if (lastPktDate === pktDate) return false;
          }
          return true;
        })
        .slice(0, 25);

      for (const app of dueForReminder) {
        const res = await dispatchOfferOrReminder({
          db,
          applicationId: app.id,
          kind: "reminder",
          origin,
          reviewerId: null,
          settings,
        });
        if (res.success && !res.skipped) remindersSent++;
        else if (!res.success) {
          remindersFailed++;
          if (res.reason?.includes("No email provider configured")) break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      pktDate,
      pktHour,
      offersSent,
      offersFailed,
      remindersSent,
      remindersFailed,
    });
  } catch (err) {
    console.error("[Cron Onboarding] Failed:", err);
    return NextResponse.json({ error: "Cron processing failed." }, { status: 500 });
  }
}
