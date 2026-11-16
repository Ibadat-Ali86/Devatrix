"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownToLine, ArrowLeft, ArrowRight, Bell, BriefcaseBusiness, Check, CheckCircle2,
  CircleAlert, Clock3, FileText, LayoutDashboard, LoaderCircle, LogOut,
  Mail, PencilLine, Search, ShieldCheck, Sparkles, Users, X,
} from "lucide-react";
import { parseFooterSettings } from "@/lib/content/footer";

type Section = "overview" | "internship" | "career" | "content";
type Application = Record<string, unknown> & { id: string; full_name: string; email: string; status: string; created_at: string };
type ContentItem = { slug: string; content_type: string; title: string; summary: string; badge: string; content: unknown; is_published: boolean; sort_order: number; updated_at: string };
type Overview = { counts: { internships: number; careers: number }; recent: Array<Application & { kind: "internship" | "career"; position: string }> };

const internshipStatuses = ["under_review", "in_review", "shortlisted", "rejected", "accepted", "completed"];
const careerStatuses = ["review_pending", "in_review", "shortlisted", "rejected", "hired"];
const sectionNames: Record<Section, string> = { overview: "Overview", internship: "Internship applications", career: "Career applications", content: "Website content" };

function statusLabel(status: string) { return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function valueText(value: unknown) { return typeof value === "string" && value ? value : "—"; }
function safeWebUrl(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.href : null; }
  catch { return null; }
}
function dateText(value: unknown) { return typeof value === "string" ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—"; }
function statusClass(status: string) {
  if (["shortlisted", "accepted", "hired", "completed"].includes(status)) return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (["rejected"].includes(status)) return "bg-rose-50 text-rose-800 ring-rose-200";
  if (["in_review"].includes(status)) return "bg-blue-50 text-blue-800 ring-blue-200";
  return "bg-amber-50 text-amber-900 ring-amber-200";
}

function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500">{children}</button>;
}

export default function AdminConsole({ email }: { email: string }) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [submittedWithin, setSubmittedWithin] = useState("all");
  const [search, setSearch] = useState("");
  const [listLoading, setListLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [portalEmailSending, setPortalEmailSending] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentDrafts, setContentDrafts] = useState<Record<string, Partial<ContentItem>>>({});
  const emailRequestKeys = useRef<Record<string, string>>({});
  const currentKind = section === "career" ? "career" : "internship";

  const loadOverview = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load the admin overview.");
      setOverview(await response.json());
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load the admin overview."); }
    finally { setOverviewLoading(false); }
  }, []);

  const loadApplications = useCallback(async () => {
    if (section !== "career" && section !== "internship") return;
    try {
      const params = new URLSearchParams({ kind: currentKind, status, submittedWithin, page: String(page), q: search });
      const response = await fetch(`/api/admin/applications?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load applications.");
      setApplications(data.applications);
      setTotal(data.total);
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load applications."); }
    finally { setListLoading(false); }
  }, [section, currentKind, status, submittedWithin, page, search]);

  const loadContent = useCallback(async () => {
    if (section !== "content") return;
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load website content.");
      setItems(data.items);
      setContentDrafts({});
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load website content."); }
    finally { setContentLoading(false); }
  }, [section]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadOverview(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadOverview]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadApplications(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadApplications]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadContent(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadContent]);

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/sign-in");
  }

  function selectSection(next: Section) {
    setSection(next);
    setPage(1);
    setError("");
    if (next === "content") setContentLoading(true);
    if (next === "internship" || next === "career") setListLoading(true);
  }

  async function openRecentApplication(kind: "internship" | "career", id: string) {
    selectSection(kind);
    try {
      const params = new URLSearchParams({ kind, page: "1", status: "all", q: "" });
      const response = await fetch(`/api/admin/applications?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not open this application.");
      const application = (data.applications as Application[]).find((row) => row.id === id);
      if (!application) throw new Error("This application has moved. Refresh the list and try again.");
      setSelected(application);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open this application.");
    }
  }

  async function exportCsv(kind: "internship" | "career") {
    setExporting(true);
    setError("");
    setNotice("");
    try {
      const params = new URLSearchParams({ kind, status, submittedWithin, q: search });
      const response = await fetch(`/api/admin/export?${params}`, { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Export failed.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1]
        ?? `devatrix-${kind}-applications.csv`;
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      const count = Number(response.headers.get("X-Exported-Count") ?? 0);
      setNotice(`CSV download started: ${count.toLocaleString()} ${kind} application${count === 1 ? "" : "s"}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  async function saveApplication(fields: { status?: string; notes?: string }) {
    if (!selected) return;
    const response = await fetch("/api/admin/applications/update", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: section === "career" ? "career" : "internship", id: selected.id, ...fields }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Unable to save changes."); return; }
    const updated = { ...selected, ...data.application } as Application;
    setSelected(updated);
    setApplications((previous) => previous.map((item) => item.id === selected.id ? updated : item));
    setNotice("Application updated.");
    void loadOverview();
  }

  async function sendResponse(template: string) {
    if (!selected) return;
    setNotice("");
    setError("");
    const requestKey = `${selectedKind}:${selected.id}:${template}`;
    const requestId = emailRequestKeys.current[requestKey] ?? crypto.randomUUID();
    emailRequestKeys.current[requestKey] = requestId;
    const response = await fetch("/api/admin/applications/respond", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: section === "career" ? "career" : "internship", id: selected.id, template, requestId }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Unable to send the email."); return; }
    delete emailRequestKeys.current[requestKey];
    setNotice(data.alreadySent ? "This response was already sent." : `Response sent to ${String(selected.email)}.`);
  }

  async function sendPortalAccess() {
    if (!selected || selectedKind !== "internship" || selected.status !== "accepted" || portalEmailSending) return;
    setNotice("");
    setError("");
    const requestKey = `internship:${selected.id}:portal_setup`;
    const requestId = emailRequestKeys.current[requestKey] ?? crypto.randomUUID();
    emailRequestKeys.current[requestKey] = requestId;
    setPortalEmailSending(true);
    try {
      const response = await fetch("/api/admin/applications/portal-access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, requestId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.error || "Unable to send portal access."); return; }
      delete emailRequestKeys.current[requestKey];
      setNotice(data.alreadySent ? "Portal access email was already sent." : `Portal setup link and tracking ID sent to ${String(selected.email)}.`);
    } catch {
      setError("The portal email could not be sent. Please check your connection and try again.");
    } finally {
      setPortalEmailSending(false);
    }
  }

  async function saveContent(item: ContentItem) {
    const draft = { ...item, ...(contentDrafts[item.slug] ?? {}) };
    const response = await fetch("/api/admin/content", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: item.slug, title: draft.title, summary: draft.summary, badge: draft.badge, isPublished: draft.is_published, ...(item.content_type === "footer_details" ? { content: draft.content } : {}) }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Unable to save content."); return; }
    setItems((previous) => previous.map((entry) => entry.slug === item.slug ? { ...entry, ...data.item } : entry));
    setContentDrafts((previous) => { const next = { ...previous }; delete next[item.slug]; return next; });
    setNotice("Website content published.");
  }

  const activeStatusOptions = currentKind === "career" ? careerStatuses : internshipStatuses;
  const detailFields = selected ? Object.entries(selected).filter(([key]) => !["id", "created_at", "updated_at", "reviewed_at", "reviewed_by", "admin_review_notes", "status"].includes(key) && key !== "tracking_code" && key !== "email").filter(([, value]) => value !== null && value !== "") : [];
  const selectedResume = selected ? safeWebUrl(selected.resume_url) : null;
  const selectedKind = section === "career" ? "career" : "internship";

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#071a36] text-white lg:flex">
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#071a36]"><Image src="/logo-transparent.png" alt="Devatrix logo" fill sizes="40px" className="object-contain p-1" priority/></div>
            <div><p className="font-bold">Devatrix</p><p className="text-[10px] font-semibold uppercase tracking-[.17em] text-slate-400">Admin workspace</p></div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Admin sections">
            {(["overview", "internship", "career", "content"] as Section[]).map((key) => {
              const Icon = key === "overview" ? LayoutDashboard : key === "internship" ? Users : key === "career" ? BriefcaseBusiness : PencilLine;
              return <button key={key} onClick={() => selectSection(key)} className={`flex min-h-11 w-full items-center gap-3 rounded-lg border-l-2 px-3 text-left text-sm font-semibold transition-colors ${section === key ? "border-amber-400 bg-white/10 text-white" : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"}`}><Icon className={`h-4 w-4 ${section === key ? "text-amber-400" : "text-slate-400"}`} aria-hidden="true" />{sectionNames[key]}</button>;
            })}
            <Link href="/admin/learners" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"><Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true"/>Learner program</Link>
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 p-3"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true"/><span className="truncate text-xs font-medium text-slate-200">{email}</span></div>
            <button onClick={signOut} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"><LogOut className="h-4 w-4" aria-hidden="true"/>Sign out</button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
              <div className="flex min-w-0 items-center gap-3"><div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#071a36] p-1 lg:hidden"><Image src="/logo-transparent.png" alt="Devatrix logo" fill sizes="36px" className="object-contain p-1" priority/></div><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">Devatrix Technologies</p><h1 className="truncate text-lg font-bold sm:text-xl">{sectionNames[section]}</h1></div></div>
              <div className="flex items-center gap-2"><span className="hidden max-w-52 truncate text-xs text-slate-500 sm:block">{email}</span><IconButton label="Sign out" onClick={signOut}><LogOut className="h-4 w-4"/></IconButton></div>
            </div>
            <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden" aria-label="Admin sections">
              {(["overview", "internship", "career", "content"] as Section[]).map((key) => <button key={key} onClick={() => selectSection(key)} className={`min-h-10 shrink-0 rounded-lg px-3 text-xs font-semibold ${section === key ? "bg-[#071a36] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{sectionNames[key]}</button>)}
              <Link href="/admin/learners" className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-amber-50 px-3 text-xs font-semibold text-amber-950">Learner program</Link>
            </nav>
          </header>

          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10">
            {error && <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true"/>{error}<button className="ml-auto underline" onClick={() => setError("")}>Dismiss</button></div>}
            {notice && <div role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true"/>{notice}<button className="ml-auto underline" onClick={() => setNotice("")}>Dismiss</button></div>}

            {section === "overview" && <>
                <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-600">A clear view of recent applications and website content.</p><p className="mt-1 text-xs text-slate-500">Applicant information is available only to this authorized workspace.</p></div><button onClick={() => { setOverviewLoading(true); void loadOverview(); }} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold hover:bg-slate-50"><Clock3 className="h-4 w-4" aria-hidden="true"/>Refresh</button></div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard label="Internship applications" number={overview?.counts.internships} loading={overviewLoading} icon={<Users className="h-5 w-5"/>} accent="amber" onClick={() => selectSection("internship")}/>
                <StatCard label="Career applications" number={overview?.counts.careers} loading={overviewLoading} icon={<BriefcaseBusiness className="h-5 w-5"/>} accent="blue" onClick={() => selectSection("career")}/>
                <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2 xl:col-span-1"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><ShieldCheck className="h-5 w-5"/></div><p className="text-sm font-semibold text-slate-600">Access protection</p><p className="mt-1 font-semibold">Supabase Auth + allowlist</p><p className="mt-1 text-xs text-slate-500">Private data is read on the server after authorization.</p></div>
              </div>
              <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6"><div><h2 className="font-bold">Recently received</h2><p className="mt-1 text-xs text-slate-500">Latest submissions from both application forms</p></div><Bell className="h-4 w-4 text-slate-400" aria-hidden="true"/></div>
                {overviewLoading ? <LoadingRows/> : !overview?.recent.length ? <EmptyState text="No applications have been submitted yet."/> : <div className="divide-y divide-slate-100">{overview.recent.map((item) => <button key={`${item.kind}-${item.id}`} onClick={() => void openRecentApplication(item.kind, item.id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:grid-cols-[minmax(150px,1fr)_minmax(140px,1.2fr)_minmax(120px,1fr)_minmax(100px,.7fr)_auto] sm:px-6"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.full_name}</span><span className="mt-1 block truncate text-xs text-slate-500 sm:hidden">{item.kind === "career" ? "Career" : "Internship"} · {item.position}</span><span className="mt-1 block font-mono text-[11px] font-semibold tracking-wide text-amber-800 sm:hidden">{item.kind === "internship" ? `Tracking ID · ${String(item.tracking_code ?? "Pending")}` : "Career application"}</span></span><span className="hidden truncate text-sm text-slate-600 sm:block">{item.email}</span><span className="hidden truncate text-sm text-slate-600 sm:block">{item.position}</span><span className="hidden min-w-0 truncate rounded-md bg-amber-50 px-2 py-1 font-mono text-xs font-semibold text-amber-900 sm:block">{item.kind === "internship" ? String(item.tracking_code ?? "Pending") : "Career application"}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusClass(item.status)}`}>{statusLabel(item.status)}</span></button>)}</div>}
              </section>
              <p className="mt-5 text-xs leading-5 text-slate-500">CSV exports include applicant-submitted details and review notes. Keep downloaded files in an approved private location.</p>
            </>}

            {(section === "internship" || section === "career") && <>
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div><p className="text-sm text-slate-600">Search, review, update status, save private notes, and send an approved email response.</p><p className="mt-1 text-xs text-slate-500">Résumé links submitted by applicants open in a separate tab.</p></div>
                <button onClick={() => void exportCsv(currentKind)} disabled={exporting} aria-busy={exporting} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#071a36] px-4 text-sm font-bold text-white hover:bg-[#102b51] disabled:cursor-wait disabled:opacity-60"><ArrowDownToLine className="h-4 w-4" aria-hidden="true"/>{exporting ? "Preparing CSV…" : "Export filtered CSV"}</button>
                <p className="text-xs leading-5 text-slate-500 xl:self-center">Exports every matching record, including the current search, status, and submission date filters.</p>
              </div>
              <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_200px_220px]">
                <label className="relative block"><span className="sr-only">Search applications</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true"/><input value={search} onChange={(event) => { setListLoading(true); setPage(1); setSearch(event.target.value); }} placeholder="Search by name or email" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"/></label>
                <label><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => { setListLoading(true); setPage(1); setStatus(event.target.value); }} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"><option value="all">All statuses</option>{activeStatusOptions.map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select></label>
                <label><span className="sr-only">Filter by submission date</span><select value={submittedWithin} onChange={(event) => { setListLoading(true); setPage(1); setSubmittedWithin(event.target.value); }} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"><option value="all">Any submission date</option><option value="24h">Last 24 hours</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select></label>
              </div>
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-5"><span>{total} application{total === 1 ? "" : "s"}</span><span>Page {page} · up to 50 per page</span></div>
                {listLoading ? <LoadingRows/> : !applications.length ? <EmptyState text={currentKind === "career" ? "No matching career applications. Six-character tracking IDs appear with internship applications." : "No matching internship applications. Try a different search or status."}/> : <>
                  <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[820px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Applicant</th><th className="px-5 py-3 font-semibold">{currentKind === "career" ? "Role" : "Track"}</th><th className="px-5 py-3 font-semibold">{currentKind === "career" ? "Application ID" : "Tracking ID"}</th><th className="px-5 py-3 font-semibold">Submitted</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3"/></tr></thead><tbody className="divide-y divide-slate-100">{applications.map((application) => <ApplicationRow key={application.id} application={application} kind={currentKind} onOpen={() => setSelected(application)}/>)}</tbody></table></div>
                  <div className="divide-y divide-slate-100 md:hidden">{applications.map((application) => <button key={application.id} onClick={() => setSelected(application)} className="w-full px-4 py-4 text-left transition-colors hover:bg-slate-50"><span className="flex items-start justify-between gap-3"><span className="min-w-0"><span className="block truncate font-semibold">{application.full_name}</span><span className="mt-1 block truncate text-xs text-slate-500">{application.email}</span><span className="mt-2 block font-mono text-xs font-bold tracking-wider text-amber-800">{currentKind === "career" ? "Application ID" : "Tracking ID"}: {String(currentKind === "career" ? application.id : application.tracking_code ?? "Pending")}</span></span><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusClass(application.status)}`}>{statusLabel(application.status)}</span></span><span className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500"><span className="truncate">{String(application.track ?? application.role ?? "")}</span><span>{dateText(application.created_at)}</span></span></button>)}</div>
                </>}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 sm:px-5"><button disabled={page <= 1 || listLoading} onClick={() => { setListLoading(true); setPage((value) => value - 1); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true"/>Previous</button><span className="text-xs text-slate-500">{Math.max(total, 0)} total</span><button disabled={page * 50 >= total || listLoading} onClick={() => { setListLoading(true); setPage((value) => value + 1); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold disabled:opacity-40">Next<ArrowRight className="h-4 w-4" aria-hidden="true"/></button></div>
              </section>
            </>}

            {section === "content" && <>
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><Sparkles className="mr-2 inline h-4 w-4" aria-hidden="true"/>Manage public page copy, internship tracks, announcements, and the site footer. Saved changes appear without a code release.</div>
              {contentLoading ? <LoadingRows/> : <div className="space-y-4">{items.map((item) => {
                const draft = { ...item, ...(contentDrafts[item.slug] ?? {}) };
                const changed = Boolean(contentDrafts[item.slug]);
                if (item.content_type === "footer_details") {
                  const footer = parseFooterSettings(draft.content);
                  const fields: Array<{ key: keyof typeof footer; label: string; multiline?: boolean }> = [
                    { key: "description", label: "Brand description", multiline: true },
                    { key: "proofPoints", label: "Trust statements (one per line)", multiline: true },
                    { key: "contactEmail", label: "Contact email" },
                    { key: "whatsappNumber", label: "WhatsApp number (international format)" },
                    { key: "whatsappLabel", label: "WhatsApp display label" },
                    { key: "linkedinUrl", label: "LinkedIn URL" },
                    { key: "instagramUrl", label: "Instagram URL" },
                    { key: "officeCity", label: "Office location" },
                    { key: "officeDescription", label: "Office description" },
                    { key: "remoteTitle", label: "Remote delivery heading" },
                    { key: "remoteDescription", label: "Remote delivery description" },
                    { key: "legalName", label: "Legal name" },
                    { key: "copyrightText", label: "Copyright notice" },
                  ];
                  return <section key={item.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-6"><div><span className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-700">Footer & contact</span><h2 className="mt-1 text-lg font-bold">Public footer details</h2><p className="mt-1 text-sm text-slate-600">Update the contact links, trust statements, location, and legal line shown on every public page.</p></div><label className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold"><input type="checkbox" checked={Boolean(draft.is_published)} onChange={(event) => setContentDrafts((previous) => ({ ...previous, [item.slug]: { ...previous[item.slug], is_published: event.target.checked } }))} className="h-4 w-4 accent-amber-500"/>{draft.is_published ? "Published" : "Draft"}</label></div>
                    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">{fields.map(({ key, label, multiline }) => <FooterSettingField key={key} label={label} multiline={multiline} value={key === "proofPoints" ? footer.proofPoints.join("\n") : String(footer[key])} onChange={(value) => setContentDrafts((previous) => ({ ...previous, [item.slug]: { ...previous[item.slug], content: { ...footer, [key]: key === "proofPoints" ? value.split("\n").map((point) => point.trim()).filter(Boolean) : value } } }))}/>)}</div>
                    <div className="flex flex-col-reverse justify-between gap-2 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6"><p className="text-xs text-slate-500">Last saved {dateText(item.updated_at)} · public footer content</p><button disabled={!changed} onClick={() => void saveContent(item)} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#071a36] px-4 text-sm font-bold text-white transition-colors hover:bg-[#102b51] disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" aria-hidden="true"/>Save footer details</button></div>
                  </section>;
                }
                return <section key={item.slug} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><span className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-700">{contentTypeLabel(item.content_type)}</span><h2 className="mt-1 font-bold">{item.title}</h2></div><label className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-semibold"><input type="checkbox" checked={Boolean(draft.is_published)} onChange={(event) => setContentDrafts((previous) => ({ ...previous, [item.slug]: { ...previous[item.slug], is_published: event.target.checked } }))} className="h-4 w-4 accent-amber-500"/>{draft.is_published ? "Published" : "Draft"}</label></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-slate-600">Title<input value={draft.title} onChange={(event) => setContentDrafts((previous) => ({ ...previous, [item.slug]: { ...previous[item.slug], title: event.target.value } }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" maxLength={140}/></label>
                    {item.content_type !== "announcement" && <label className="text-xs font-semibold text-slate-600">{item.content_type === "page_copy" ? "Highlighted heading" : item.content_type === "internship_track" ? "Badge" : item.content_type === "service" ? "Tagline" : "Category"}<input value={draft.badge} onChange={(event) => setContentDrafts((previous) => ({ ...previous, [item.slug]: { ...previous[item.slug], badge: event.target.value } }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" maxLength={120}/></label>}
                    <label className="text-xs font-semibold text-slate-600 sm:col-span-2">{item.content_type === "announcement" ? "Announcement message" : item.content_type === "page_copy" ? "Introduction" : "Public description"}<textarea value={draft.summary} onChange={(event) => setContentDrafts((previous) => ({ ...previous, [item.slug]: { ...previous[item.slug], summary: event.target.value } }))} rows={3} maxLength={1200} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"/></label>
                  </div>
                  <div className="mt-4 flex flex-col-reverse justify-between gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center"><p className="text-xs text-slate-500">Last saved {dateText(item.updated_at)}</p><button disabled={!changed} onClick={() => void saveContent(item)} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#071a36] px-4 text-sm font-bold text-white hover:bg-[#102b51] disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" aria-hidden="true"/>Save changes</button></div>
                </section>;
              })}</div>}
              <p className="mt-5 text-xs leading-5 text-slate-500">This CMS manages homepage, About, Services, and Work introductions; service summaries; case-study cards; internship track copy; the internships-page announcement; and public footer details. Layout, curriculum detail, metrics, and remaining static page content stay in code.</p>
            </>}
          </div>
        </main>
      </div>

      {selected && (section === "internship" || section === "career" || section === "overview") && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section key={selected.id} role="dialog" aria-modal="true" aria-labelledby="applicant-detail-title" tabIndex={-1} className="flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-7"><div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-700">{selectedKind === "career" ? "Career application" : "Internship application"}</p><h2 id="applicant-detail-title" className="mt-1 text-lg font-bold">Applicant review</h2></div><IconButton label="Close application details" onClick={() => setSelected(null)}><X className="h-4 w-4"/></IconButton></div>
          <div className="flex-1 space-y-6 p-5 sm:p-7">
            <div className="rounded-xl bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{valueText(selected.full_name)}</h3><a className="mt-1 block break-all text-sm text-blue-800 underline" href={`mailto:${String(selected.email)}`}>{valueText(selected.email)}</a></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusClass(selected.status)}`}>{statusLabel(selected.status)}</span></div><p className="mt-3 text-xs text-slate-500">Submitted {dateText(selected.created_at)}</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{detailFields.map(([key, value]) => { const safeUrl = key.endsWith("_url") ? safeWebUrl(value) : null; return <div key={key} className="min-w-0 rounded-lg border border-slate-200 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{key.replaceAll("_", " ")}</p>{safeUrl ? <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm font-medium text-blue-800 underline">Open link in new tab</a> : <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">{valueText(value)}</p>}</div>; })}</div>
            {typeof selected.tracking_code === "string" && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-amber-900">Private tracking reference</p><p className="mt-1 font-mono text-lg font-bold tracking-wider text-slate-900">{selected.tracking_code}</p></div>}
            <div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-500" aria-hidden="true"/><h3 className="text-sm font-bold">Résumé / CV</h3></div>{selectedResume ? <a href={selectedResume} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-blue-800 hover:bg-slate-50">Open submitted résumé link<ArrowRight className="h-4 w-4"/></a> : <p className="mt-2 text-sm text-slate-500">No résumé link was provided. File uploads are not enabled yet.</p>}</div>
            <div className="space-y-3 rounded-xl border border-slate-200 p-4"><h3 className="text-sm font-bold">Review decision</h3><label className="block text-xs font-semibold text-slate-600">Application status<select id="detail-status" value={selected.status} onChange={(event) => void saveApplication({ status: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100">{(selectedKind === "career" ? careerStatuses : internshipStatuses).map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></label><label className="block text-xs font-semibold text-slate-600">Private admin notes<textarea id="detail-notes" defaultValue={typeof selected.admin_review_notes === "string" ? selected.admin_review_notes : ""} rows={4} maxLength={5000} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" placeholder="Notes are visible only to authorized administrators."/></label><button onClick={() => { const element = document.getElementById("detail-notes") as HTMLTextAreaElement | null; void saveApplication({ notes: element?.value ?? "" }); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50"><Check className="h-4 w-4" aria-hidden="true"/>Save private notes</button></div>
            <div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-600" aria-hidden="true"/><h3 className="text-sm font-bold">Send applicant an email</h3></div><p className="mt-1 text-xs leading-5 text-slate-500">Sends immediately using the selected professional template. Confirm the email address above before sending.</p><div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor="response-template">Email template</label><select id="response-template" className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"><option value="received">Application received / under review</option><option value="shortlisted">Shortlisted</option>{selectedKind === "career" && <option value="hired">Selected for role</option>}<option value="not_selected">Not moving forward</option></select><button onClick={() => { const element = document.getElementById("response-template") as HTMLSelectElement | null; void sendResponse(element?.value ?? "received"); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-bold text-slate-950 hover:bg-amber-400"><Mail className="h-4 w-4" aria-hidden="true"/>Send response</button></div><p className="mt-2 text-xs text-slate-500">Email delivery stays disabled until <code>ADMIN_EMAIL_SENDING_ENABLED=true</code> and a verified sender are configured.</p></div>
            {selectedKind === "internship" && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true"/><h3 className="text-sm font-bold">Learner portal access</h3></div><p className="mt-1 text-xs leading-5 text-slate-600">For accepted applicants, send the private tracking ID above and a single-use link to verify their email and create a password. Passwords are never shown to administrators.</p><button type="button" onClick={() => void sendPortalAccess()} disabled={selected.status !== "accepted" || portalEmailSending} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#061833] px-4 text-sm font-semibold text-white hover:bg-[#10284a] disabled:cursor-not-allowed disabled:bg-slate-300"><Mail className="h-4 w-4" aria-hidden="true"/>{portalEmailSending ? "Sending setup email…" : "Send portal setup email"}</button>{selected.status !== "accepted" && <p className="mt-2 text-xs text-slate-500">Accept the application to activate portal access first.</p>}</div>}
          </div>
        </section>
      </div>}
    </div>
  );
}

function StatCard({ label, number, loading, icon, accent, onClick }: { label: string; number?: number; loading: boolean; icon: React.ReactNode; accent: "amber" | "blue"; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"><div className={`mb-4 grid h-10 w-10 place-items-center rounded-lg ${accent === "amber" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800"}`}>{icon}</div><p className="text-sm font-semibold text-slate-600">{label}</p><p className="mt-1 text-3xl font-bold tracking-tight">{loading ? "…" : number ?? 0}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">View applications<ArrowRight className="h-3.5 w-3.5"/></span></button>;
}

function ApplicationRow({ application, kind, onOpen }: { application: Application; kind: "internship" | "career"; onOpen: () => void }) {
  const reference = kind === "internship" ? application.tracking_code : application.id;
  return <tr className="transition-colors hover:bg-slate-50"><td className="px-5 py-4"><button onClick={onOpen} className="text-left"><span className="block text-sm font-semibold text-slate-900">{application.full_name}</span><span className="mt-1 block text-xs text-slate-500">{application.email}</span></button></td><td className="max-w-56 truncate px-5 py-4 text-sm text-slate-600">{String(application[kind === "career" ? "role" : "track"] ?? "—")}</td><td className="px-5 py-4"><span className={`inline-flex rounded-md px-2.5 py-1.5 font-mono text-xs font-bold tracking-wider ${kind === "internship" ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600"}`}>{String(reference ?? "Pending")}</span></td><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{dateText(application.created_at)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusClass(application.status)}`}>{statusLabel(application.status)}</span></td><td className="px-5 py-4"><IconButton label={`Review ${application.full_name}'s application`} onClick={onOpen}><ArrowRight className="h-4 w-4"/></IconButton></td></tr>;
}

function FooterSettingField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="text-xs font-semibold text-slate-600">{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={label.startsWith("Trust") ? 3 : 2} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"/> : <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"/>}</label>;
}

function LoadingRows() { return <div className="space-y-3 p-5" aria-label="Loading"><div className="h-10 animate-pulse rounded-lg bg-slate-100"/><div className="h-10 animate-pulse rounded-lg bg-slate-100"/><div className="h-10 animate-pulse rounded-lg bg-slate-100"/></div>; }
function EmptyState({ text }: { text: string }) { return <div className="px-5 py-14 text-center"><div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500"><Users className="h-5 w-5" aria-hidden="true"/></div><p className="text-sm font-semibold text-slate-700">{text}</p></div>; }
function contentTypeLabel(type: string) { return ({ announcement: "Site announcement", internship_track: "Internship track", page_copy: "Page introduction", service: "Service", case_study: "Case study", footer_details: "Footer details" } as Record<string, string>)[type] ?? "Public content"; }
