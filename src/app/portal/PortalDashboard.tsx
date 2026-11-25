"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock,
  Clock3,
  ExternalLink,
  FileCheck,
  Github,
  Layers,
  LoaderCircle,
  Lock,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SignOutButton from "./SignOutButton";
import BrandLoader from "@/components/BrandLoader";

type Enrollment = {
  id: string;
  track_slug: string;
  enrollment_code: string;
  status: string;
  started_at: string;
  expected_end_at: string;
  completed_at: string | null;
  site_content?:
    | { title: string; summary: string; badge: string }
    | Array<{ title: string; summary: string; badge: string }>
    | null;
};

type Milestone = {
  id: string;
  enrollment_id: string;
  week_number: number;
  title: string;
  instructions: string;
  due_at: string;
  status: string;
  submission_url: string | null;
  learner_notes: string | null;
  reviewer_feedback: string | null;
  submitted_at: string | null;
};

type LetterRequest = {
  id: string;
  enrollment_id: string;
  status: string;
  note: string | null;
  requested_at: string;
  issued_at: string | null;
};

type Track = { slug: string; title: string; summary: string; badge: string };

type Dashboard = {
  learner: { email: string; name: string };
  enrollments: Enrollment[];
  milestones: Milestone[];
  letterRequests: LetterRequest[];
  applications: Array<{ id: string; track: string; status: string; created_at: string }>;
  tracks: Track[];
};

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const date = (value: string) => {
  try {
    return dateFormat.format(new Date(value));
  } catch {
    return value;
  }
};
const titleFor = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const LETTER_STATUS_PRIORITY = ["requested", "issued", "paid", "payment_pending", "rejected"];

function pickPrimaryLetterRequest(requests: LetterRequest[]): LetterRequest | undefined {
  for (const status of LETTER_STATUS_PRIORITY) {
    const match = requests.find((item) => item.status === status);
    if (match) return match;
  }
  return requests[0];
}

export default function PortalDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [view, setView] = useState<"programs" | "applications" | "explore">("programs");
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | "all">("all");
  const [openMilestone, setOpenMilestone] = useState<string | null>(null);
  const [letterNotes, setLetterNotes] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState({ url: "", notes: "" });
  const [repositoryValidation, setRepositoryValidation] = useState<{
    state: "idle" | "checking" | "public" | "error";
    message: string;
  }>({ state: "idle", message: "" });
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
        if (active) {
          setData(result as Dashboard);
          if (result.enrollments && result.enrollments.length > 0) {
            setSelectedEnrollmentId(result.enrollments[0].id);
          }
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load your dashboard.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeTrackSlugs = useMemo(() => new Set((data?.enrollments ?? []).map((row) => row.track_slug)), [data]);
  const milestonesFor = (enrollmentId: string) =>
    (data?.milestones ?? []).filter((item) => item.enrollment_id === enrollmentId).sort((a, b) => a.week_number - b.week_number);
  const letterRequestsFor = (enrollmentId: string) =>
    (data?.letterRequests ?? []).filter((item) => item.enrollment_id === enrollmentId);
  const trackFor = (row: Enrollment) => (Array.isArray(row.site_content) ? row.site_content[0] : row.site_content);
  const completedCount = (id: string) => milestonesFor(id).filter((item) => item.status === "completed").length;
  const totalApproved = useMemo(() => (data?.milestones ?? []).filter((m) => m.status === "completed").length, [data]);
  const totalMilestones = useMemo(() => data?.milestones?.length || 0, [data]);
  const overallPercentage = totalMilestones > 0 ? Math.round((totalApproved / totalMilestones) * 100) : 0;

  const nextDue = useMemo(
    () =>
      (data?.milestones ?? [])
        .filter((item) => !["completed", "submitted"].includes(item.status))
        .sort((a, b) => Date.parse(a.due_at) - Date.parse(b.due_at))[0],
    [data]
  );

  async function post(path: string, payload: unknown, successMessage: string) {
    setBusy(path);
    setError("");
    setNotice("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repositoryUrl: value }),
      });
      const result = await response.json();
      if (!response.ok || result.public !== true) {
        throw new Error(result.error || "We couldn’t confirm this repository is public. Check the link and its visibility.");
      }
      if (requestId !== repositoryValidationRequest.current) return false;
      setRepositoryValidation({ state: "public", message: "Public repository verified. You can submit this work." });
      return true;
    } catch (reason) {
      if (requestId !== repositoryValidationRequest.current) return false;
      setRepositoryValidation({
        state: "error",
        message: reason instanceof Error ? reason.message : "We couldn’t verify this repository. Please try again.",
      });
      return false;
    }
  }

  async function submitWork(milestoneId: string) {
    const repositoryUrl = submission.url.trim();
    if (!(await validateRepository(repositoryUrl)) || repositoryUrlRef.current.trim() !== repositoryUrl) return;
    const done = await post(
      "/api/portal/milestones",
      { milestoneId, submissionUrl: submission.url, notes: submission.notes },
      "Your work was sent for review."
    );
    if (done) {
      setOpenMilestone(null);
      setSubmission({ url: "", notes: "" });
    }
  }

  const displayedEnrollments = useMemo(() => {
    if (!data?.enrollments) return [];
    if (selectedEnrollmentId === "all") return data.enrollments;
    const found = data.enrollments.find((e) => e.id === selectedEnrollmentId);
    return found ? [found] : data.enrollments;
  }, [data, selectedEnrollmentId]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans relative flex flex-col">
      {/* 1. Floating Island Navigation (Exact Devatrix Main Site Capsule) */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="pointer-events-auto max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 bg-[#061833]/95 text-white border border-slate-700/80 shadow-[0_20px_50px_-8px_rgba(2,10,24,0.65)] ring-1 ring-white/10 backdrop-blur-2xl">
          {/* Brand Logo Lockup */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" aria-label="Devatrix home">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 p-1.5 transition-transform group-hover:scale-105 shadow-sm">
              <Image src="/logo-transparent.png" alt="Devatrix Technologies" width={36} height={36} className="w-full h-full object-contain" priority />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans leading-none">
                  Devatrix
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[9px] sm:text-[10px] font-mono font-bold text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PORTAL
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-slate-300 font-semibold font-sans mt-0.5">
                Technologies
              </span>
            </div>
          </Link>

          {/* Learner Identity Chip & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {data && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400/70 bg-[#061833] shrink-0">
                  <Image
                    src="/images/learner-anime-avatar.jpg"
                    alt=""
                    width={20}
                    height={20}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-200 max-w-[140px] truncate">
                  {data.learner.name}
                </span>
              </div>
            )}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              ← Main Site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Workspace Content (Sits below fixed navigation capsule) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-mono font-medium text-slate-700 shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>DEVATRIX ENGINEERING FELLOWSHIP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#061833] font-sans">
              {data ? `Welcome, ${data.learner.name}` : "Learner Workspace"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Track your sprint deliverables, submit production pull requests, and request your official completion letter upon graduation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 text-xs sm:text-sm font-semibold text-[#061833] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 text-amber-600 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* System Error & Notice Alerts */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CircleAlert className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="font-semibold text-rose-700 hover:text-rose-900 underline underline-offset-2 text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
            <button onClick={() => setNotice("")} className="font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Official Devatrix Brand Loader */}
        {loading && !data ? (
          <div className="mt-16 flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
            <BrandLoader context="application" />
            <div className="space-y-1 mt-2">
              <p className="text-sm font-bold text-[#061833]">Synchronizing Fellowship Workspace</p>
              <p className="text-xs text-slate-500 font-mono">Fetching active tracks, weekly milestone reviews &amp; completion requests…</p>
            </div>
          </div>
        ) : (
          data && (
            <>
              {/* Metric KPI Deck (Crisp White Cards) */}
              <section aria-label="At a glance" className="mt-8 grid gap-4 sm:grid-cols-3">
                {/* Metric 1 */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                      Enrolled Programs
                    </p>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#061833] font-sans">{data.enrollments.length}</span>
                    <span className="text-xs font-mono text-slate-500">Active Cohort</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {data.enrollments.slice(0, 3).map((e) => (
                      <span key={e.id} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                        {e.enrollment_code}
                      </span>
                    ))}
                    {data.enrollments.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                        +{data.enrollments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                      Milestones Approved
                    </p>
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-700 font-sans">{totalApproved}</span>
                    <span className="text-sm font-medium text-slate-500">/ {totalMilestones} approved</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                      style={{ width: `${overallPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow group">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                      Next Due Date
                    </p>
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xl sm:text-2xl font-bold text-[#061833] font-sans">
                      {nextDue ? date(nextDue.due_at) : "All milestones completed"}
                    </span>
                    <p className="mt-1 text-xs text-slate-500 truncate">
                      {nextDue ? `Week ${nextDue.week_number}: ${nextDue.title}` : "Outstanding commitment honored"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Primary Navigation Tabs */}
              <nav className="mt-10 flex flex-wrap gap-2 border-b border-slate-200 pb-2" aria-label="Learner sections">
                {[
                  ["programs", `My Programs (${data.enrollments.length})`],
                  ["applications", `Applications (${data.applications.length})`],
                  ["explore", "Explore Tracks"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setView(key as typeof view)}
                    className={`min-h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      view === key
                        ? "bg-amber-500 text-[#061833] font-bold shadow-xs"
                        : "text-slate-600 hover:text-[#061833] hover:bg-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* VIEW 1: MY PROGRAMS */}
              {view === "programs" && (
                <section className="mt-8 space-y-8" aria-label="Your enrolled tracks">
                  {!data.enrollments.length ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-xs">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mb-4">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h2 className="text-xl font-bold text-[#061833]">No active internship enrollments</h2>
                      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                        Your account is verified. Select an available engineering track below to activate your 6-week curriculum.
                      </p>
                      <button
                        onClick={() => setView("explore")}
                        className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-amber-500 px-6 text-xs sm:text-sm font-bold text-[#061833] hover:bg-amber-400 transition-colors shadow-xs"
                      >
                        <span>Explore Engineering Tracks</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Program Focus Switcher (Solves Endless Scrolling) */}
                      {data.enrollments.length > 1 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="font-mono uppercase tracking-wider font-semibold text-[#061833]">
                              Switch Program Focus:
                            </span>
                            <button
                              onClick={() => setSelectedEnrollmentId("all")}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                selectedEnrollmentId === "all"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "text-slate-600 hover:text-[#061833]"
                              }`}
                            >
                              Show All ({data.enrollments.length})
                            </button>
                          </div>

                          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                            {data.enrollments.map((enr) => {
                              const trk = trackFor(enr);
                              const done = completedCount(enr.id);
                              const isSelected = selectedEnrollmentId === enr.id;
                              const isComplete = enr.status === "completed" || done === 6;

                              return (
                                <button
                                  key={enr.id}
                                  onClick={() => setSelectedEnrollmentId(enr.id)}
                                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                                    isSelected
                                      ? "border-amber-400 bg-amber-50/60 shadow-xs ring-2 ring-amber-400/40"
                                      : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                                  }`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                                      isComplete
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                        : "bg-amber-100 text-amber-900 border border-amber-300"
                                    }`}
                                  >
                                    {isComplete ? <Check className="w-4 h-4" /> : `${done}/6`}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-[#061833] truncate w-full">
                                      {trk?.title ?? enr.track_slug}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] font-mono text-slate-500">
                                        {enr.enrollment_code}
                                      </span>
                                      <span
                                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                          isComplete
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-amber-100 text-amber-900"
                                        }`}
                                      >
                                        {isComplete ? "Completed" : "Active"}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Enrolled Track Cards */}
                      {displayedEnrollments.map((enrollment) => {
                        const track = trackFor(enrollment);
                        const steps = milestonesFor(enrollment.id);
                        const done = completedCount(enrollment.id);
                        const percentage = Math.round((done / 6) * 100);
                        const letterRequest = pickPrimaryLetterRequest(letterRequestsFor(enrollment.id));
                        const isTrackComplete = enrollment.status === "completed" || done === 6;

                        return (
                          <article
                            key={enrollment.id}
                            className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all"
                          >
                            {/* Track Header Banner */}
                            <div className="flex flex-col gap-5 border-b border-slate-200 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8 bg-gradient-to-b from-slate-50/80 to-white">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-amber-900">
                                    {enrollment.enrollment_code}
                                  </span>
                                  <span
                                    className={`rounded-full px-3 py-0.5 text-xs font-bold capitalize font-mono ${
                                      isTrackComplete
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : "bg-blue-100 text-blue-800 border border-blue-200"
                                    }`}
                                  >
                                    {titleFor(enrollment.status)}
                                  </span>
                                  {track?.badge && (
                                    <span className="text-xs font-mono text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full bg-slate-50">
                                      {track.badge}
                                    </span>
                                  )}
                                </div>

                                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#061833] sm:text-3xl font-sans">
                                  {track?.title ?? enrollment.track_slug}
                                </h2>
                                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                                  {track?.summary}
                                </p>
                              </div>

                              <div className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 text-sm sm:text-right border-t sm:border-t-0 border-slate-200 pt-4 sm:pt-0">
                                <div>
                                  <p className="text-xs font-mono uppercase text-slate-500">Cohort Start</p>
                                  <p className="mt-1 font-semibold text-[#061833]">{date(enrollment.started_at)}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-mono uppercase text-slate-500">Target Handover</p>
                                  <p className="mt-1 font-semibold text-[#061833]">{date(enrollment.expected_end_at)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Main Body: Milestones + Completion Letter Request */}
                            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
                              {/* 6-Week Interactive Milestones Roadmap */}
                              <div className="p-6 sm:p-8">
                                <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-slate-200">
                                  <div>
                                    <h3 className="text-base font-bold text-[#061833] flex items-center gap-2">
                                      <Layers className="w-4 h-4 text-amber-600" />
                                      <span>Six-Week Milestone Roadmap</span>
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      Weekly code deliverables require mentor review and CI verification.
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-mono font-bold text-[#061833]">
                                      {done} / 6 Approved
                                    </span>
                                    <span className="text-xs text-slate-500 ml-1.5 font-mono">({percentage}%)</span>
                                  </div>
                                </div>

                                {/* Track progress line */}
                                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>

                                {/* Step-by-Step Milestones */}
                                <ol className="mt-6 space-y-4">
                                  {steps.map((step) => {
                                    const isComplete = step.status === "completed";
                                    const isSubmitted = step.status === "submitted";
                                    const isRevision = step.status === "revision_requested";
                                    const canSubmit =
                                      ["upcoming", "in_progress", "revision_requested"].includes(step.status) &&
                                      enrollment.status === "active";
                                    const isDrawerOpen = openMilestone === step.id;

                                    return (
                                      <li
                                        key={step.id}
                                        className={`rounded-2xl border transition-all p-4 sm:p-5 ${
                                          isComplete
                                            ? "border-emerald-200 bg-emerald-50/40"
                                            : isRevision
                                            ? "border-amber-300 bg-amber-50/60"
                                            : isSubmitted
                                            ? "border-blue-200 bg-blue-50/40"
                                            : "border-slate-200/90 bg-white hover:bg-slate-50/50"
                                        }`}
                                      >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                          {/* Left details */}
                                          <div className="flex min-w-0 gap-3.5">
                                            <span
                                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-mono font-bold ${
                                                isComplete
                                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                                  : isSubmitted
                                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                                  : isRevision
                                                  ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                                              }`}
                                            >
                                              {isComplete ? (
                                                <Check className="h-4 w-4" />
                                              ) : (
                                                String(step.week_number).padStart(2, "0")
                                              )}
                                            </span>

                                            <div className="min-w-0">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-bold text-[#061833] text-sm sm:text-base">
                                                  Week {step.week_number}: {step.title}
                                                </h4>
                                                <span
                                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold capitalize ${
                                                    isComplete
                                                      ? "bg-emerald-100 text-emerald-800"
                                                      : isSubmitted
                                                      ? "bg-blue-100 text-blue-800"
                                                      : isRevision
                                                      ? "bg-amber-100 text-amber-900"
                                                      : "bg-slate-100 text-slate-600"
                                                  }`}
                                                >
                                                  {titleFor(step.status)}
                                                </span>
                                              </div>

                                              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                                                {step.instructions}
                                              </p>

                                              {/* Official Reviewer Feedback Box */}
                                              {step.reviewer_feedback && (
                                                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-950">
                                                  <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                                                    <Sparkles className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                                                    <span>Reviewer Feedback</span>
                                                  </div>
                                                  <p className="text-amber-900">{step.reviewer_feedback}</p>
                                                </div>
                                              )}

                                              {/* Submission Link */}
                                              {step.submission_url && (
                                                <div className="mt-3 flex items-center gap-3">
                                                  <a
                                                    href={step.submission_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors"
                                                  >
                                                    <Github className="h-3.5 w-3.5" />
                                                    <span>View Submitted Repository</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                  </a>
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {/* Right Actions */}
                                          <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500">
                                              <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                              <span>Due {date(step.due_at)}</span>
                                            </span>

                                            {canSubmit && (
                                              <button
                                                onClick={() => {
                                                  const nextUrl = step.submission_url ?? "";
                                                  repositoryUrlRef.current = nextUrl;
                                                  repositoryValidationRequest.current += 1;
                                                  setRepositoryValidation({ state: "idle", message: "" });
                                                  setOpenMilestone(isDrawerOpen ? null : step.id);
                                                  setSubmission({
                                                    url: nextUrl,
                                                    notes: step.learner_notes ?? "",
                                                  });
                                                }}
                                                className={`min-h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                                                  isRevision
                                                    ? "bg-amber-500 hover:bg-amber-400 text-[#061833]"
                                                    : "bg-[#061833] hover:bg-[#0c2447] text-white"
                                                }`}
                                              >
                                                {isRevision ? "Resubmit Work" : "Submit Work"}
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        {/* In-Line Submission Drawer */}
                                        {isDrawerOpen && (
                                          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
                                            <div>
                                              <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-700 mb-1.5">
                                                Public GitHub Repository URL
                                              </label>
                                              <div className="relative">
                                                <input
                                                  value={submission.url}
                                                  onChange={(event) => {
                                                    repositoryUrlRef.current = event.target.value;
                                                    repositoryValidationRequest.current += 1;
                                                    setSubmission((old) => ({ ...old, url: event.target.value }));
                                                    setRepositoryValidation({ state: "idle", message: "" });
                                                  }}
                                                  onBlur={() => {
                                                    if (submission.url.trim()) void validateRepository();
                                                  }}
                                                  maxLength={2048}
                                                  type="url"
                                                  placeholder="https://github.com/your-username/milestone-repo"
                                                  className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                                />
                                              </div>

                                              {/* Validation feedback pill */}
                                              <div
                                                className={`mt-2 flex items-center gap-1.5 text-xs font-medium leading-5 ${
                                                  repositoryValidation.state === "error"
                                                    ? "text-rose-700"
                                                    : repositoryValidation.state === "public"
                                                    ? "text-emerald-700"
                                                    : "text-slate-500"
                                                }`}
                                              >
                                                {repositoryValidation.state === "checking" && (
                                                  <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin text-amber-600" />
                                                )}
                                                {repositoryValidation.state === "error" && (
                                                  <CircleAlert className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                                                )}
                                                {repositoryValidation.state === "public" && (
                                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                                )}
                                                <span>
                                                  {repositoryValidation.message ||
                                                    "Only public GitHub repositories can be reviewed. Confirm your repository visibility before submitting."}
                                                </span>
                                              </div>
                                            </div>

                                            <div>
                                              <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-700 mb-1.5">
                                                Deliverable Notes for Reviewer
                                              </label>
                                              <textarea
                                                value={submission.notes}
                                                onChange={(event) =>
                                                  setSubmission((old) => ({ ...old, notes: event.target.value }))
                                                }
                                                maxLength={1500}
                                                rows={3}
                                                placeholder="Detail your architecture decisions, edge cases handled, and unit test coverage…"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                              />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                              <button
                                                onClick={() => void submitWork(step.id)}
                                                disabled={Boolean(busy) || repositoryValidation.state === "checking"}
                                                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#061833] font-bold px-5 text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                                              >
                                                <Send className="h-4 w-4" />
                                                <span>{busy ? "Submitting Work…" : "Submit for Code Review"}</span>
                                              </button>
                                              <button
                                                onClick={() => setOpenMilestone(null)}
                                                className="min-h-10 rounded-xl px-4 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ol>
                              </div>

                              {/* Right Column: Completion Letter Request */}
                              <aside
                                className="border-t border-slate-200 bg-slate-50/70 p-6 sm:p-8 lg:border-l lg:border-t-0 flex flex-col justify-between"
                                aria-label="Completion letter request"
                              >
                                <div>
                                  <div className="flex items-start gap-3.5">
                                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 shadow-xs">
                                      <FileCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-[#061833] text-base">Completion Letter</h3>
                                      <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                                        Official internship completion letter issued by the Devatrix admin team.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Completed State vs In-Progress State */}
                                  {isTrackComplete ? (
                                    <div className="mt-6 space-y-4">
                                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                          <span>Internship 100% Completed</span>
                                        </div>
                                        <p className="mt-1 text-xs text-emerald-900 leading-relaxed">
                                          All six weekly deliverables are approved. Request your completion letter from the admin team below.
                                        </p>
                                      </div>

                                      {!letterRequest || letterRequest.status === "rejected" ? (
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                                          {letterRequest?.status === "rejected" && (
                                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 leading-relaxed">
                                              Your previous request was declined. Update your note if needed and submit a new request to the admin team.
                                            </div>
                                          )}

                                          <div>
                                            <label
                                              htmlFor={`letter-note-${enrollment.id}`}
                                              className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                                            >
                                              Note for Admin Team (Optional)
                                            </label>
                                            <textarea
                                              id={`letter-note-${enrollment.id}`}
                                              rows={2}
                                              maxLength={120}
                                              value={letterNotes[enrollment.id] ?? ""}
                                              onChange={(event) =>
                                                setLetterNotes((old) => ({ ...old, [enrollment.id]: event.target.value }))
                                              }
                                              placeholder="Recipient attention line, university details, or email note…"
                                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                            />
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              void post(
                                                "/api/portal/letter-requests",
                                                {
                                                  enrollmentId: enrollment.id,
                                                  note: (letterNotes[enrollment.id] ?? "").trim(),
                                                },
                                                "Your completion letter request has been sent to the Devatrix admin team."
                                              )
                                            }
                                            disabled={Boolean(busy)}
                                            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#061833] text-xs font-bold transition-all shadow-xs disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                          >
                                            <Send className="h-3.5 w-3.5" />
                                            <span>
                                              {busy === "/api/portal/letter-requests"
                                                ? "Sending Request…"
                                                : "Request Completion Letter"}
                                            </span>
                                          </button>
                                        </div>
                                      ) : letterRequest.status === "issued" ? (
                                        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs space-y-2">
                                          <div className="flex items-start justify-between gap-2">
                                            <p className="font-bold text-[#061833] text-sm">Completion Letter Issued</p>
                                            <span className="shrink-0 whitespace-nowrap text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                              Issued
                                            </span>
                                          </div>
                                          <p className="text-xs font-mono text-slate-500">
                                            Issued {letterRequest.issued_at ? date(letterRequest.issued_at) : "Verified"}
                                          </p>
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                            Your official internship completion letter has been issued by the Devatrix admin team and sent to your registered email.
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs space-y-2">
                                          <div className="flex items-start justify-between gap-2">
                                            <p className="font-bold text-[#061833] text-sm">Request Submitted</p>
                                            <span className="shrink-0 whitespace-nowrap text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                              {letterRequest.status === "paid" ? "Approved · Issuing" : "Pending Admin"}
                                            </span>
                                          </div>
                                          <p className="text-xs font-mono text-slate-500">
                                            Requested {date(letterRequest.requested_at)}
                                          </p>
                                          {letterRequest.note && (
                                            <p className="rounded-lg bg-white/80 border border-blue-100 px-2.5 py-1.5 text-xs text-slate-700">
                                              <strong>Your note:</strong> {letterRequest.note}
                                            </p>
                                          )}
                                          <p className="text-xs text-slate-600 leading-relaxed">
                                            Your completion letter request is queued with the Devatrix admin team for review and delivery to your registered email.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center shadow-xs">
                                      <Lock className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                                      <p className="text-xs font-semibold text-[#061833]">Completion Letter Locked</p>
                                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                                        Complete all 6 weekly milestones with reviewer approval to unlock your completion letter request to Admin.
                                      </p>
                                      <div className="mt-3 text-[11px] font-mono text-amber-800 font-semibold">
                                        {6 - done} remaining for completion
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
                                  <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                                  <span>Processed &amp; issued directly by Devatrix Admin</span>
                                </div>
                              </aside>
                            </div>
                          </article>
                        );
                      })}
                    </>
                  )}
                </section>
              )}

              {/* VIEW 2: SUBMITTED APPLICATIONS */}
              {view === "applications" && (
                <section className="mt-8 space-y-6" aria-label="Submitted application updates">
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                      <div>
                        <h2 className="text-lg font-bold text-[#061833]">Application Updates &amp; Intake Records</h2>
                        <p className="text-xs text-slate-500">
                          Review status of your initial track submissions and intake records.
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{data.applications.length} on file</span>
                    </div>

                    {!data.applications.length ? (
                      <p className="py-8 text-center text-xs text-slate-500 font-mono">
                        No previous application history found.
                      </p>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {data.applications.map((application, index) => (
                          <li
                            key={`${application.id}-${index}`}
                            className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              <div>
                                <span className="font-bold text-[#061833] block">{application.track}</span>
                                <span className="text-xs font-mono text-slate-500">
                                  Submitted {date(application.created_at)}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-mono font-bold capitalize ${
                                application.status === "accepted" || application.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100 text-amber-900 border border-amber-200"
                              }`}
                            >
                              {titleFor(application.status)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              )}

              {/* VIEW 3: EXPLORE TRACKS */}
              {view === "explore" && (
                <section className="mt-8 space-y-6" aria-labelledby="explore-title">
                  <div className="mb-6">
                    <h2 id="explore-title" className="text-2xl font-extrabold text-[#061833] font-sans">
                      Explore Engineering Tracks
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                      Enroll in additional tracks using your current verified account. Each track provides an independent schedule, curriculum, and completion review.
                    </p>
                  </div>

                  {!data.tracks.filter((t) => !activeTrackSlugs.has(t.slug)).length ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-xs">
                      <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                      <p className="font-bold text-[#061833] text-base">All Published Tracks Active</p>
                      <p className="mt-1 text-xs text-slate-500">
                        You are already enrolled in every currently published Devatrix engineering track!
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {data.tracks
                        .filter((track) => !activeTrackSlugs.has(track.slug))
                        .map((track) => (
                          <article
                            key={track.slug}
                            className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-amber-300 transition-all group"
                          >
                            <div>
                              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800">
                                {track.badge}
                              </span>
                              <h3 className="mt-2 text-lg font-bold text-[#061833] group-hover:text-amber-700 transition-colors font-sans">
                                {track.title}
                              </h3>
                              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                                {track.summary}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                void post(
                                  "/api/portal/enroll",
                                  { trackSlug: track.slug },
                                  "You’re enrolled. Your new schedule and enrollment code are ready."
                                )
                              }
                              disabled={Boolean(busy)}
                              className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#061833] font-bold px-4 text-xs sm:text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                            >
                              <span>{busy.includes("enroll") ? "Enrolling…" : "Enroll in Track"}</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </article>
                        ))}
                    </div>
                  )}
                </section>
              )}

              {/* Security & Privacy Statement */}
              <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs text-slate-600 shadow-xs">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  All sprint submissions and completion letter requests are strictly private to this authenticated account.
                  Enrollment codes identify cohort records; they are not credentials.
                </span>
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
}
