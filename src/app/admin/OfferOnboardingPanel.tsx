"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileDown,
  LoaderCircle,
  Mail,
  RefreshCw,
  Save,
  Search,
  Send,
  UserCheck,
  Users,
} from "lucide-react";

type CohortSettings = {
  batch_start_date: string;
  batch_end_date: string;
  whatsapp_group_url: string;
  reminder_start_date: string;
  reminder_hour_pkt: number;
  auto_send_24h_enabled: boolean;
  auto_reminder_enabled: boolean;
};

type ApplicantRow = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  track: string;
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

type OverviewData = {
  mailerMode: "smtp" | "resend" | "none";
  settings: CohortSettings;
  counts: {
    totalRegistered: number;
    offersSent: number;
    accountsActivated: number;
    pendingSetup: number;
    unsentCount: number;
  };
  applicants: ApplicantRow[];
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function OfferOnboardingPanel() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "activated" | "pending_setup" | "unsent">("all");
  const [query, setQuery] = useState("");
  const [settingsForm, setSettingsForm] = useState<CohortSettings>({
    batch_start_date: "1st December 2026",
    batch_end_date: "12th January 2027",
    whatsapp_group_url: "",
    reminder_start_date: "2026-11-28",
    reminder_hour_pkt: 17,
    auto_send_24h_enabled: false,
    auto_reminder_enabled: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/offers", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to load offer letter analytics.");
      const payload = json as OverviewData;
      setData(payload);
      setSettingsForm(payload.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load offer letter analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleApplicants = useMemo(() => {
    const list = data?.applicants ?? [];
    return list.filter((row) => {
      if (filter !== "all" && row.onboarding_state !== filter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${row.full_name} ${row.email} ${row.track} ${row.tracking_code ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, filter, query]);

  async function runAction(key: string, payload: Record<string, unknown>, onSuccessMessage: (res: any) => string) {
    setBusyKey(key);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Action failed.");
      setNotice(onSuccessMessage(json));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyKey("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#061833]">Offer Letters &amp; Learner Onboarding</h2>
          <p className="mt-1 text-sm text-slate-600">
            Track registered students, offer deliveries, portal account activations, and send automated or 1-click batch emails with PDF offer letters.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-[#061833] hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Status
        </button>
      </div>

      {/* Mailer Status Alert */}
      {data?.mailerMode === "none" && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <div className="flex items-start gap-2.5">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="font-bold">Company Email SMTP / Resend Not Connected Yet</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-900">
                PDF Offer Letter previews and live analytics are active right now. To send live emails from{" "}
                <strong>devatrixtechnologies@gmail.com</strong>, add{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">SMTP_HOST</code>,{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">SMTP_USER</code>, and{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">SMTP_PASS</code> (or{" "}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">RESEND_API_KEY</code>) to <code className="font-mono">.env.local</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {data && data.mailerMode !== "none" && !data.settings.auto_send_24h_enabled && !data.settings.auto_reminder_enabled && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-950 flex items-start gap-2.5">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div>
            <p className="font-bold">Intake-Only Mode — Automated Emails Paused</p>
            <p className="mt-0.5 text-amber-900 leading-relaxed">
              New internship applications are being saved directly to Supabase with instant Tracking IDs, and zero automated emails are being sent. When your Learner Portal is ready, enable <strong>Autopilot</strong> below and click <strong>Save Settings</strong> (or click <strong>Send Offers to All Unsent</strong> to catch up everyone in one click).
            </p>
          </div>
        </div>
      )}

      {data && data.mailerMode !== "none" && (data.settings.auto_send_24h_enabled || data.settings.auto_reminder_enabled) && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          Autopilot Active ({data.mailerMode === "smtp" ? "Company SMTP Mail" : "Resend API"}) — PDF Offer Letters attach automatically.
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          {notice}
        </div>
      )}

      {/* 4 Live Onboarding Counters */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Total Registered</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#061833] tabular-nums">{data?.counts.totalRegistered ?? "—"}</p>
          <p className="mt-1 text-xs text-slate-500">{data?.counts.unsentCount ?? 0} awaiting first offer</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Offers Sent</span>
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#061833] tabular-nums">{data?.counts.offersSent ?? "—"}</p>
          <p className="mt-1 text-xs text-slate-500">PDF + portal link dispatched</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Accounts Active</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-900 tabular-nums">{data?.counts.accountsActivated ?? "—"}</p>
          <p className="mt-1 text-xs text-emerald-800/80">Password set &amp; logged in</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-900">
            <span>Pending Setup</span>
            <Clock3 className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-950 tabular-nums">{data?.counts.pendingSetup ?? "—"}</p>
          <p className="mt-1 text-xs text-amber-900/80">Offer sent, not activated yet</p>
        </div>
      </div>

      {/* One-Click Bulk Dispatch Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#061833]">One-Click Batch Actions</p>
          <p className="text-xs text-slate-500">Send personalized PDF offer letters to all unsent applicants, or nudge only un-activated accounts.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={Boolean(busyKey) || !data?.counts.unsentCount}
            onClick={() =>
              void runAction(
                "bulk_offer",
                { action: "send_all_unsent" },
                (res) => `Dispatched ${res.sentCount} offer letter(s) with PDF attachments${res.failedCount ? ` (${res.failedCount} failed)` : ""}.`,
              )
            }
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#061833] px-4 text-xs font-bold text-white hover:bg-[#10294e] disabled:opacity-50"
          >
            {busyKey === "bulk_offer" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-amber-400" />}
            Send Offers to All Unsent ({data?.counts.unsentCount ?? 0})
          </button>

          <button
            type="button"
            disabled={Boolean(busyKey) || !data?.counts.pendingSetup}
            onClick={() =>
              void runAction(
                "bulk_reminder",
                { action: "send_all_pending_reminders" },
                (res) => `Sent ${res.sentCount} setup reminder(s) to pending learners${res.failedCount ? ` (${res.failedCount} failed)` : ""}.`,
              )
            }
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-amber-400 bg-amber-50 px-4 text-xs font-bold text-amber-950 hover:bg-amber-100 disabled:opacity-50"
          >
            {busyKey === "bulk_reminder" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4 text-amber-700" />}
            Send Reminder to All Pending ({data?.counts.pendingSetup ?? 0})
          </button>
        </div>
      </div>

      {/* Cohort Dates, WhatsApp Link & Daily Reminder Schedule */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#061833]">Cohort Dates &amp; Automated Reminder Schedule</h3>
            <p className="text-xs text-slate-500">These dates and WhatsApp link are automatically inserted into every Offer Letter PDF and email.</p>
          </div>
          <button
            type="button"
            disabled={Boolean(busyKey)}
            onClick={() =>
              void runAction(
                "save_settings",
                { action: "save_cohort_settings", ...settingsForm },
                () => "Cohort dates and reminder schedule saved.",
              )
            }
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#061833] px-3.5 text-xs font-bold text-white hover:bg-[#10294e] disabled:opacity-60"
          >
            {busyKey === "save_settings" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Settings
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-slate-600">Batch Start Date</label>
            <input
              type="text"
              value={settingsForm.batch_start_date}
              onChange={(e) => setSettingsForm((s) => ({ ...s, batch_start_date: e.target.value }))}
              placeholder="1st December 2026"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-600">Batch End Date (6 Weeks)</label>
            <input
              type="text"
              value={settingsForm.batch_end_date}
              onChange={(e) => setSettingsForm((s) => ({ ...s, batch_end_date: e.target.value }))}
              placeholder="12th January 2027"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-600">Interns WhatsApp Group Link</label>
            <input
              type="url"
              value={settingsForm.whatsapp_group_url}
              onChange={(e) => setSettingsForm((s) => ({ ...s, whatsapp_group_url: e.target.value }))}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-600">Daily Reminder Start Date</label>
            <input
              type="date"
              value={settingsForm.reminder_start_date}
              onChange={(e) => setSettingsForm((s) => ({ ...s, reminder_start_date: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-600">Daily Reminder Time (PKT)</label>
            <select
              value={settingsForm.reminder_hour_pkt}
              onChange={(e) => setSettingsForm((s) => ({ ...s, reminder_hour_pkt: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-amber-500"
            >
              <option value={14}>2:00 PM PKT</option>
              <option value={15}>3:00 PM PKT</option>
              <option value={16}>4:00 PM PKT</option>
              <option value={17}>5:00 PM PKT</option>
              <option value={18}>6:00 PM PKT</option>
              <option value={19}>7:00 PM PKT</option>
              <option value={20}>8:00 PM PKT</option>
            </select>
          </div>
          <div className="flex flex-col justify-center gap-2 pt-1">
            <label className="inline-flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.auto_send_24h_enabled}
                onChange={(e) => setSettingsForm((s) => ({ ...s, auto_send_24h_enabled: e.target.checked }))}
                className="rounded border-slate-300"
              />
              Auto-send offer 24h after applying
            </label>
            <label className="inline-flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.auto_reminder_enabled}
                onChange={(e) => setSettingsForm((s) => ({ ...s, auto_reminder_enabled: e.target.checked }))}
                className="rounded border-slate-300"
              />
              Auto-send daily reminders to pending
            </label>
          </div>
        </div>
      </div>

      {/* Live Student Onboarding Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", `All (${data?.counts.totalRegistered ?? 0})`],
                ["activated", `Active (${data?.counts.accountsActivated ?? 0})`],
                ["pending_setup", `Pending Setup (${data?.counts.pendingSetup ?? 0})`],
                ["unsent", `Unsent (${data?.counts.unsentCount ?? 0})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  filter === key ? "bg-[#061833] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="relative block w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search student, track, code..."
              className="w-full rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-amber-500"
            />
          </label>
        </div>

        {loading && !data ? (
          <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-slate-500">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Loading student onboarding status...
          </div>
        ) : visibleApplicants.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No applicants match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Track</th>
                  <th className="px-4 py-3">Onboarding State</th>
                  <th className="px-4 py-3">Offer Sent</th>
                  <th className="px-4 py-3">Account Activity</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleApplicants.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#061833]">{row.full_name}</p>
                      <p className="text-[11px] text-slate-500">{row.email}</p>
                      {row.tracking_code && (
                        <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                          {row.tracking_code}
                        </span>
                      )}
                    </td>
                    <td className="max-w-52 truncate px-4 py-3.5 font-medium text-slate-700">{row.track}</td>
                    <td className="px-4 py-3.5">
                      {row.onboarding_state === "activated" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800 ring-1 ring-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active / Logged In
                        </span>
                      ) : row.onboarding_state === "pending_setup" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-900 ring-1 ring-amber-200">
                          <Clock3 className="h-3.5 w-3.5" /> Pending Setup
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-600 ring-1 ring-slate-200">
                          Offer Unsent
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <div>{fmtDate(row.offer_letter_sent_at)}</div>
                      {row.reminder_count > 0 && (
                        <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                          Reminded {row.reminder_count}x
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {row.account_activated ? (
                        <div>
                          <span className="font-semibold text-emerald-800">Confirmed</span>
                          <div className="text-[10px] text-slate-500">
                            {row.last_sign_in_at ? `Last login: ${fmtDate(row.last_sign_in_at)}` : fmtDate(row.email_confirmed_at)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Not signed in yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <a
                          href={`/api/admin/offers/preview-pdf?id=${encodeURIComponent(row.id)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#061833] hover:bg-slate-100"
                          title="Preview / Download Offer Letter PDF"
                        >
                          <FileDown className="h-3.5 w-3.5 text-amber-600" />
                          PDF
                        </a>

                        <button
                          type="button"
                          disabled={Boolean(busyKey)}
                          onClick={() =>
                            void runAction(
                              `offer-${row.id}`,
                              { action: "resend_single", applicationId: row.id, kind: "offer" },
                              () => `Offer Letter PDF & portal link sent to ${row.email}.`,
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-[#061833] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#10294e] disabled:opacity-50"
                        >
                          {busyKey === `offer-${row.id}` ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
                          {row.offer_letter_sent_at ? "Resend Offer" : "Send Offer"}
                        </button>

                        {row.onboarding_state === "pending_setup" && (
                          <button
                            type="button"
                            disabled={Boolean(busyKey)}
                            onClick={() =>
                              void runAction(
                                `rem-${row.id}`,
                                { action: "resend_single", applicationId: row.id, kind: "reminder" },
                                () => `Setup reminder sent to ${row.email}.`,
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-400 bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-950 hover:bg-amber-100 disabled:opacity-50"
                          >
                            {busyKey === `rem-${row.id}` ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                            Remind
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
