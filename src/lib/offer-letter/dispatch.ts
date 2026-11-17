import "server-only";

import { randomInt } from "crypto";
import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminDatabaseClient } from "@/lib/admin/server";
import { milestonesForTrack } from "@/lib/portal/milestone-templates";
import { generateOfferLetterPdf } from "@/lib/offer-letter/generate-pdf";
import { buildOfferEmail, buildReminderEmail, getMailerMode, sendDevatrixEmail } from "@/lib/email/mailer";

export type CohortSettings = {
  batch_start_date: string;
  batch_end_date: string;
  whatsapp_group_url: string;
  reminder_start_date: string; // YYYY-MM-DD or ""
  reminder_hour_pkt: number;   // 0..23
  auto_send_24h_enabled: boolean;
  auto_reminder_enabled: boolean;
  updated_at?: string;
};

export const DEFAULT_COHORT_SETTINGS: CohortSettings = {
  batch_start_date: "1st December 2026",
  batch_end_date: "12th January 2027",
  whatsapp_group_url: "https://wa.me/923156179410",
  reminder_start_date: "2026-11-28",
  reminder_hour_pkt: 17,
  auto_send_24h_enabled: false,
  auto_reminder_enabled: false,
};

type LocalDispatchEntry = {
  offer_letter_sent_at?: string | null;
  offer_letter_count?: number;
  reminder_sent_at?: string | null;
  reminder_count?: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const COHORT_SETTINGS_FILE = path.join(DATA_DIR, "cohort-settings.json");
const DISPATCH_LOG_FILE = path.join(DATA_DIR, "offer-dispatch-log.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalDispatchLog(): Record<string, LocalDispatchEntry> {
  try {
    if (!fs.existsSync(DISPATCH_LOG_FILE)) return {};
    const parsed = JSON.parse(fs.readFileSync(DISPATCH_LOG_FILE, "utf-8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalDispatchEntry(applicationId: string, patch: Partial<LocalDispatchEntry>) {
  try {
    ensureDataDir();
    const log = readLocalDispatchLog();
    log[applicationId] = { ...(log[applicationId] ?? {}), ...patch };
    fs.writeFileSync(DISPATCH_LOG_FILE, JSON.stringify(log, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Offer Dispatch] Local dispatch log write skipped:", err);
  }
}

export async function getCohortSettings(db?: SupabaseClient | null): Promise<CohortSettings> {
  const client = db ?? createAdminDatabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("cohort_settings")
        .select("batch_start_date,batch_end_date,whatsapp_group_url,reminder_start_date,reminder_hour_pkt,auto_send_24h_enabled,auto_reminder_enabled,updated_at")
        .eq("singleton", true)
        .maybeSingle();
      if (!error && data) {
        return {
          batch_start_date: data.batch_start_date || DEFAULT_COHORT_SETTINGS.batch_start_date,
          batch_end_date: data.batch_end_date || DEFAULT_COHORT_SETTINGS.batch_end_date,
          whatsapp_group_url: data.whatsapp_group_url || "",
          reminder_start_date: data.reminder_start_date || "",
          reminder_hour_pkt: typeof data.reminder_hour_pkt === "number" ? data.reminder_hour_pkt : 17,
          auto_send_24h_enabled: Boolean(data.auto_send_24h_enabled),
          auto_reminder_enabled: Boolean(data.auto_reminder_enabled),
          updated_at: data.updated_at,
        };
      }
    } catch {
      // Fallback to local file if migration hasn't run yet
    }
  }

  try {
    if (fs.existsSync(COHORT_SETTINGS_FILE)) {
      const saved = JSON.parse(fs.readFileSync(COHORT_SETTINGS_FILE, "utf-8"));
      return { ...DEFAULT_COHORT_SETTINGS, ...saved };
    }
  } catch {
    // Use defaults
  }
  return { ...DEFAULT_COHORT_SETTINGS };
}

export async function saveCohortSettings(input: Partial<CohortSettings>, db?: SupabaseClient | null): Promise<CohortSettings> {
  const current = await getCohortSettings(db);
  const next: CohortSettings = {
    batch_start_date: (input.batch_start_date ?? current.batch_start_date).trim() || DEFAULT_COHORT_SETTINGS.batch_start_date,
    batch_end_date: (input.batch_end_date ?? current.batch_end_date).trim() || DEFAULT_COHORT_SETTINGS.batch_end_date,
    whatsapp_group_url: (input.whatsapp_group_url ?? current.whatsapp_group_url).trim(),
    reminder_start_date: (input.reminder_start_date ?? current.reminder_start_date).trim(),
    reminder_hour_pkt: Math.max(0, Math.min(23, Number(input.reminder_hour_pkt ?? current.reminder_hour_pkt) || 17)),
    auto_send_24h_enabled: typeof input.auto_send_24h_enabled === "boolean" ? input.auto_send_24h_enabled : current.auto_send_24h_enabled,
    auto_reminder_enabled: typeof input.auto_reminder_enabled === "boolean" ? input.auto_reminder_enabled : current.auto_reminder_enabled,
    updated_at: new Date().toISOString(),
  };

  // Persist to Supabase if table exists
  const client = db ?? createAdminDatabaseClient();
  if (client) {
    try {
      await client.from("cohort_settings").upsert({
        singleton: true,
        batch_start_date: next.batch_start_date,
        batch_end_date: next.batch_end_date,
        whatsapp_group_url: next.whatsapp_group_url,
        reminder_start_date: next.reminder_start_date || null,
        reminder_hour_pkt: next.reminder_hour_pkt,
        auto_send_24h_enabled: next.auto_send_24h_enabled,
        auto_reminder_enabled: next.auto_reminder_enabled,
        updated_at: next.updated_at,
      }, { onConflict: "singleton" });
    } catch {
      // Fallback saved locally below
    }
  }

  try {
    ensureDataDir();
    fs.writeFileSync(COHORT_SETTINGS_FILE, JSON.stringify(next, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Cohort Settings] Local file save skipped:", err);
  }

  return next;
}

function generateEnrollmentCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("");
}

export type ApplicantOnboardingRow = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  track: string;
  track_slug: string | null;
  tracking_code: string | null;
  status: string;
  created_at: string;
  offer_letter_sent_at: string | null;
  offer_letter_count: number;
  reminder_sent_at: string | null;
  reminder_count: number;
  account_activated: boolean;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  onboarding_state: "activated" | "pending_setup" | "unsent";
};

export type OnboardingOverviewPayload = {
  mailerMode: "smtp" | "resend" | "none";
  settings: CohortSettings;
  counts: {
    totalRegistered: number;
    offersSent: number;
    accountsActivated: number;
    pendingSetup: number;
    unsentCount: number;
  };
  applicants: ApplicantOnboardingRow[];
};

async function fetchAllAuthUsersByEmail(db: SupabaseClient): Promise<Map<string, { id: string; email_confirmed_at: string | null; last_sign_in_at: string | null }>> {
  const map = new Map<string, { id: string; email_confirmed_at: string | null; last_sign_in_at: string | null }>();
  try {
    let page = 1;
    while (page <= 10) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error || !data?.users?.length) break;
      for (const user of data.users) {
        if (user.email) {
          map.set(user.email.toLowerCase(), {
            id: user.id,
            email_confirmed_at: user.email_confirmed_at ?? null,
            last_sign_in_at: user.last_sign_in_at ?? null,
          });
        }
      }
      if (data.users.length < 200) break;
      page++;
    }
  } catch (err) {
    console.warn("[Offer Dispatch] Unable to list auth users:", err);
  }
  return map;
}

export async function getOnboardingOverview(db: SupabaseClient): Promise<OnboardingOverviewPayload> {
  const settings = await getCohortSettings(db);
  const localLog = readLocalDispatchLog();

  // Select columns gracefully (works both before and after 20261118 SQL migration)
  let rows: any[] = [];
  const fullQuery = await db
    .from("internship_applications")
    .select("id,full_name,email,whatsapp,track,track_slug,tracking_code,status,created_at,offer_letter_sent_at,offer_letter_count,reminder_sent_at,reminder_count")
    .order("created_at", { ascending: false })
    .limit(500);

  if (!fullQuery.error && fullQuery.data) {
    rows = fullQuery.data;
  } else {
    const baseQuery = await db
      .from("internship_applications")
      .select("id,full_name,email,whatsapp,track,track_slug,tracking_code,status,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    rows = baseQuery.data ?? [];
  }

  const authByEmail = await fetchAllAuthUsersByEmail(db);

  // Also check admin_response_log for any previously sent portal_setup emails
  const priorSentAppIds = new Map<string, string>();
  try {
    const { data: logs } = await db
      .from("admin_response_log")
      .select("application_id,created_at")
      .eq("template", "portal_setup")
      .eq("delivery_status", "sent");
    for (const item of logs ?? []) {
      if (item.application_id && !priorSentAppIds.has(item.application_id)) {
        priorSentAppIds.set(item.application_id, item.created_at);
      }
    }
  } catch {
    // Non-blocking
  }

  let offersSent = 0;
  let accountsActivated = 0;
  let pendingSetup = 0;
  let unsentCount = 0;

  const applicants: ApplicantOnboardingRow[] = rows.map((row) => {
    const emailKey = String(row.email || "").toLowerCase();
    const authUser = authByEmail.get(emailKey);
    const localEntry = localLog[row.id];

    const offerSentAt: string | null =
      row.offer_letter_sent_at ??
      localEntry?.offer_letter_sent_at ??
      priorSentAppIds.get(row.id) ??
      null;

    const reminderSentAt: string | null =
      row.reminder_sent_at ?? localEntry?.reminder_sent_at ?? null;

    const accountActivated = Boolean(authUser?.email_confirmed_at || authUser?.last_sign_in_at);

    let onboardingState: "activated" | "pending_setup" | "unsent";
    if (accountActivated) {
      onboardingState = "activated";
      accountsActivated++;
      if (offerSentAt || row.status === "accepted") offersSent++;
    } else if (offerSentAt) {
      onboardingState = "pending_setup";
      offersSent++;
      pendingSetup++;
    } else {
      onboardingState = "unsent";
      unsentCount++;
    }

    return {
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      whatsapp: row.whatsapp ?? null,
      track: row.track,
      track_slug: row.track_slug ?? null,
      tracking_code: row.tracking_code ?? null,
      status: row.status,
      created_at: row.created_at,
      offer_letter_sent_at: offerSentAt,
      offer_letter_count: Number(row.offer_letter_count ?? localEntry?.offer_letter_count ?? (offerSentAt ? 1 : 0)),
      reminder_sent_at: reminderSentAt,
      reminder_count: Number(row.reminder_count ?? localEntry?.reminder_count ?? (reminderSentAt ? 1 : 0)),
      account_activated: accountActivated,
      email_confirmed_at: authUser?.email_confirmed_at ?? null,
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
      onboarding_state: onboardingState,
    };
  });

  return {
    mailerMode: getMailerMode(),
    settings,
    counts: {
      totalRegistered: applicants.length,
      offersSent,
      accountsActivated,
      pendingSetup,
      unsentCount,
    },
    applicants,
  };
}

async function ensureAcceptedAndEnrolled(
  db: SupabaseClient,
  application: { id: string; track: string; track_slug: string | null; status: string },
  reviewerId: string | null,
) {
  if (application.status === "accepted") {
    // Ensure portal access is marked active
    await db.from("intern_portal_access").update({ is_active: true }).eq("application_id", application.id);
    return;
  }

  let slug = application.track_slug;
  if (!slug) {
    const { data: trackRow } = await db
      .from("site_content")
      .select("slug")
      .eq("content_type", "internship_track")
      .eq("title", application.track)
      .maybeSingle();
    slug = trackRow?.slug ?? "web-fullstack";
  }

  const startedAt = new Date();
  const expectedEndAt = new Date(startedAt.getTime() + 42 * 24 * 60 * 60 * 1000);

  let rpcSucceeded = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await db.rpc("accept_internship_application", {
      p_application_id: application.id,
      p_reviewer_id: reviewerId,
      p_enrollment_code: generateEnrollmentCode(),
      p_started_at: startedAt.toISOString(),
      p_expected_end_at: expectedEndAt.toISOString(),
      p_milestones: milestonesForTrack(slug || "web-fullstack").map(({ week, title, instructions }) => ({
        week_number: week,
        title,
        instructions,
      })),
      p_admin_notes: "Automatically accepted via Devatrix Offer Letter dispatch.",
    });
    if (!res.error) {
      rpcSucceeded = true;
      break;
    }
  }

  if (!rpcSucceeded) {
    // Direct fallback update so acceptance never silently fails
    await db
      .from("internship_applications")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", application.id);
    await db
      .from("intern_portal_access")
      .update({ is_active: true })
      .eq("application_id", application.id);
  }
}

export type DispatchResult = {
  applicationId: string;
  email: string;
  success: boolean;
  skipped?: boolean;
  reason?: string;
};

export async function dispatchOfferOrReminder(opts: {
  db: SupabaseClient;
  applicationId: string;
  kind: "offer" | "reminder";
  origin: string;
  reviewerId: string | null;
  settings?: CohortSettings;
}): Promise<DispatchResult> {
  const { db, applicationId, kind, origin, reviewerId } = opts;
  const settings = opts.settings ?? (await getCohortSettings(db));

  const { data: app, error: appErr } = await db
    .from("internship_applications")
    .select("id,full_name,email,track,track_slug,tracking_code,status")
    .eq("id", applicationId)
    .maybeSingle();

  if (appErr || !app) {
    return { applicationId, email: "", success: false, reason: "Application not found." };
  }

  const recipient = app.email.toLowerCase();

  // Check Auth activation state
  const authUsers = await fetchAllAuthUsersByEmail(db);
  const authUser = authUsers.get(recipient);
  const isActivated = Boolean(authUser?.email_confirmed_at || authUser?.last_sign_in_at);

  if (kind === "reminder" && isActivated) {
    return { applicationId, email: recipient, success: true, skipped: true, reason: "Account already activated." };
  }

  // Ensure application is accepted & enrolled in portal
  await ensureAcceptedAndEnrolled(db, app, reviewerId);

  // Generate fresh cryptographic single-use setup link if account is not confirmed yet
  let setupUrl: string | null = null;
  if (!isActivated) {
    const { data: linkData, error: linkErr } = await db.auth.admin.generateLink({
      type: "magiclink",
      email: recipient,
    });
    const tokenHash = linkData?.properties?.hashed_token;
    if (linkErr || !tokenHash) {
      return { applicationId, email: recipient, success: false, reason: linkErr?.message || "Failed to generate setup link." };
    }
    const urlObj = new URL("/portal/set-password", origin);
    urlObj.hash = new URLSearchParams({ token_hash: tokenHash, email: recipient }).toString();
    setupUrl = urlObj.toString();
  }

  const portalSignInUrl = new URL("/portal/sign-in", origin).toString();
  const templateInput = {
    fullName: app.full_name,
    track: app.track,
    startDate: settings.batch_start_date,
    endDate: settings.batch_end_date,
    studentEmail: recipient,
    trackingCode: app.tracking_code || app.id.slice(0, 6).toUpperCase(),
    setupUrl,
    portalSignInUrl,
    whatsappGroupUrl: settings.whatsapp_group_url || undefined,
  };

  const mailContent = kind === "offer" ? buildOfferEmail(templateInput) : buildReminderEmail(templateInput);

  // Attach freshly generated personalized A4 Offer Letter PDF on Offer emails
  const attachments = [];
  if (kind === "offer") {
    const pdfBuffer = await generateOfferLetterPdf({
      fullName: app.full_name,
      track: app.track,
      startDate: settings.batch_start_date,
      endDate: settings.batch_end_date,
    });
    const cleanFileName = `${app.full_name.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Candidate"} - Devatrix Offer Letter.pdf`;
    attachments.push({
      filename: cleanFileName,
      content: pdfBuffer,
      contentType: "application/pdf",
    });
  }

  const nowIso = new Date().toISOString();
  const dateTag = nowIso.slice(0, 10);
  const sendRes = await sendDevatrixEmail({
    to: recipient,
    subject: mailContent.subject,
    text: mailContent.text,
    html: mailContent.html,
    attachments,
    idempotencyKey: `${kind}/${app.id}/${dateTag}/${Date.now()}`,
  });

  if (!sendRes.sent) {
    return { applicationId, email: recipient, success: false, reason: sendRes.error || "Email delivery failed." };
  }

  // Record timestamp cleanly in Supabase (if migrated) AND local tracker
  const localLog = readLocalDispatchLog();
  const prev = localLog[app.id] ?? {};
  if (kind === "offer") {
    const nextCount = (prev.offer_letter_count ?? 0) + 1;
    writeLocalDispatchEntry(app.id, { offer_letter_sent_at: nowIso, offer_letter_count: nextCount });
    await db
      .from("internship_applications")
      .update({ offer_letter_sent_at: nowIso, offer_letter_count: nextCount })
      .eq("id", app.id)
      .then(() => undefined, () => undefined);
  } else {
    const nextCount = (prev.reminder_count ?? 0) + 1;
    writeLocalDispatchEntry(app.id, { reminder_sent_at: nowIso, reminder_count: nextCount });
    await db
      .from("internship_applications")
      .update({ reminder_sent_at: nowIso, reminder_count: nextCount })
      .eq("id", app.id)
      .then(() => undefined, () => undefined);
  }

  return { applicationId, email: recipient, success: true };
}
