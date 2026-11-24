"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateMilestoneSchedule } from "@/lib/portal/milestone-schedule";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  Clock3,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Folder,
  FolderGit2,
  GraduationCap,
  HelpCircle,
  Home,
  KeyRound,
  Layers,
  LayoutGrid,
  ListTodo,
  LoaderCircle,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Plus,
  Printer,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

type Enrollment = {
  id: string;
  track_slug: string;
  enrollment_code: string;
  status: string;
  started_at: string;
  expected_end_at: string;
  completed_at: string | null;
  site_content?: { title: string; summary: string; badge: string } | Array<{ title: string; summary: string; badge: string }> | null;
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

type CertificateRequest = {
  id: string;
  enrollment_id: string;
  certificate_type: "simple" | "premium";
  status: string;
  fee_amount: number | null;
  currency: string | null;
  requested_at: string;
  issued_at: string | null;
};

type Track = { slug: string; title: string; summary: string; badge: string };

type Dashboard = {
  learner: { email: string; name: string };
  enrollments: Enrollment[];
  milestones: Milestone[];
  certificateRequests: CertificateRequest[];
  applications: Array<{ id: string; track: string; status: string; created_at: string }>;
  tracks: Track[];
  certificateSettings: {
    simple_fee: number | null;
    premium_fee: number | null;
    currency: string | null;
    payment_instructions: string;
    signatory_name: string;
    signatory_title: string;
  } | null;
};

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const fullDateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

const date = (value: string | Date) => {
  try {
    return dateFormat.format(typeof value === "string" ? new Date(value) : value);
  } catch {
    return String(value);
  }
};

const fullDate = (value: string | Date) => {
  try {
    return fullDateFormat.format(typeof value === "string" ? new Date(value) : value);
  } catch {
    return String(value);
  }
};

const titleFor = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function getInitials(name: string) {
  if (!name) return "D";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Google Classroom vibrant card banner gradients
const BANNER_GRADIENTS: Record<string, string> = {
  "web-fullstack": "from-[#1a73e8] to-[#1557b0]",
  "frontend-fullstack": "from-[#0284c7] to-[#0369a1]",
  "devops-engineering": "from-[#202124] via-[#3c4043] to-[#1a73e8]",
  "cloud-devops": "from-[#202124] via-[#3c4043] to-[#1a73e8]",
  "flutter": "from-[#02569B] to-[#0175C2]",
  "mobile-crossplatform": "from-[#1e8e3e] to-[#137333]",
  "react-native": "from-[#087ea4] to-[#045975]",
  "ai-agents": "from-[#7627b0] to-[#5e17eb]",
  "ai-engineering": "from-[#7627b0] to-[#5e17eb]",
  "ai-fde": "from-[#4c1d95] to-[#6d28d9]",
  "cybersecurity": "from-[#006064] to-[#00838f]",
  "data-science": "from-[#d93025] to-[#b31412]",
  "data-analytics": "from-[#b06000] to-[#e37400]",
  "backend-api": "from-[#e37400] to-[#b06000]",
};

export default function PortalDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  // Layout Navigation
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState<"programs" | "calendar" | "todo" | "explore" | "applications">("programs");

  // Selected program & tabs
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [classTab, setClassTab] = useState<"stream" | "milestones" | "people">("stream");

  // Dedicated Assignment Opening (Image 3: Opens dedicated assignment view)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Document Viewer Modal State (PDF Technical Specification)
  const [viewingDocMilestone, setViewingDocMilestone] = useState<Milestone | null>(null);

  // Certificate Preview Modal State
  const [preview, setPreview] = useState<{ enrollmentId: string; style: "simple" | "premium" } | null>(null);

  // Submission Form State (GitHub link + notes)
  const [submission, setSubmission] = useState({ url: "", notes: "" });
  const [repositoryValidation, setRepositoryValidation] = useState<{ state: "idle" | "checking" | "public" | "error"; message: string }>({
    state: "idle",
    message: "",
  });

  // Settings Modal State (Change Name / Password)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ name: "", password: "", confirmPassword: "" });
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  // Class comments state (allows posting class & private comments in session)
  const [classComments, setClassComments] = useState<Record<string, Array<{ author: string; text: string; date: string; role?: string }>>>({
    "web-fullstack-1": [
      {
        author: "Umair ul Hassan",
        role: "Instructor",
        text: "Make sure all components include explicit TypeScript interfaces for props and state. Avoid using 'any'.",
        date: "Nov 21, 2026",
      },
    ],
    "web-fullstack-4": [
      {
        author: "Umair ul Hassan",
        role: "Instructor",
        text: "Ensure invalid form submissions display inline errors and disabled submit states while pending.",
        date: "Nov 23, 2026",
      },
    ],
  });
  const [newCommentText, setNewCommentText] = useState("");
  const [newPrivateCommentText, setNewPrivateCommentText] = useState("");
  const [privateComments, setPrivateComments] = useState<Record<string, Array<{ author: string; text: string; date: string }>>>({});

  // UI helpers
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [cardMenuOpen, setCardMenuOpen] = useState<string | null>(null);
  const [topicCollapsed, setTopicCollapsed] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCardMenuOpen(null);
        setUserMenuOpen(false);
      }
    }
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-menu]")) {
        setCardMenuOpen(null);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

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
      if (result.learner?.name) {
        setSettingsForm((prev) => ({ ...prev, name: result.learner.name }));
      }
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
          if (result.learner?.name) {
            setSettingsForm((prev) => ({ ...prev, name: result.learner.name }));
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

  const milestonesFor = useCallback(
    (enrollmentId: string) =>
      (data?.milestones ?? [])
        .filter((item) => item.enrollment_id === enrollmentId)
        .sort((a, b) => a.week_number - b.week_number),
    [data]
  );

  const requestsFor = useCallback(
    (enrollmentId: string) =>
      (data?.certificateRequests ?? []).filter((item) => item.enrollment_id === enrollmentId),
    [data]
  );

  const trackFor = useCallback((row: Enrollment) => {
    return Array.isArray(row.site_content) ? row.site_content[0] : row.site_content;
  }, []);

  const completedCount = useCallback(
    (id: string) => milestonesFor(id).filter((item) => item.status === "completed").length,
    [milestonesFor]
  );

  const nextDue = useMemo(
    () =>
      (data?.milestones ?? [])
        .filter((item) => !["completed", "submitted"].includes(item.status))
        .sort((a, b) => Date.parse(a.due_at) - Date.parse(b.due_at))[0],
    [data]
  );

  const selectedEnrollment = useMemo(
    () => data?.enrollments.find((e) => e.id === selectedEnrollmentId) ?? null,
    [data, selectedEnrollmentId]
  );

  const activeMilestone = useMemo(
    () => (data && activeMilestoneId ? data.milestones.find((m) => m.id === activeMilestoneId) ?? null : null),
    [data, activeMilestoneId]
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
        throw new Error(result.error || "We couldn’t confirm this repository is public. Check the link and visibility.");
      }
      if (requestId !== repositoryValidationRequest.current) return false;
      setRepositoryValidation({ state: "public", message: "Public repository verified. You can turn in this work." });
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
    if (!repositoryUrl) {
      setRepositoryValidation({ state: "error", message: "Add your GitHub repository link to continue." });
      return;
    }
    const isValid = await validateRepository(repositoryUrl);
    if (!isValid || repositoryUrlRef.current.trim() !== repositoryUrl) return;

    const done = await post(
      "/api/portal/milestones",
      { milestoneId, submissionUrl: submission.url, notes: submission.notes },
      "Your work was handed in for reviewer evaluation."
    );
    if (done) {
      setSubmission({ url: "", notes: "" });
    }
  }

  async function handleSaveSettings() {
    setSettingsError("");
    setSettingsSuccess("");

    if (settingsForm.password && settingsForm.password !== settingsForm.confirmPassword) {
      setSettingsError("Passwords do not match.");
      return;
    }

    if (settingsForm.password && settingsForm.password.length < 8) {
      setSettingsError("Password must be at least 8 characters.");
      return;
    }

    setSettingsBusy(true);
    try {
      const payload: { name?: string; password?: string } = {};
      if (settingsForm.name && settingsForm.name !== data?.learner.name) {
        payload.name = settingsForm.name.trim();
      }
      if (settingsForm.password) {
        payload.password = settingsForm.password;
      }

      if (Object.keys(payload).length === 0) {
        setSettingsError("No changes were made.");
        setSettingsBusy(false);
        return;
      }

      const res = await fetch("/api/portal/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update settings.");

      setSettingsSuccess("Profile settings updated successfully!");
      if (payload.name && data) {
        setData({
          ...data,
          learner: { ...data.learner, name: payload.name },
        });
      }
      setSettingsForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => {
        setSettingsOpen(false);
        setSettingsSuccess("");
      }, 1500);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to update settings.");
    } finally {
      setSettingsBusy(false);
    }
  }

  function handleAddClassComment(milestoneKey: string) {
    if (!newCommentText.trim() || !data) return;
    const comment = {
      author: data.learner.name,
      text: newCommentText.trim(),
      date: "Just now",
    };
    setClassComments((prev) => ({
      ...prev,
      [milestoneKey]: [...(prev[milestoneKey] || []), comment],
    }));
    setNewCommentText("");
  }

  function copyToClipboard(text: string, id: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setNotice(`Enrolled section code ${text} copied to clipboard.`);
      setTimeout(() => {
        setCopiedCode(null);
        setCardMenuOpen(null);
      }, 1000);
    }
  }

  async function handleSignOut() {
    try {
      await fetch("/api/portal/session", { method: "DELETE" });
      window.location.href = "/portal/sign-in";
    } catch {
      window.location.reload();
    }
  }

  const activeEnrollmentForPreview = preview ? data?.enrollments.find((item) => item.id === preview.enrollmentId) : undefined;
  const activeTrackForPreview = activeEnrollmentForPreview ? trackFor(activeEnrollmentForPreview) : undefined;
  const certSettings = data?.certificateSettings;
  const activeRequestForPreview = preview && data ? requestsFor(preview.enrollmentId).find((item) => item.certificate_type === preview.style) : undefined;

  const renderSidebarContent = (isMobile = false) => {
    const showLabels = isMobile || !sidebarCollapsed;

    return (
      <div className="flex h-full flex-col justify-between overflow-y-auto py-2">
        <div>
          {/* Programs (Home) Nav Item */}
          <button
            type="button"
            onClick={() => {
              setSelectedEnrollmentId(null);
              setActiveMilestoneId(null);
              setActiveNav("programs");
              if (isMobile) setMobileDrawerOpen(false);
            }}
            className={`flex w-full items-center gap-4 px-5 py-3 text-sm font-medium transition rounded-r-full ${
              activeNav === "programs" && selectedEnrollmentId === null
                ? "bg-[#e8f0fe] text-[#1967d2] font-semibold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Home className="h-5 w-5 shrink-0" />
            {showLabels && <span>Programs</span>}
          </button>

          {/* Submission Calendar */}
          <button
            type="button"
            onClick={() => {
              setSelectedEnrollmentId(null);
              setActiveMilestoneId(null);
              setActiveNav("calendar");
              if (isMobile) setMobileDrawerOpen(false);
            }}
            className={`flex w-full items-center gap-4 px-5 py-3 text-sm font-medium transition rounded-r-full ${
              activeNav === "calendar"
                ? "bg-[#e8f0fe] text-[#1967d2] font-semibold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Calendar className="h-5 w-5 shrink-0" />
            {showLabels && <span>Calendar & Schedule</span>}
          </button>

          {/* Enrolled Programs Section Header */}
          {showLabels && (
            <div className="my-2 border-t border-slate-200 px-5 pt-3 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Programs</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
          )}

          {/* To-do List */}
          <button
            type="button"
            onClick={() => {
              setSelectedEnrollmentId(null);
              setActiveMilestoneId(null);
              setActiveNav("todo");
              if (isMobile) setMobileDrawerOpen(false);
            }}
            className={`flex w-full items-center gap-4 px-5 py-3 text-sm font-medium transition rounded-r-full ${
              activeNav === "todo"
                ? "bg-[#e8f0fe] text-[#1967d2] font-semibold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <ListTodo className="h-5 w-5 shrink-0" />
            {showLabels && <span>To-do</span>}
          </button>

          {/* List of Enrolled Programs */}
          {showLabels && data && (
            <div className="space-y-0.5">
              {data.enrollments.map((e) => {
                const track = trackFor(e);
                const isSelected = selectedEnrollmentId === e.id;
                const initial = (track?.title || e.track_slug).charAt(0).toUpperCase();

                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      setSelectedEnrollmentId(e.id);
                      setActiveMilestoneId(null);
                      setClassTab("stream");
                      if (isMobile) setMobileDrawerOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-5 py-2.5 text-xs text-left transition rounded-r-full ${
                      isSelected
                        ? "bg-[#e8f0fe] text-[#1967d2] font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-white font-bold text-[11px]">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium leading-tight">{track?.title ?? e.track_slug}</p>
                      <p className="truncate text-[10px] text-slate-500 font-normal leading-tight">Cohort {e.enrollment_code}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Other Sections Divider */}
          {showLabels && (
            <div className="my-2 border-t border-slate-200 px-5 pt-3 pb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog & Records</span>
            </div>
          )}

          {/* Explore Programs */}
          <button
            type="button"
            onClick={() => {
              setSelectedEnrollmentId(null);
              setActiveMilestoneId(null);
              setActiveNav("explore");
              if (isMobile) setMobileDrawerOpen(false);
            }}
            className={`flex w-full items-center gap-4 px-5 py-3 text-sm font-medium transition rounded-r-full ${
              activeNav === "explore"
                ? "bg-[#e8f0fe] text-[#1967d2] font-semibold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="h-5 w-5 shrink-0" />
            {showLabels && <span>Explore Programs</span>}
          </button>

          {/* Applications */}
          {data && data.applications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedEnrollmentId(null);
                setActiveMilestoneId(null);
                setActiveNav("applications");
                if (isMobile) setMobileDrawerOpen(false);
              }}
              className={`flex w-full items-center gap-4 px-5 py-3 text-sm font-medium transition rounded-r-full ${
                activeNav === "applications"
                  ? "bg-[#e8f0fe] text-[#1967d2] font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Layers className="h-5 w-5 shrink-0" />
              {showLabels && <span>Applications</span>}
            </button>
          )}
        </div>

        {/* Support at bottom of sidebar */}
        {showLabels && (
          <div className="p-4 border-t border-slate-100">
            <a
              href="https://wa.me/923156179410"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-xs text-slate-500 hover:text-slate-800 transition"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Mentor Support</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans antialiased flex flex-col">
      {/* =========================================================================
          GOOGLE CLASSROOM TOP APPLICATION BAR (MATCHING IMAGE 1, 2, 3)
          ========================================================================= */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white px-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth < 768) {
                setMobileDrawerOpen((prev) => !prev);
              } else {
                setSidebarCollapsed((prev) => !prev);
              }
            }}
            title="Main menu"
            aria-label="Main menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Devatrix Workspace Brand & Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                setSelectedEnrollmentId(null);
                setActiveMilestoneId(null);
                setActiveNav("programs");
              }}
              className="flex items-center gap-2.5 hover:opacity-90 transition shrink-0"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#061833] p-1 shadow-sm">
                <Image src="/logo-transparent.png" alt="Devatrix" width={24} height={24} priority className="object-contain" />
              </div>
              <span className="text-[19px] font-medium tracking-tight text-slate-700 hidden sm:inline">
                Devatrix <span className="font-normal text-slate-500">Workspace</span>
              </span>
            </button>

            {/* Breadcrumb Path */}
            {selectedEnrollment && (
              <div className="flex items-center gap-1.5 min-w-0">
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="flex flex-col min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMilestoneId(null);
                      setClassTab("stream");
                    }}
                    className="truncate text-left text-xs sm:text-sm font-semibold text-slate-800 hover:underline max-w-[150px] sm:max-w-xs leading-tight"
                  >
                    {trackFor(selectedEnrollment)?.title ?? selectedEnrollment.track_slug}
                  </button>
                  <span className="text-[10px] text-slate-500 font-normal leading-tight truncate">
                    Cohort {selectedEnrollment.enrollment_code} · Batch 2026
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Tabs (Visible when inside a Program) */}
        {selectedEnrollment && (
          <nav className="hidden md:flex items-center gap-1 sm:gap-6 h-full self-stretch">
            <button
              type="button"
              onClick={() => {
                setActiveMilestoneId(null);
                setClassTab("stream");
              }}
              className={`h-full border-b-[3px] px-3.5 text-sm font-medium transition flex items-center ${
                classTab === "stream" && !activeMilestoneId
                  ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Stream
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMilestoneId(null);
                setClassTab("milestones");
              }}
              className={`h-full border-b-[3px] px-3.5 text-sm font-medium transition flex items-center ${
                classTab === "milestones" || activeMilestoneId
                  ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Milestones & Curriculum
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMilestoneId(null);
                setClassTab("people");
              }}
              className={`h-full border-b-[3px] px-3.5 text-sm font-medium transition flex items-center ${
                classTab === "people" && !activeMilestoneId
                  ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Mentors & Cohort
            </button>
          </nav>
        )}

        {/* Right Action Icons: Add Program, Refresh, Tools & Profile Avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Enroll Program */}
          {!selectedEnrollment && (
            <button
              type="button"
              onClick={() => {
                setSelectedEnrollmentId(null);
                setActiveMilestoneId(null);
                setActiveNav("explore");
              }}
              title="Enroll in program"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}

          {/* Refresh */}
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            title="Refresh dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#1a73e8]" : ""}`} />
          </button>

          {/* Tools Grid Icon */}
          <button
            type="button"
            onClick={() => setActiveNav("explore")}
            title="Internship learning catalog"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>

          {/* User Profile Avatar with Dropdown Menu */}
          <div className="relative ml-1" data-menu="user-menu">
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              title="Devatrix Account"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8] text-white text-xs font-semibold ring-2 ring-transparent hover:ring-slate-300 transition"
            >
              {data ? getInitials(data.learner.name) : "U"}
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl text-slate-800"
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a73e8] text-white font-bold text-sm">
                    {data ? getInitials(data.learner.name) : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{data?.learner.name}</p>
                    <p className="truncate text-xs text-slate-500">{data?.learner.email}</p>
                  </div>
                </div>

                <div className="py-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-between py-1">
                    <span>Enrolled Programs</span>
                    <span className="font-semibold text-slate-900">{data?.enrollments.length ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Approved Milestones</span>
                    <span className="font-semibold text-slate-900">
                      {data?.milestones.filter((m) => m.status === "completed").length ?? 0} / {data?.milestones.length ?? 0}
                    </span>
                  </div>
                </div>

                {/* Account Settings Option (Requested: Change username/password) */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setSettingsOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
                  >
                    <LogOut className="h-4 w-4 text-rose-600" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Alerts */}
      {error && (
        <div role="alert" className="mx-6 mt-4 flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="font-bold uppercase text-rose-700">Dismiss</button>
        </div>
      )}

      {notice && (
        <div role="status" className="mx-6 mt-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice("")} className="font-bold uppercase text-emerald-700">Dismiss</button>
        </div>
      )}

      {/* =========================================================================
          BODY: SIDEBAR + MAIN CONTENT AREA
          ========================================================================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Drawer Backdrop */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Slide-out Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-hidden md:hidden ${
            mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#061833] p-1 shadow-sm">
                <Image src="/logo-transparent.png" alt="Devatrix" width={24} height={24} priority className="object-contain" />
              </div>
              <span className="text-base font-semibold text-slate-800">
                Devatrix <span className="font-normal text-slate-500">Workspace</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {renderSidebarContent(true)}
          </div>
        </aside>

        {/* Desktop Collapsible Sidebar (md+) */}
        <aside
          className={`hidden md:flex md:flex-col shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
            !sidebarCollapsed ? "md:w-64" : "md:w-16"
          } justify-between overflow-hidden`}
        >
          {renderSidebarContent(false)}
        </aside>

        {/* MAIN WORKSPACE CONTENT CONTAINER */}
        <main className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 xl:p-10">
          {/* Global Loading Spinner */}
          {loading && !data && (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-[#1a73e8]" />
              <p className="text-sm font-medium text-slate-500">Loading your internship workspace…</p>
            </div>
          )}

          {data && (
            <>
              {/* =========================================================================
                  STATE A: HOME VIEW - CLEAN INTERNSHIP PROGRAMS GRID
                  ========================================================================= */}
              {selectedEnrollmentId === null && activeNav === "programs" && (
                <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                  {/* Top Utility Row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
                      <Clock3 className="h-4 w-4 text-[#1a73e8]" />
                      <span>
                        Weekly Submission:{" "}
                        <strong className="text-slate-900">
                          {nextDue ? `${nextDue.title} (Due Sunday, 11:59 PM)` : "All milestones completed"}
                        </strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveNav("calendar")}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
                    >
                      <Calendar className="h-4 w-4 text-[#1a73e8]" />
                      <span>Submission Schedule</span>
                    </button>

                    <a
                      href="https://wa.me/923156179410"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
                    >
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                      <span>WhatsApp Cohort Group</span>
                    </a>
                  </div>

                  {/* Section Title & Add Program Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-normal text-slate-800">My Programs</h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track weekly deliverables, project briefs, and reviewer feedback.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("explore")}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a73e8] hover:underline"
                    >
                      <Plus className="h-4 w-4" />
                      Enroll in another program
                    </button>
                  </div>

                  {/* PROGRAMS CARDS GRID */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
                    {data.enrollments.map((enrollment) => {
                      const track = trackFor(enrollment);
                      const steps = milestonesFor(enrollment.id);
                      const nextStep = steps.find((s) => !["completed", "submitted"].includes(s.status));
                      const bannerGradient = BANNER_GRADIENTS[enrollment.track_slug] || "from-[#1a73e8] to-[#1557b0]";
                      const initial = (track?.title || enrollment.track_slug).charAt(0).toUpperCase();

                      return (
                        <div
                          key={enrollment.id}
                          className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
                        >
                          {/* CARD BANNER HEADER (~140px, Vibrant Cover with Crest) */}
                          <div
                            onClick={() => {
                              setSelectedEnrollmentId(enrollment.id);
                              setActiveMilestoneId(null);
                              setClassTab("stream");
                            }}
                            className={`relative h-36 cursor-pointer bg-gradient-to-r ${bannerGradient} p-4 text-white flex flex-col justify-between`}
                          >
                            <div className="min-w-0 pr-14">
                              <h3 className="line-clamp-2 text-base sm:text-lg font-medium leading-snug text-white hover:underline">
                                {track?.title ?? enrollment.track_slug}
                              </h3>
                              <p className="mt-1 text-xs text-white/90">Cohort {enrollment.enrollment_code} · Batch 2026</p>
                            </div>

                            <p className="text-xs text-white/80">Lead Mentor: Umair ul Hassan</p>

                            {/* Circular Avatar / University Crest Overlapping Bottom-Right of Banner */}
                            <div className="absolute -bottom-7 right-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#061833] text-white shadow-md font-bold text-lg select-none">
                              {initial}
                            </div>
                          </div>

                          {/* CARD BODY: CLEAN & FREE OF CLUTTER */}
                          <div className="flex h-24 flex-col justify-between p-4 pt-6">
                            {nextStep ? (
                              <div className="pt-2">
                                <p className="text-[11px] font-semibold text-slate-500">
                                  Due Sunday {date(nextStep.due_at)}, 11:59 PM
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedEnrollmentId(enrollment.id);
                                    setActiveMilestoneId(nextStep.id);
                                  }}
                                  className="mt-0.5 block text-left text-xs font-normal text-slate-800 hover:text-[#1a73e8] hover:underline line-clamp-1"
                                >
                                  Week {nextStep.week_number}: {nextStep.title}
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-700 pt-2">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>All milestones approved</span>
                              </div>
                            )}
                          </div>

                          {/* CARD FOOTER */}
                          <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 px-3 py-2 text-slate-500">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEnrollmentId(enrollment.id);
                                setActiveMilestoneId(null);
                                setClassTab("milestones");
                              }}
                              title="Open milestones"
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition"
                            >
                              <FileCheck2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEnrollmentId(enrollment.id);
                                setActiveMilestoneId(null);
                                setClassTab("stream");
                              }}
                              title="Open stream"
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition"
                            >
                              <Folder className="h-4 w-4" />
                            </button>

                            <div className="relative" data-menu="card-menu">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardMenuOpen(cardMenuOpen === enrollment.id ? null : enrollment.id);
                                }}
                                title="Program options"
                                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {/* Dropdown Menu for 3-dots */}
                              {cardMenuOpen === enrollment.id && (
                                <div
                                  className="absolute bottom-10 right-0 z-30 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg text-slate-800 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(enrollment.enrollment_code, enrollment.id)}
                                    className="flex w-full items-center justify-between px-3 py-2 hover:bg-slate-50 text-left"
                                  >
                                    <span>Copy code: {enrollment.enrollment_code}</span>
                                    {copiedCode === enrollment.id ? (
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedEnrollmentId(enrollment.id);
                                      setActiveMilestoneId(null);
                                      setClassTab("milestones");
                                      setCardMenuOpen(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left"
                                  >
                                    <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                                    <span>Open Milestones</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STATE B: DEDICATED WORKSPACE (STREAM / MILESTONES / MENTORS)
                  ========================================================================= */}
              {selectedEnrollment && !activeMilestone && (
                <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                  {/* Mobile Tab Strip */}
                  <div className="flex md:hidden items-center justify-around border-b border-slate-200 bg-white rounded-lg shadow-xs py-1">
                    <button
                      type="button"
                      onClick={() => setClassTab("stream")}
                      className={`py-2 px-3 text-xs font-semibold ${
                        classTab === "stream" ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" : "text-slate-600"
                      }`}
                    >
                      Stream
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassTab("milestones")}
                      className={`py-2 px-3 text-xs font-semibold ${
                        classTab === "milestones" ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" : "text-slate-600"
                      }`}
                    >
                      Milestones
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassTab("people")}
                      className={`py-2 px-3 text-xs font-semibold ${
                        classTab === "people" ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" : "text-slate-600"
                      }`}
                    >
                      Mentors
                    </button>
                  </div>

                  {/* -----------------------------------------------------------------
                      TAB 1: STREAM (DIRECT FEED WITHOUT HUGE HERO BLOCK)
                      ----------------------------------------------------------------- */}
                  {classTab === "stream" && (
                    <div className="space-y-6">
                      {/* Stream 2-Column Layout */}
                      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
                        {/* Left Column: Upcoming Work Box */}
                        <div className="space-y-4">
                          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs h-fit space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-semibold text-slate-800">Impending Milestones</h3>
                              <Clock3 className="h-3.5 w-3.5 text-[#1a73e8]" />
                            </div>
                            <div className="space-y-3">
                              {milestonesFor(selectedEnrollment.id)
                                .filter((m) => !["completed", "submitted"].includes(m.status))
                                .slice(0, 2)
                                .map((m) => {
                                  const sched = calculateMilestoneSchedule(m);
                                  return (
                                    <div key={m.id} className="text-xs space-y-1">
                                      <p className="text-[11px] font-semibold text-emerald-700">
                                        Due Sunday {date(sched.regularDueAt)}, 11:59 PM
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => setActiveMilestoneId(m.id)}
                                        className="text-left font-medium text-[#1a73e8] hover:underline line-clamp-1 block"
                                      >
                                        Week {m.week_number}: {m.title}
                                      </button>
                                      <p className="text-[10px] text-slate-400">
                                        Grace cutoff: Mon 11:59 PM
                                      </p>
                                    </div>
                                  );
                                })}
                              {milestonesFor(selectedEnrollment.id).every((m) => ["completed", "submitted"].includes(m.status)) && (
                                <p className="text-xs text-slate-500">All milestones completed!</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setClassTab("milestones")}
                              className="mt-3 block text-xs font-semibold text-[#1a73e8] hover:underline"
                            >
                              View all milestones →
                            </button>
                          </div>

                          <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900 space-y-1.5 shadow-2xs">
                            <p className="font-semibold text-blue-950 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#1a73e8]" />
                              <span>Submission Lifecycle</span>
                            </p>
                            <p className="text-[11px] text-blue-800/90 leading-relaxed">
                              Tasks unlock Mondays at 12:00 AM. Regular deadline is Sunday 11:59 PM with a 24-hour grace window.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEnrollmentId(null);
                                setActiveMilestoneId(null);
                                setActiveNav("calendar");
                              }}
                              className="text-[11px] font-bold text-[#1a73e8] hover:underline inline-block pt-1"
                            >
                              Open Calendar Schedule →
                            </button>
                          </div>
                        </div>

                        {/* Right Column: Google Classroom Stream Feed (Image 2: Intertwined Assignments & Bulletins) */}
                        <div className="space-y-4">
                          {/* Announcement Post 1 (Teacher Bulletin with Avatar & Body like Image 2) */}
                          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8] text-white text-xs font-bold">
                                  UH
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-900">Umair ul Hassan</p>
                                  <p className="text-[11px] text-slate-500">Nov 21 (Edited Nov 22)</p>
                                </div>
                              </div>
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="mt-3 text-xs leading-relaxed text-slate-700">
                              <p>
                                Dear Interns, welcome to the 6-week practical cohort. Make sure your GitHub repositories are set to <strong>public</strong> so our reviewing team can assess your code on Sunday. thanks & regards,
                              </p>
                            </div>
                            <div className="mt-4 border-t border-slate-100 pt-2.5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Add comment</span>
                            </div>
                          </div>

                          {/* Assignment Feed Items (Clean Minimalist Stream Cards like Image 2) */}
                          {milestonesFor(selectedEnrollment.id).slice(0, 4).map((step) => (
                            <div
                              key={`post-${step.id}`}
                              onClick={() => setActiveMilestoneId(step.id)}
                              className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition cursor-pointer flex flex-col gap-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                    <FileText className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900 truncate">
                                      Umair ul Hassan posted a new assignment: Week {step.week_number}: {step.title}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      Due {fullDate(step.due_at)}
                                    </p>
                                  </div>
                                </div>
                                <MoreVertical className="h-4 w-4 text-slate-400 shrink-0" />
                              </div>

                              {/* Class Comments Link */}
                              <div className="border-t border-slate-100 pt-2 flex items-center gap-1.5 text-xs text-slate-500">
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>
                                  {(() => {
                                    const count = (classComments[`${selectedEnrollment.track_slug}-${step.week_number}`] || []).length || 1;
                                    return `${count} class comment${count === 1 ? "" : "s"}`;
                                  })()}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* Announcement Post 2 (Mid-Cohort Guidelines) */}
                          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a73e8] text-white text-xs font-bold">
                                  UH
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-900">Umair ul Hassan</p>
                                  <p className="text-[11px] text-slate-500">Nov 14</p>
                                </div>
                              </div>
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="mt-3 text-xs leading-relaxed text-slate-700">
                              <p>
                                Dear students, those who are asking about technical specifications: each milestone includes an official PDF project brief attached to the assignment page. Please review the 100-point rubric before submitting.
                              </p>
                            </div>
                            <div className="mt-4 border-t border-slate-100 pt-2.5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Add comment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -----------------------------------------------------------------
                      TAB 2: MILESTONES & CURRICULUM
                      ----------------------------------------------------------------- */}
                  {classTab === "milestones" && (
                    <div className="space-y-6">
                      {/* Top Action Buttons */}
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setClassTab("people")}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-[#1a73e8] hover:bg-slate-50 transition shadow-xs"
                        >
                          <FileCheck2 className="h-3.5 w-3.5" />
                          View My Submissions & Scores
                        </button>
                        <button
                          type="button"
                          onClick={() => setTopicCollapsed((prev) => !prev)}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          {topicCollapsed ? "Expand all" : "Collapse all"}
                        </button>
                      </div>

                      {/* Topic Header Row */}
                      <div className="border-b border-slate-300 pb-2">
                        <div
                          onClick={() => setTopicCollapsed((prev) => !prev)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <h2 className="text-xl font-normal text-slate-800">
                            6-Week Practical Internship Curriculum
                          </h2>
                          {topicCollapsed ? (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronUp className="h-5 w-5 text-slate-500" />
                          )}
                        </div>
                      </div>

                      {/* Minimalist Milestone Rows */}
                      {!topicCollapsed && (
                        <div className="divide-y divide-slate-100 border-b border-slate-100">
                          {milestonesFor(selectedEnrollment.id).map((step) => {
                            const sched = calculateMilestoneSchedule(step);

                            return (
                              <div
                                key={step.id}
                                onClick={() => setActiveMilestoneId(step.id)}
                                className="group flex cursor-pointer items-center justify-between py-3.5 px-3 hover:bg-slate-50 transition rounded-lg"
                              >
                                {/* Left: Icon & Title & Comment Bubble */}
                                <div className="flex items-center gap-3 min-w-0 pr-4">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    {sched.isLocked ? <Lock className="h-4 w-4 text-slate-400" /> : <FileText className="h-4 w-4" />}
                                  </div>

                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="truncate text-sm font-normal text-slate-800 group-hover:text-[#1a73e8] transition">
                                      Week {step.week_number}: {step.title}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                      <MessageCircle className="h-3 w-3" />
                                      1
                                    </span>
                                  </div>
                                </div>

                                {/* Right: Due Date, Status Pill & Kebab */}
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs text-slate-500 hidden sm:inline">
                                    Due Sunday {date(sched.regularDueAt)}, 11:59 PM
                                  </span>

                                  <span
                                    className={`rounded px-2.5 py-0.5 text-[11px] font-semibold ${
                                      sched.statusBadgeColor === "emerald"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : sched.statusBadgeColor === "blue"
                                        ? "bg-blue-50 text-[#1a73e8]"
                                        : sched.statusBadgeColor === "amber"
                                        ? "bg-amber-50 text-amber-800"
                                        : sched.statusBadgeColor === "rose"
                                        ? "bg-rose-50 text-rose-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {sched.statusLabel}
                                  </span>

                                  <MoreVertical className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* -----------------------------------------------------------------
                      TAB 3: MENTORS & COHORT
                      ----------------------------------------------------------------- */}
                  {classTab === "people" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-base font-normal text-[#1a73e8] border-b border-[#1a73e8] pb-2">Technical Mentors & Lead Reviewers</h2>
                        <div className="flex items-center gap-3 py-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#061833] text-white text-sm font-bold">
                            UH
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Umair ul Hassan</p>
                            <p className="text-xs text-slate-500">Principal Technical Architect & Internship Lead</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h2 className="text-base font-normal text-slate-800">Verified Certificate of Completion</h2>
                          <span className="text-xs text-slate-500">
                            {completedCount(selectedEnrollment.id)} / 6 milestones approved
                          </span>
                        </div>

                        {selectedEnrollment.status === "completed" ? (
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {(["simple", "premium"] as const).map((style) => {
                              const req = requestsFor(selectedEnrollment.id).find((item) => item.certificate_type === style);
                              const fee = style === "simple" ? certSettings?.simple_fee : certSettings?.premium_fee;

                              return (
                                <div key={style} className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase text-[#1a73e8]">{style} Format</span>
                                    {req && <span className="text-xs font-semibold text-blue-700 capitalize">{titleFor(req.status)}</span>}
                                  </div>
                                  <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {style === "premium" ? "Executive Credential with Embossed Border" : "Digital Certificate of Completion"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Fee: {fee === null || fee === undefined ? "—" : `${certSettings?.currency ?? "PKR"} ${Number(fee).toFixed(0)}`}
                                  </p>
                                  <div className="mt-4 flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setPreview({ enrollmentId: selectedEnrollment.id, style })}
                                      className="flex-1 rounded border border-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                      Preview
                                    </button>
                                    {(!req || req.status === "rejected") && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void post(
                                            "/api/portal/certificates",
                                            { enrollmentId: selectedEnrollment.id, certificateType: style },
                                            "Certificate request submitted."
                                          )
                                        }
                                        disabled={fee === null || fee === undefined || Boolean(busy)}
                                        className="flex-1 rounded bg-[#1a73e8] py-1.5 text-xs font-medium text-white hover:bg-[#1557b0] disabled:opacity-50"
                                      >
                                        Request
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
                            <Award className="h-8 w-8 text-slate-400 mx-auto" />
                            <p className="mt-2 text-xs font-medium text-slate-700">Certificate Locked</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Complete and receive reviewer approval on all 6 weekly milestones to unlock certificate issuance.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  STATE C: DEDICATED ASSIGNMENT VIEW (MATCHING IMAGE 4)
                  ========================================================================= */}
              {selectedEnrollment && activeMilestone && (() => {
                const sched = calculateMilestoneSchedule(activeMilestone);

                if (sched.isLocked) {
                  return (
                    <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMilestoneId(null);
                            setClassTab("milestones");
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Milestones
                        </button>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <Lock className="h-7 w-7" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">
                            Week {activeMilestone.week_number}: {activeMilestone.title} is Locked
                          </h2>
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            In accordance with the Devatrix 6-week curriculum schedule, each week&apos;s technical requirements and project briefs unlock automatically on its scheduled Monday.
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 font-medium">
                          <span>Unlocks: Monday {fullDate(sched.unlockAt)}, 12:00 AM</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMilestoneId(null);
                            setClassTab("milestones");
                          }}
                          className="rounded-lg bg-[#1a73e8] px-6 py-2 text-xs font-semibold text-white hover:bg-[#1557b0] transition shadow-xs"
                        >
                          ← Return to Milestones
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                    {/* Top Breadcrumb & Back to Milestones */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMilestoneId(null);
                          setClassTab("milestones");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Milestones
                      </button>

                      <span className="text-xs text-slate-500">
                        Regular Due Sunday {fullDate(sched.regularDueAt)}, 11:59 PM
                      </span>
                    </div>

                    {/* Deadline Status Banner */}
                    {sched.isGracePeriod && (
                      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <CircleAlert className="h-4 w-4 shrink-0 text-amber-600" />
                          <span>
                            <strong>Late Submission Grace Window:</strong> The regular Sunday deadline has passed. Work will be accepted until Monday at 11:59 PM and tagged as Late Submission.
                          </span>
                        </div>
                        <span className="shrink-0 font-bold text-amber-800">Grace Cutoff: Monday 11:59 PM</span>
                      </div>
                    )}

                    {sched.isClosed && !["completed", "submitted"].includes(activeMilestone.status) && (
                      <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 flex items-center gap-2.5 shadow-xs">
                        <CircleAlert className="h-4 w-4 shrink-0 text-rose-600" />
                        <span>
                          <strong>Submission Window Closed:</strong> The hard cutoff for Week {activeMilestone.week_number} (Monday at 11:59 PM) has passed. Submissions are no longer accepted.
                        </span>
                      </div>
                    )}

                    {/* 2-Column Assignment Layout (Matching Image 4 Exactly) */}
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                      {/* LEFT COLUMN: Main Assignment Content, Attachment, Class Comments */}
                      <div className="space-y-6">
                        {/* Assignment Header */}
                        <div className="border-b border-slate-200 pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                <FileText className="h-6 w-6" />
                              </div>
                              <div>
                                <h1 className="text-2xl sm:text-3xl font-normal text-slate-900 leading-tight">
                                  Week {activeMilestone.week_number}: {activeMilestone.title}
                                </h1>
                                <p className="mt-1 text-xs text-slate-500">
                                  Umair ul Hassan · Assigned Week {activeMilestone.week_number}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-xs text-slate-700 font-medium">
                                  <span>100 points</span>
                                  <span>|</span>
                                  <span>Due Sunday {fullDate(sched.regularDueAt)}, 11:59 PM</span>
                                </div>
                              </div>
                            </div>
                            <MoreVertical className="h-5 w-5 text-slate-400 shrink-0" />
                          </div>
                        </div>

                      {/* Instructions Brief */}
                      <div className="text-xs sm:text-sm leading-relaxed text-slate-700 space-y-2">
                        <p>{activeMilestone.instructions}</p>
                      </div>

                      {/* Attached Document Card (Matching Google Classroom Document Chip with Miniature Sheet Preview from Image 4) */}
                      <div>
                        <div
                          onClick={() => setViewingDocMilestone(activeMilestone)}
                          className="group inline-flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-xs hover:border-slate-300 transition cursor-pointer max-w-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-900 group-hover:text-[#1a73e8] transition">
                              Week_{activeMilestone.week_number}_Project_Brief.pdf
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">PDF</p>
                          </div>

                          {/* Miniature PDF Page Preview Thumbnail (Matching Image 4) */}
                          <div className="w-12 h-14 bg-white rounded border border-slate-200 shadow-xs flex flex-col p-1.5 overflow-hidden select-none shrink-0 group-hover:shadow transition">
                            <div className="h-1.5 w-full bg-red-500 rounded-xs mb-1" />
                            <div className="h-1 w-3/4 bg-slate-300 rounded-xs mb-1" />
                            <div className="space-y-0.5">
                              <div className="h-0.5 w-full bg-slate-200 rounded-xs" />
                              <div className="h-0.5 w-5/6 bg-slate-200 rounded-xs" />
                              <div className="h-0.5 w-4/6 bg-slate-200 rounded-xs" />
                              <div className="h-0.5 w-full bg-slate-200 rounded-xs" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Class Comments Section (Image 4) */}
                      <div className="border-t border-slate-200 pt-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span>
                            {(() => {
                              const count = (classComments[`${selectedEnrollment.track_slug}-${activeMilestone.week_number}`] || []).length;
                              return `${count} class comment${count === 1 ? "" : "s"}`;
                            })()}
                          </span>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {(classComments[`${selectedEnrollment.track_slug}-${activeMilestone.week_number}`] || []).map((c, i) => (
                            <div key={i} className="flex items-start gap-3 text-xs">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a73e8] text-white font-bold text-[11px]">
                                {getInitials(c.author)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold text-slate-900">{c.author}</span>
                                  {c.role && (
                                    <span className="rounded bg-blue-50 text-[#1a73e8] px-1 text-[10px] font-semibold">
                                      {c.role}
                                    </span>
                                  )}
                                  <span className="text-[11px] text-slate-400">{c.date}</span>
                                </div>
                                <p className="mt-1 text-slate-700 leading-relaxed">{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#061833] text-white text-[11px] font-bold">
                            {data ? getInitials(data.learner.name) : "U"}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddClassComment(`${selectedEnrollment.track_slug}-${activeMilestone.week_number}`);
                                }
                              }}
                              placeholder="Add class comment..."
                              className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs outline-none focus:border-[#1a73e8]"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddClassComment(`${selectedEnrollment.track_slug}-${activeMilestone.week_number}`)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] transition disabled:opacity-50"
                              disabled={!newCommentText.trim()}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: "Your work" Card & "Private comments" Card (Matching Image 4) */}
                    <div className="space-y-6">
                      {/* 1. "Your work" Card (Image 4) */}
                      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-slate-900">Your work</h3>
                          <span
                            className={`text-xs font-semibold capitalize ${
                              activeMilestone.status === "completed"
                                ? "text-emerald-700"
                                : activeMilestone.status === "submitted"
                                ? "text-[#1a73e8]"
                                : activeMilestone.status === "revision_requested"
                                ? "text-amber-800"
                                : "text-slate-500"
                            }`}
                          >
                            {activeMilestone.status === "completed"
                              ? "Graded (100/100)"
                              : activeMilestone.status === "submitted"
                              ? "Handed in"
                              : activeMilestone.status === "revision_requested"
                              ? "Needs revision"
                              : "Assigned"}
                          </span>
                        </div>

                        {/* Submitted GitHub File / Link Card (styled like Google Drive file card in Image 4) */}
                        {activeMilestone.submission_url && (
                          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                              <a
                                href={activeMilestone.submission_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2.5 text-xs font-medium text-slate-800 hover:text-[#1a73e8] hover:underline truncate"
                              >
                                <FolderGit2 className="h-5 w-5 shrink-0 text-slate-700" />
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-slate-900">Public GitHub Repository</p>
                                  <p className="truncate text-[11px] text-slate-400">{activeMilestone.submission_url}</p>
                                </div>
                              </a>
                              <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            </div>
                          </div>
                        )}

                        {/* Submit / Turn In Form Controls */}
                        {["upcoming", "in_progress", "revision_requested"].includes(activeMilestone.status) ? (
                          <div className="space-y-3 pt-2">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700">
                                Public GitHub Repository
                              </label>
                              <div className="mt-1 flex gap-1.5">
                                <input
                                  value={submission.url}
                                  onChange={(e) => {
                                    repositoryUrlRef.current = e.target.value;
                                    repositoryValidationRequest.current += 1;
                                    setSubmission((old) => ({ ...old, url: e.target.value }));
                                    setRepositoryValidation({ state: "idle", message: "" });
                                  }}
                                  onBlur={() => {
                                    if (submission.url.trim()) void validateRepository();
                                  }}
                                  placeholder="https://github.com/..."
                                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1a73e8]"
                                />
                                <button
                                  type="button"
                                  onClick={() => void validateRepository()}
                                  disabled={repositoryValidation.state === "checking" || !submission.url.trim()}
                                  className="rounded border border-slate-300 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shrink-0"
                                >
                                  Validate
                                </button>
                              </div>

                              {/* Validation Status */}
                              {repositoryValidation.state === "checking" && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-700">
                                  <LoaderCircle className="h-3 w-3 animate-spin" />
                                  <span>Checking public visibility…</span>
                                </p>
                              )}
                              {repositoryValidation.state === "public" && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Public repository verified</span>
                                </p>
                              )}
                              {repositoryValidation.state === "error" && (
                                <p className="mt-1 text-[11px] text-rose-600">
                                  {repositoryValidation.message}
                                </p>
                              )}
                            </div>

                            {sched.isClosed ? (
                              <div className="space-y-2 pt-2">
                                <button
                                  type="button"
                                  disabled
                                  className="w-full rounded-md bg-slate-100 border border-slate-200 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                                >
                                  Submission Closed
                                </button>
                                <p className="text-[11px] text-rose-600 text-center">
                                  Cutoff passed on Monday at 11:59 PM.
                                </p>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => void submitWork(activeMilestone.id)}
                                disabled={Boolean(busy) || repositoryValidation.state === "checking"}
                                className={`w-full rounded-md py-2.5 text-xs font-semibold text-white shadow-xs transition disabled:opacity-50 ${
                                  sched.isGracePeriod
                                    ? "bg-amber-600 hover:bg-amber-700"
                                    : "bg-[#1a73e8] hover:bg-[#1557b0]"
                                }`}
                              >
                                {busy
                                  ? "Handing in…"
                                  : activeMilestone.status === "revision_requested"
                                  ? "Resubmit"
                                  : sched.isGracePeriod
                                  ? "Turn in work (Late Submission)"
                                  : "Turn in"}
                              </button>
                            )}

                            <p className="text-[11px] text-slate-400 text-center">
                              {sched.isGracePeriod
                                ? "Late grace period ends Monday at 11:59 PM"
                                : "Regular submission due Sunday at 11:59 PM"}
                            </p>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSubmission({
                                  url: activeMilestone.submission_url || "",
                                  notes: activeMilestone.learner_notes || "",
                                });
                              }}
                              className="w-full rounded-md border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                              Resubmit
                            </button>
                            <p className="text-[11px] text-slate-400 text-center mt-2">
                              Your submission is recorded for mentor evaluation
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 2. "Private comments" Card (Matching Image 4 with User icon) */}
                      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                          <User className="h-4 w-4 text-slate-500" />
                          <span>Mentor Feedback & Notes</span>
                        </div>

                        {/* Reviewer Feedback displayed as private comment */}
                        {activeMilestone.reviewer_feedback && (
                          <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-950">
                            <p className="font-semibold text-amber-900">Umair ul Hassan (Lead Mentor):</p>
                            <p className="mt-1 leading-relaxed">{activeMilestone.reviewer_feedback}</p>
                          </div>
                        )}

                        {/* Student private comments sent during session */}
                        {(privateComments[activeMilestone.id] || []).map((c, i) => (
                          <div key={i} className="rounded-lg bg-blue-50/70 border border-blue-200 p-3 text-xs text-blue-950">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-[#1a73e8]">{c.author} (You):</p>
                              <span className="text-[10px] text-slate-500">{c.date}</span>
                            </div>
                            <p className="mt-1 leading-relaxed">{c.text}</p>
                          </div>
                        ))}

                        <div className="pt-1 flex gap-2">
                          <input
                            value={submission.notes}
                            onChange={(e) => setSubmission((old) => ({ ...old, notes: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && submission.notes.trim()) {
                                e.preventDefault();
                                const text = submission.notes.trim();
                                setPrivateComments((prev) => ({
                                  ...prev,
                                  [activeMilestone.id]: [
                                    ...(prev[activeMilestone.id] || []),
                                    {
                                      author: data?.learner?.name || "Devatrix Test Intern",
                                      text,
                                      date: "Just now",
                                    },
                                  ],
                                }));
                                setNotice("Private comment sent to reviewer.");
                                setSubmission((prev) => ({ ...prev, notes: "" }));
                              }
                            }}
                            placeholder="Add private comment to Umair ul Hassan..."
                            className="w-full rounded border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#1a73e8]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!submission.notes.trim()) return;
                              const text = submission.notes.trim();
                              setPrivateComments((prev) => ({
                                ...prev,
                                [activeMilestone.id]: [
                                  ...(prev[activeMilestone.id] || []),
                                  {
                                    author: data?.learner?.name || "Devatrix Test Intern",
                                    text,
                                    date: "Just now",
                                  },
                                ],
                              }));
                              setNotice("Private comment sent to reviewer.");
                              setSubmission((prev) => ({ ...prev, notes: "" }));
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-white hover:bg-[#1557b0] transition shrink-0"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

              {/* =========================================================================
                  STATE D: EXPLORE PROGRAMS
                  ========================================================================= */}
              {selectedEnrollmentId === null && activeNav === "explore" && (
                <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-normal text-slate-800">Explore Internship Programs</h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Enroll in additional 6-week practical engineering programs using this learner account.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("programs")}
                      className="text-xs font-medium text-[#1a73e8] hover:underline"
                    >
                      ← Back to Programs
                    </button>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.tracks.map((track) => {
                      const isEnrolled = activeTrackSlugs.has(track.slug);
                      return (
                        <div key={track.slug} className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                          <div>
                            <span className="text-[11px] font-bold text-[#1a73e8] uppercase">{track.badge}</span>
                            <h3 className="mt-2 text-base font-semibold text-slate-900">{track.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-3">{track.summary}</p>
                          </div>
                          <div className="mt-5 border-t border-slate-100 pt-3">
                            {isEnrolled ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const match = data.enrollments.find((e) => e.track_slug === track.slug);
                                  if (match) setSelectedEnrollmentId(match.id);
                                }}
                                className="w-full rounded border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                              >
                                View Program Workspace →
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  void post("/api/portal/enroll", { trackSlug: track.slug }, `Enrolled in ${track.title}.`)
                                }
                                disabled={Boolean(busy)}
                                className="w-full rounded bg-[#1a73e8] py-2 text-xs font-semibold text-white hover:bg-[#1557b0] transition disabled:opacity-50"
                              >
                                {busy.includes("enroll") ? "Enrolling…" : "Enroll in Program"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STATE E: APPLICATIONS HISTORY
                  ========================================================================= */}
              {selectedEnrollmentId === null && activeNav === "applications" && (
                <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-normal text-slate-800">My Applications</h1>
                    <button
                      type="button"
                      onClick={() => setActiveNav("programs")}
                      className="text-xs font-medium text-[#1a73e8] hover:underline"
                    >
                      ← Back to Programs
                    </button>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm">
                    {data.applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{app.track}</p>
                          <p className="text-slate-400 mt-0.5">Applied: {fullDate(app.created_at)}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 capitalize">
                          {titleFor(app.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STATE F: INTERNSHIP SUBMISSION CALENDAR (6-WEEK SCHEDULE VIEW)
                  ========================================================================= */}
              {selectedEnrollmentId === null && activeNav === "calendar" && (
                <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <h1 className="text-xl font-normal text-slate-800">Internship Submission Calendar</h1>
                      <p className="text-xs text-slate-500 mt-1">
                        Weekly release timeline, regular Sunday deadlines, and 24-hour grace periods across your programs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("programs")}
                      className="text-xs font-medium text-[#1a73e8] hover:underline"
                    >
                      ← Back to Programs
                    </button>
                  </div>

                  {/* Submission Rhythm Policy Banner */}
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 p-5 shadow-xs">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
                      <Calendar className="h-4 w-4 text-[#1a73e8]" />
                      <span>Weekly Submission & Progression Lifecycle</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="rounded-lg bg-white p-3.5 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 font-semibold text-slate-900 mb-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[#1a73e8] text-[11px] font-bold">1</span>
                          <span>Monday 12:00 AM</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          New week unlocks automatically. Project briefs, technical rubrics, and submission channels open.
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3.5 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 font-semibold text-emerald-900 mb-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">2</span>
                          <span>Sunday 11:59 PM</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Regular on-time submission deadline. Full 100-point eligibility and reviewer evaluation.
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3.5 border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 font-semibold text-amber-900 mb-1">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">3</span>
                          <span>Monday 11:59 PM (Hard Cutoff)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          24-hour grace period ends. Submissions during this window are tagged as &quot;Late&quot;. Submissions strictly lock after Monday midnight.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6-Week Interactive Submission Timeline Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.milestones.map((m) => {
                      const sched = calculateMilestoneSchedule(m);
                      const parentEnrollment = data.enrollments.find((e) => e.id === m.enrollment_id);
                      const trackTitle = parentEnrollment ? trackFor(parentEnrollment)?.title ?? parentEnrollment.track_slug : "Track";

                      return (
                        <div
                          key={m.id}
                          className={`rounded-xl border bg-white p-5 shadow-xs transition flex flex-col justify-between ${
                            sched.isGracePeriod
                              ? "border-amber-300 ring-1 ring-amber-200"
                              : sched.isOnTime
                              ? "border-emerald-300 ring-1 ring-emerald-200"
                              : "border-slate-200"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {trackTitle}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                  sched.statusBadgeColor === "emerald"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : sched.statusBadgeColor === "amber"
                                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                                    : sched.statusBadgeColor === "blue"
                                    ? "bg-blue-50 text-[#1a73e8] border border-blue-200"
                                    : sched.statusBadgeColor === "rose"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {sched.statusLabel}
                              </span>
                            </div>

                            <h3 className="text-base font-semibold text-slate-900 leading-snug">
                              Week {m.week_number}: {m.title}
                            </h3>

                            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5 text-slate-400">
                                  <Lock className="h-3.5 w-3.5" />
                                  <span>Week Opens:</span>
                                </span>
                                <span className="font-medium text-slate-800">
                                  Mon {fullDate(sched.unlockAt)}, 12:00 AM
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5 text-emerald-600">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  <span>Regular Due:</span>
                                </span>
                                <span className="font-semibold text-emerald-800">
                                  Sun {fullDate(sched.regularDueAt)}, 11:59 PM
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1.5 text-amber-600">
                                  <CircleAlert className="h-3.5 w-3.5" />
                                  <span>Grace Cutoff:</span>
                                </span>
                                <span className="font-medium text-amber-900">
                                  Mon {fullDate(sched.graceCutoffAt)}, 11:59 PM
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 border-t border-slate-100 pt-3">
                            {parentEnrollment && !sched.isLocked ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEnrollmentId(parentEnrollment.id);
                                  setActiveMilestoneId(m.id);
                                }}
                                className="w-full rounded-lg bg-[#1a73e8] py-2 text-xs font-semibold text-white hover:bg-[#1557b0] transition shadow-xs text-center"
                              >
                                Open Milestone Brief & Submit →
                              </button>
                            ) : (
                              <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-xs font-medium text-slate-500">
                                <Lock className="h-3.5 w-3.5" />
                                <span>Unlocks on Scheduled Monday</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STATE G: TO-DO VIEW
                  ========================================================================= */}
              {selectedEnrollmentId === null && activeNav === "todo" && (
                <div className="w-full max-w-7xl 2xl:max-w-[1700px] 3xl:max-w-[2100px] mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h1 className="text-xl font-normal text-slate-800">Internship To-Do & Tasks</h1>
                      <p className="text-xs text-slate-500 mt-0.5">Overview of active, submitted, and completed milestones.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("programs")}
                      className="text-xs font-medium text-[#1a73e8] hover:underline"
                    >
                      ← Back to Programs
                    </button>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm">
                    {data.milestones.map((m) => {
                      const sched = calculateMilestoneSchedule(m);
                      const parentEnrollment = data.enrollments.find((e) => e.id === m.enrollment_id);

                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            if (parentEnrollment && !sched.isLocked) {
                              setSelectedEnrollmentId(parentEnrollment.id);
                              setActiveMilestoneId(m.id);
                            }
                          }}
                          className={`flex items-center justify-between p-4 text-xs ${
                            sched.isLocked ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {sched.isLocked ? (
                              <Lock className="h-4 w-4 text-slate-400" />
                            ) : (
                              <Clock3 className="h-4 w-4 text-[#1a73e8]" />
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">Week {m.week_number}: {m.title}</p>
                              <p className="text-slate-400">Due Sunday {fullDate(sched.regularDueAt)}, 11:59 PM</p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              sched.statusBadgeColor === "emerald"
                                ? "bg-emerald-50 text-emerald-700"
                                : sched.statusBadgeColor === "amber"
                                ? "bg-amber-50 text-amber-800"
                                : sched.statusBadgeColor === "blue"
                                ? "bg-blue-50 text-[#1a73e8]"
                                : sched.statusBadgeColor === "rose"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {sched.statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL 1: GOOGLE DRIVE / CLASSROOM STYLE PDF VIEWER MODAL
          ========================================================================= */}
      {viewingDocMilestone && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewingDocMilestone(null);
          }}
        >
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Google Drive / Classroom Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    Week_{viewingDocMilestone.week_number}_Project_Brief.pdf
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Devatrix Technologies · Official Academic Specification · 308 KB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/api/portal/documents/${selectedEnrollment?.track_slug || "web-fullstack"}/${viewingDocMilestone.week_number}`}
                  download={`Devatrix-Week-${viewingDocMilestone.week_number}-Brief.pdf`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a73e8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1557b0] transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </a>

                <a
                  href={`/api/portal/documents/${selectedEnrollment?.track_slug || "web-fullstack"}/${viewingDocMilestone.week_number}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open PDF in new window"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setViewingDocMilestone(null)}
                  title="Close viewer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* A4 Academic Specification Sheet */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 flex justify-center">
              <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-slate-200/80 p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
                {/* Document Header with Devatrix Letterhead */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#061833] p-1.5 shadow-sm">
                      <Image src="/logo-transparent.png" alt="Devatrix" width={32} height={32} priority className="object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-900">DEVATRIX TECHNOLOGIES</p>
                      <p className="text-[11px] text-slate-500">Virtual Academy · 6-Week Practical Curriculum</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      SPEC-W{viewingDocMilestone.week_number}
                    </span>
                    <p className="mt-1 text-[11px] text-slate-500">Academic Lead: Umair ul Hassan</p>
                  </div>
                </div>

                {/* Milestone Title Banner */}
                <div className="rounded-xl bg-[#061833] text-white p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {trackFor(selectedEnrollment || data?.enrollments[0] || ({} as Enrollment))?.title || "Practical Internship"}
                  </span>
                  <h2 className="text-base font-bold text-white mt-1">
                    Week {viewingDocMilestone.week_number}: {viewingDocMilestone.title}
                  </h2>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/10 pt-2">
                    <span>Due: {fullDate(viewingDocMilestone.due_at)}</span>
                    <span className="font-bold text-amber-400">Maximum Score: 100 Points</span>
                  </div>
                </div>

                {/* Section 1: Objective & Scope */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white font-mono">1</span>
                    Milestone Objective & Scope
                  </h4>
                  <p className="mt-2 text-slate-600 leading-relaxed pl-5">
                    {viewingDocMilestone.instructions}
                  </p>
                </div>

                {/* Section 2: Technical Deliverables */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white font-mono">2</span>
                    Technical Deliverables Checklist
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-slate-600 pl-5">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Modular production-grade source code with strict type safety.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Progressive Git commit history illustrating clean incremental milestones.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Documented README.md with setup guide, features, and architecture diagrams.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Working application verified on responsive mobile and desktop screen sizes.</span>
                    </li>
                  </ul>
                </div>

                {/* Section 3: 100-Point Evaluation Rubric Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white font-mono">3</span>
                    100-Point Evaluation Rubric
                  </h4>
                  <div className="mt-2 rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-semibold">Evaluation Criteria</th>
                          <th className="p-3 font-semibold">Standard Required</th>
                          <th className="p-3 font-semibold text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-medium text-slate-900">Architecture & Clean Code</td>
                          <td className="p-3 text-slate-600">Correct component boundaries, DRY logic, strict typing</td>
                          <td className="p-3 text-right font-bold text-slate-900">40 pts</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-slate-900">Functional Completeness</td>
                          <td className="p-3 text-slate-600">All required week objectives built and operating without errors</td>
                          <td className="p-3 text-right font-bold text-slate-900">40 pts</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-slate-900">Documentation & Handover</td>
                          <td className="p-3 text-slate-600">Detailed README setup, test evidence, live deployment</td>
                          <td className="p-3 text-right font-bold text-slate-900">20 pts</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 4: Submission Protocol */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-[11px] text-blue-950">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Submission Standard:</span>
                  </div>
                  <p className="mt-1 leading-relaxed text-blue-900">
                    Submit your public GitHub repository link in the Classwork tab before Sunday 11:59 PM. Reviewer evaluations and feedback are posted directly to your milestone card upon Sunday review.
                  </p>
                </div>

                {/* Footer Note */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Devatrix Technologies · Virtual Classroom</span>
                  <span>devatrix.site</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CERTIFICATE PREVIEW MODAL
          ========================================================================= */}
      {preview && activeEnrollmentForPreview && activeTrackForPreview && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(null);
          }}
        >
          <div className="mx-auto my-4 max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:my-8 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 print:hidden">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1a73e8]">Devatrix Credential Preview</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {preview.style === "premium" ? "Executive Embossed Format" : "Official Completion Format"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a73e8] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1557b0]"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Sheet */}
            <div
              className={`certificate-page relative mx-auto flex min-h-[560px] max-w-[850px] flex-col items-center justify-center overflow-hidden border-[12px] p-8 text-center sm:min-h-[600px] sm:p-14 ${
                preview.style === "premium"
                  ? "border-double border-amber-500 bg-[#fffdf7]"
                  : "border-[#061833] bg-white"
              }`}
            >
              <div
                className={`absolute inset-2 border ${
                  preview.style === "premium" ? "border-amber-200" : "border-slate-200"
                }`}
                aria-hidden="true"
              />

              <div className="relative flex items-center justify-center">
                <Image src="/logo-transparent.png" alt="Devatrix Technologies" width={56} height={56} priority />
              </div>
              <p className="relative mt-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Devatrix Technologies
              </p>

              <h3 className="relative mt-6 font-serif text-3xl font-bold tracking-tight text-[#061833] sm:text-5xl">
                Certificate of Completion
              </h3>

              <p className="relative mt-6 text-xs uppercase tracking-widest text-slate-500">This certifies that</p>
              <p className="relative mt-2 text-2xl font-black text-[#061833] sm:text-3xl">
                {data?.learner.name}
              </p>

              <p className="relative mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-700">
                has successfully completed all required milestones for the 6-week{" "}
                <strong className="font-bold text-[#061833]">{activeTrackForPreview.title}</strong> practical internship program, demonstrated proficiency in production engineering workflows, and met our technical standards.
              </p>

              <div className="relative mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-500">
                <span>Completed: {activeEnrollmentForPreview.completed_at ? fullDate(activeEnrollmentForPreview.completed_at) : "—"}</span>
                <span>•</span>
                <span>Enrollment Code: <strong className="font-mono text-slate-700">{activeEnrollmentForPreview.enrollment_code}</strong></span>
              </div>

              {/* Signatures */}
              <div className="relative mt-8 flex w-full max-w-md items-end justify-between px-4">
                <div className="border-t border-slate-300 pt-2 text-center w-36">
                  <p className="text-xs font-bold text-[#061833]">Devatrix Academy</p>
                  <p className="text-[10px] text-slate-400">Verification Board</p>
                </div>

                <div className="border-t border-slate-400 pt-2 text-center w-44">
                  <p className="text-xs font-bold text-[#061833]">{certSettings?.signatory_name || "Umair ul Hassan"}</p>
                  <p className="text-[10px] text-slate-500">{certSettings?.signatory_title || "Principal Architect & CEO"}</p>
                </div>
              </div>

              <p className="relative mt-6 font-mono text-[10px] tracking-widest text-slate-400">
                {preview.style === "premium" ? "PREMIUM EMBOSSED CREDENTIAL" : "DIGITAL COMPLETION CREDENTIAL"} •{" "}
                {activeRequestForPreview?.status === "issued"
                  ? `ISSUED ${activeRequestForPreview.issued_at ? fullDate(activeRequestForPreview.issued_at) : ""} • ${activeEnrollmentForPreview.enrollment_code}`
                  : "OFFICIAL PREVIEW • VERIFIED PRIVATE RECORD"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ACCOUNT SETTINGS MODAL (CHANGE NAME & PASSWORD)
          ========================================================================= */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm p-4 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !settingsBusy) setSettingsOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Account Settings</h3>
                  <p className="text-[11px] text-slate-500">Update your profile name and login password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                disabled={settingsBusy}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 space-y-4 text-xs">
              {settingsError && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-800 text-xs flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsSuccess && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {/* Display Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Full Name / Username
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1a73e8]"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Registered Email (Fixed)
                </label>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                  <span className="truncate">{data?.learner.email}</span>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Change Password</span>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={settingsForm.password}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="At least 8 characters"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1a73e8]"
                />
              </div>

              {/* Confirm Password */}
              {settingsForm.password && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={settingsForm.confirmPassword}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Re-enter new password"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#1a73e8]"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                disabled={settingsBusy}
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={settingsBusy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a73e8] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1557b0] transition disabled:opacity-50"
              >
                {settingsBusy && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .certificate-page,
          .certificate-page * {
            visibility: visible !important;
          }
          .certificate-page {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            min-height: 100vh !important;
            max-width: none !important;
            page-break-inside: avoid;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          @page {
            size: landscape;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
