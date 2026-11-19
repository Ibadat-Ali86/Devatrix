"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Award, Check, CheckCircle2, CircleAlert, Clock3, ExternalLink, LoaderCircle, RefreshCw, Send, ShieldCheck } from "lucide-react";
import SignOutButton from "./SignOutButton";

type Enrollment = { id: string; track_slug: string; enrollment_code: string; status: string; started_at: string; expected_end_at: string; completed_at: string | null; site_content?: { title: string; summary: string; badge: string } | Array<{ title: string; summary: string; badge: string }> | null };
type Milestone = { id: string; enrollment_id: string; week_number: number; title: string; instructions: string; due_at: string; status: string; submission_url: string | null; learner_notes: string | null; reviewer_feedback: string | null; submitted_at: string | null };
type CertificateRequest = { id: string; enrollment_id: string; certificate_type: "simple" | "premium"; status: string; fee_amount: number | null; currency: string | null; requested_at: string; issued_at: string | null };
type Track = { slug: string; title: string; summary: string; badge: string };
type Dashboard = { learner: { email: string; name: string }; enrollments: Enrollment[]; milestones: Milestone[]; certificateRequests: CertificateRequest[]; applications: Array<{ id: string; track: string; status: string; created_at: string }>; tracks: Track[]; certificateSettings: { simple_fee: number | null; premium_fee: number | null; currency: string | null; payment_instructions: string; signatory_name: string; signatory_title: string } | null };

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const date = (value: string) => dateFormat.format(new Date(value));
const titleFor = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function PortalDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [view, setView] = useState<"programs" | "explore">("programs");
  const [openMilestone, setOpenMilestone] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ enrollmentId: string; style: "simple" | "premium" } | null>(null);
  const [submission, setSubmission] = useState({ url: "", notes: "" });
  const [repositoryValidation, setRepositoryValidation] = useState<{ state: "idle" | "checking" | "public" | "error"; message: string }>({ state: "idle", message: "" });
  const repositoryValidationRequest = useRef(0);
  const repositoryUrlRef = useRef("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/portal/dashboard", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load your dashboard.");
      setData(result as Dashboard);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/portal/dashboard", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load your dashboard.");
        if (active) setData(result as Dashboard);
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load your dashboard."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const activeTrackSlugs = useMemo(() => new Set((data?.enrollments ?? []).map((row) => row.track_slug)), [data]);
  const milestonesFor = (enrollmentId: string) => (data?.milestones ?? []).filter((item) => item.enrollment_id === enrollmentId).sort((a, b) => a.week_number - b.week_number);
  const requestsFor = (enrollmentId: string) => (data?.certificateRequests ?? []).filter((item) => item.enrollment_id === enrollmentId);
  const trackFor = (row: Enrollment) => Array.isArray(row.site_content) ? row.site_content[0] : row.site_content;
  const completedCount = (id: string) => milestonesFor(id).filter((item) => item.status === "completed").length;
  const nextDue = useMemo(() => (data?.milestones ?? []).filter((item) => !["completed", "submitted"].includes(item.status)).sort((a, b) => Date.parse(a.due_at) - Date.parse(b.due_at))[0], [data]);

  async function post(path: string, payload: unknown, successMessage: string) {
    setBusy(path);
    setError("");
    setNotice("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The request could not be completed.");
      setNotice(successMessage);
      await load();
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The request could not be completed.");
      return false;
    } finally {
      setBusy("");
    }
  }

  async function validateRepository(repositoryUrl = submission.url): Promise<boolean> {
    const value = repositoryUrl.trim();
    if (!value) {
      setRepositoryValidation({ state: "error", message: "Add your GitHub repository link to continue." });
      return false;
    }
    const requestId = ++repositoryValidationRequest.current;
    setRepositoryValidation({ state: "checking", message: "Checking that this GitHub repository is public…" });
    try {
      const response = await fetch("/api/portal/milestones/validate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repositoryUrl: value }),
      });
      const result = await response.json();
      if (!response.ok || result.public !== true) throw new Error(result.error || "We couldn’t confirm this repository is public. Check the link and its visibility.");
      if (requestId !== repositoryValidationRequest.current) return false;
      setRepositoryValidation({ state: "public", message: "Public repository verified. You can submit this work." });
      return true;
    } catch (reason) {
      if (requestId !== repositoryValidationRequest.current) return false;
      setRepositoryValidation({ state: "error", message: reason instanceof Error ? reason.message : "We couldn’t verify this repository. Please try again." });
      return false;
    }
  }

  async function submitWork(milestoneId: string) {
    const repositoryUrl = submission.url.trim();
    if (!await validateRepository(repositoryUrl) || repositoryUrlRef.current.trim() !== repositoryUrl) return;
    const done = await post("/api/portal/milestones", { milestoneId, submissionUrl: submission.url, notes: submission.notes }, "Your work was sent for review.");
    if (done) { setOpenMilestone(null); setSubmission({ url: "", notes: "" }); }
  }

  const activeEnrollment = preview ? data?.enrollments.find((item) => item.id === preview.enrollmentId) : undefined;
  const activeTrack = activeEnrollment ? trackFor(activeEnrollment) : undefined;
  const certSettings = data?.certificateSettings;
  const activeRequest = preview && data ? requestsFor(preview.enrollmentId).find((item) => item.certificate_type === preview.style) : undefined;

  return (
    <main className="dx-workspace min-h-screen bg-[#f3f6fa] text-slate-900">
      <header className="border-b border-white/10 bg-[#061833] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Devatrix home">
            <Image src="/logo-transparent.png" alt="" width={42} height={42} priority />
            <span className="truncate text-lg font-bold tracking-tight">Devatrix <span className="font-medium text-slate-300">/ Learner portal</span></span>
          </Link>
          <div className="flex items-center gap-2"><span className="hidden max-w-56 truncate text-xs text-slate-300 md:block">{data?.learner.email}</span><SignOutButton /></div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-3xl"><p className="text-sm font-semibold text-slate-600">Learner workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#061833] sm:text-4xl">{data ? `Welcome, ${data.learner.name}` : "Your learning, in one place"}</h1><p className="mt-3 text-base leading-7 text-slate-600">Follow each internship, submit your work, and see the next step at a glance.</p></div>
          <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-[#061833] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>
        </div>

        {error && <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}<button onClick={() => setError("")} className="font-semibold underline underline-offset-2">Dismiss</button></div>}
        {notice && <div role="status" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/>{notice}</span><button onClick={() => setNotice("")} className="font-semibold underline underline-offset-2">Dismiss</button></div>}

        {loading && !data ? <div className="mt-10 flex min-h-56 items-center justify-center gap-3 text-sm font-medium text-slate-600"><LoaderCircle className="h-5 w-5 animate-spin text-amber-600"/>Loading your learner dashboard…</div> : data && <>
          <section aria-label="At a glance" className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">Enrolled programs</p><p className="mt-2 text-2xl font-bold tabular-nums text-[#061833]">{data.enrollments.length}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">Milestones approved</p><p className="mt-2 text-2xl font-bold tabular-nums text-[#061833]">{data.milestones.filter((item) => item.status === "completed").length}<span className="text-base font-medium text-slate-500"> / {data.milestones.length}</span></p></div>
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">Next due date</p><p className="mt-2 text-lg font-bold text-[#061833]">{nextDue ? date(nextDue.due_at) : "No upcoming work"}</p></div>
          </section>

          <nav className="mt-9 flex gap-2 border-b border-slate-200" aria-label="Learner sections">
            {([ ["programs", "My programs"], ["explore", "Explore internships"] ] as const).map(([key, label]) => <button key={key} onClick={() => setView(key)} className={`min-h-11 border-b-2 px-3 text-sm font-semibold transition-colors ${view === key ? "border-amber-500 text-[#061833]" : "border-transparent text-slate-600 hover:text-[#061833]"}`}>{label}</button>)}
          </nav>

          {view === "programs" && <section className="mt-6 space-y-6" aria-label="Your enrollments">
            {!data.enrollments.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><h2 className="text-lg font-bold text-[#061833]">No internship enrollments yet</h2><p className="mt-2 text-sm text-slate-600">Browse the current tracks and enroll when you are ready.</p><button onClick={() => setView("explore")} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-bold text-[#061833] hover:bg-amber-400">Explore internships<ArrowRight className="h-4 w-4"/></button></div>}
            {data.enrollments.map((enrollment) => {
              const track = trackFor(enrollment);
              const steps = milestonesFor(enrollment.id);
              const done = completedCount(enrollment.id);
              const percentage = Math.round(done / 6 * 100);
              const certificateRequests = requestsFor(enrollment.id);
              return <article key={enrollment.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-5 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs font-bold tracking-[.1em] text-amber-900">{enrollment.enrollment_code}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${enrollment.status === "completed" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800"}`}>{titleFor(enrollment.status)}</span>{track?.badge && <span className="text-xs text-slate-500">{track.badge}</span>}</div>
                    <h2 className="mt-3 text-xl font-bold tracking-tight text-[#061833] sm:text-2xl">{track?.title ?? enrollment.track_slug}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{track?.summary}</p>
                  </div>
                  <div className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 text-sm sm:text-right"><div><p className="text-xs text-slate-500">Started</p><p className="mt-1 font-semibold">{date(enrollment.started_at)}</p></div><div><p className="text-xs text-slate-500">Target finish</p><p className="mt-1 font-semibold">{date(enrollment.expected_end_at)}</p></div></div>
                </div>
                <div className="grid lg:grid-cols-[minmax(0,1fr)_270px]">
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap items-end justify-between gap-2"><div><h3 className="font-bold text-[#061833]">Six-week progress</h3><p className="mt-1 text-sm text-slate-600">Milestones are complete after a reviewer approves your submission.</p></div><p className="text-sm font-bold tabular-nums text-[#061833]">{done} of 6 approved</p></div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${track?.title ?? "Internship"} progress`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-amber-500 transition-[width] duration-500" style={{ width: `${percentage}%` }}/></div>
                    <ol className="mt-5 divide-y divide-slate-100">
                      {steps.map((step) => <li key={step.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 gap-3"><span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${step.status === "completed" ? "bg-emerald-100 text-emerald-800" : step.status === "submitted" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"}`}>{step.status === "completed" ? <Check className="h-4 w-4"/> : String(step.week_number).padStart(2, "0")}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold text-[#061833]">Week {step.week_number}: {step.title}</h4><span className="text-xs capitalize text-slate-500">{titleFor(step.status)}</span></div><p className="mt-1 text-sm leading-6 text-slate-600">{step.instructions}</p>{step.reviewer_feedback && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-950"><strong>Reviewer feedback:</strong> {step.reviewer_feedback}</p>}{step.submission_url && <a href={step.submission_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-800 underline underline-offset-2">View submitted work<ExternalLink className="h-3.5 w-3.5"/></a>}</div></div>
                          <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end"><span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5"/>Due {date(step.due_at)}</span>{["upcoming", "in_progress", "revision_requested"].includes(step.status) && enrollment.status === "active" && <button onClick={() => { const nextUrl = step.submission_url ?? ""; repositoryUrlRef.current = nextUrl; repositoryValidationRequest.current += 1; setRepositoryValidation({ state: "idle", message: "" }); setOpenMilestone(openMilestone === step.id ? null : step.id); setSubmission({ url: nextUrl, notes: step.learner_notes ?? "" }); }} className="min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-[#061833] hover:bg-slate-50">{step.status === "revision_requested" ? "Resubmit work" : "Submit work"}</button>}</div>
                        </div>
                        {openMilestone === step.id && <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Public GitHub repository<input value={submission.url} onChange={(event) => { repositoryUrlRef.current = event.target.value; repositoryValidationRequest.current += 1; setSubmission((old) => ({ ...old, url: event.target.value })); setRepositoryValidation({ state: "idle", message: "" }); }} onBlur={() => { if (submission.url.trim()) void validateRepository(); }} maxLength={2048} type="url" aria-describedby="repository-validation-message" aria-invalid={repositoryValidation.state === "error"} placeholder="https://github.com/owner/repository" className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"/><span id="repository-validation-message" className={`mt-2 flex min-h-5 items-start gap-1.5 text-xs font-medium leading-5 ${repositoryValidation.state === "error" ? "text-rose-700" : repositoryValidation.state === "public" ? "text-emerald-800" : "text-slate-500"}`}>{repositoryValidation.state === "checking" ? <LoaderCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true"/> : repositoryValidation.state === "error" ? <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true"/> : repositoryValidation.state === "public" ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true"/> : null}{repositoryValidation.message || "Only public GitHub repositories can be reviewed. Make a private repository public before submitting."}</span></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Note for reviewer<textarea value={submission.notes} onChange={(event) => setSubmission((old) => ({ ...old, notes: event.target.value }))} maxLength={1500} rows={3} placeholder="What did you complete? Anything you want reviewed?" className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"/></label><div className="flex flex-wrap gap-2 sm:col-span-2"><button onClick={() => void submitWork(step.id)} disabled={Boolean(busy) || repositoryValidation.state === "checking"} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#061833] px-4 text-sm font-semibold text-white hover:bg-[#10284a] disabled:opacity-60"><Send className="h-4 w-4"/>{busy ? "Sending…" : "Send for review"}</button><button onClick={() => setOpenMilestone(null)} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-200">Cancel</button></div></div>}
                      </li>)}
                    </ol>
                  </div>
                  <aside className="border-t border-slate-200 bg-slate-50 p-5 sm:p-7 lg:border-l lg:border-t-0" aria-label="Certificate options">
                    <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800"><Award className="h-5 w-5"/></div><div><h3 className="font-bold text-[#061833]">Certificate</h3><p className="mt-1 text-sm leading-5 text-slate-600">After all milestones are approved, preview a style and request issuance.</p></div></div>
                    {enrollment.status === "completed" ? <div className="mt-5 space-y-3">{(["simple", "premium"] as const).map((style) => {
                      const req = certificateRequests.find((item) => item.certificate_type === style);
                      const fee = style === "simple" ? certSettings?.simple_fee : certSettings?.premium_fee;
                      return (
                        <div key={style} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold capitalize text-[#061833]">{style}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {fee === null || fee === undefined ? "Fee not configured" : `${certSettings?.currency ?? ""} ${Number(fee).toFixed(2)}`}
                              </p>
                            </div>
                            {req && <span className="text-right text-[11px] font-semibold capitalize text-blue-800">{titleFor(req.status)}</span>}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button onClick={() => setPreview({ enrollmentId: enrollment.id, style })} className="min-h-9 flex-1 rounded-md border border-slate-300 text-xs font-semibold text-[#061833] hover:bg-slate-50">Preview</button>
                            {(!req || req.status === "rejected") && (
                              <button
                                onClick={() => void post("/api/portal/certificates", { enrollmentId: enrollment.id, certificateType: style }, "Certificate request recorded. Follow the payment instructions shown by the team.")}
                                disabled={fee === null || fee === undefined || Boolean(busy)}
                                className="min-h-9 flex-1 rounded-md bg-amber-500 text-xs font-bold text-[#061833] hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600"
                              >Request</button>
                            )}
                          </div>
                        </div>
                      );
                    })}<p className="text-xs leading-5 text-slate-500">Premium changes the certificate presentation only. Honors are earned through assessed performance and can’t be purchased.</p></div> : <p className="mt-5 rounded-lg bg-white px-3 py-3 text-sm leading-5 text-slate-600">Complete all six milestones and receive reviewer approval to unlock certificate previews.</p>}
                  </aside>
                </div>
              </article>;
            })}
            {data.applications.length > 0 && <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="text-lg font-bold text-[#061833]">Application updates</h2><p className="mt-1 text-sm text-slate-600">Your original applications remain available here while they are reviewed.</p><ul className="mt-4 divide-y divide-slate-100">{data.applications.map((application, index) => <li key={`${application.id}-${index}`} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span className="font-medium text-[#061833]">{application.track}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{titleFor(application.status)}</span></li>)}</ul></section>}
          </section>}

          {view === "explore" && <section className="mt-6" aria-labelledby="explore-title"><div className="mb-5"><h2 id="explore-title" className="text-xl font-bold text-[#061833]">Choose another track</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Enroll immediately using this account. Each track gets its own enrollment code, schedule, and progress record.</p></div>{!data.tracks.filter((track) => !activeTrackSlugs.has(track.slug)).length ? <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">You are enrolled in every currently published internship.</div> : <div className="divide-y divide-slate-200 border-y border-slate-200">{data.tracks.filter((track) => !activeTrackSlugs.has(track.slug)).map((track) => <article key={track.slug} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-3xl"><span className="text-xs font-semibold uppercase tracking-[.12em] text-amber-800">{track.badge}</span><h3 className="mt-1 text-lg font-bold text-[#061833]">{track.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{track.summary}</p></div><button onClick={() => void post("/api/portal/enroll", { trackSlug: track.slug }, "You’re enrolled. Your new schedule and enrollment code are ready.")} disabled={Boolean(busy)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-bold text-[#061833] hover:bg-amber-400 disabled:opacity-60">{busy.includes("enroll") ? "Enrolling…" : "Enroll in track"}<ArrowRight className="h-4 w-4"/></button></article>)}</div>}</section>}

          <div className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700"/>Your progress and certificate previews are private to this signed-in account. Enrollment codes identify records; they are not sign-in credentials.</div>
        </>}
      </div>

      {preview && activeEnrollment && activeTrack && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="certificate-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreview(null); }}>
        <div className="mx-auto my-4 max-w-5xl rounded-xl bg-white p-4 shadow-xl sm:my-8 sm:p-7">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3 print:hidden"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-amber-800">Private certificate preview</p><h2 id="certificate-preview-title" className="mt-1 text-xl font-bold text-[#061833]">{preview.style === "premium" ? "Premium presentation" : "Simple presentation"}</h2></div><div className="flex gap-2"><button onClick={() => window.print()} className="min-h-10 rounded-lg bg-[#061833] px-4 text-sm font-semibold text-white hover:bg-[#10284a]">Print preview</button><button onClick={() => setPreview(null)} className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button></div></div>
          <div className={`certificate-page relative mx-auto flex min-h-[560px] max-w-[900px] flex-col items-center justify-center overflow-hidden border-[10px] px-8 py-12 text-center sm:min-h-[620px] sm:px-16 ${preview.style === "premium" ? "border-double border-amber-500 bg-[#fffdf7]" : "border-[#061833] bg-white"}`}>
            <div className={`absolute inset-2 border ${preview.style === "premium" ? "border-amber-200" : "border-slate-200"}`} aria-hidden="true"/>
            <Image src="/logo-transparent.png" alt="Devatrix Technologies" width={64} height={64} className="relative"/>
            <p className="relative mt-5 text-xs font-semibold uppercase tracking-[.2em] text-slate-500">Devatrix Technologies</p>
            <h3 className="relative mt-8 font-serif text-3xl font-semibold text-[#061833] sm:text-5xl">Certificate of Completion</h3>
            <p className="relative mt-8 text-sm text-slate-600">This certifies that</p>
            <p className="relative mt-2 max-w-full break-words text-2xl font-bold text-[#061833] sm:text-3xl">{data?.learner.name}</p>
            <p className="relative mt-5 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">has completed the six-week <strong>{activeTrack.title}</strong> internship program and its reviewed milestones.</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-slate-600"><span>Completed {activeEnrollment.completed_at ? date(activeEnrollment.completed_at) : "—"}</span><span>Enrollment {activeEnrollment.enrollment_code}</span></div>
            <p className="relative mt-5 max-w-2xl text-sm italic leading-6 text-slate-600">With appreciation for your commitment to learning, building, and professional practice.</p>
            <div className="relative mt-10 min-w-48 border-t border-slate-400 px-3 pt-2"><p className="font-semibold text-[#061833]">{certSettings?.signatory_name || "Authorized Signatory"}</p><p className="text-xs text-slate-500">{certSettings?.signatory_title || "Devatrix Technologies"}</p></div>
            <p className="relative mt-7 font-mono text-xs tracking-[.12em] text-slate-500">{preview.style === "premium" ? "PREMIUM FORMAT" : "SIMPLE FORMAT"} · {activeRequest?.status === "issued" ? `ISSUED ${activeRequest.issued_at ? date(activeRequest.issued_at) : ""} · ${activeEnrollment.enrollment_code}` : "PREVIEW ONLY · NOT ISSUED"}</p>
          </div>
          <p className="mx-auto mt-3 max-w-[900px] text-xs leading-5 text-slate-500 print:hidden">This preview is private to your account and is not an issued credential. The Premium format changes the visual treatment only; achievement distinctions are earned separately.</p>
          {activeRequest && <div className="mx-auto mt-4 max-w-[900px] rounded-lg bg-slate-50 p-4 text-sm text-slate-700 print:hidden"><p className="font-semibold text-[#061833]">Request status: {titleFor(activeRequest.status)}</p>{certSettings?.payment_instructions && <p className="mt-1 leading-6">{certSettings.payment_instructions}</p>}{activeRequest.status === "issued" && <p className="mt-1">Issued on {activeRequest.issued_at ? date(activeRequest.issued_at) : "—"}</p>}</div>}
        </div>
      </div>}
      <style jsx global>{`@media print { body * { visibility: hidden !important; } .certificate-page, .certificate-page * { visibility: visible !important; } .certificate-page { position: fixed !important; inset: 0 !important; width: 100vw !important; min-height: 100vh !important; max-width: none !important; page-break-inside: avoid; print-color-adjust: exact; -webkit-print-color-adjust: exact; } @page { size: landscape; margin: 10mm; } }`}</style>
    </main>
  );
}
