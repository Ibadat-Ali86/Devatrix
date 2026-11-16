import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi, validApplicationKind } from "@/lib/admin/server";

export const dynamic = "force-dynamic";
const MAX_EXPORT_ROWS = 10_000;
const EXPORT_COLUMNS = {
  internship: [
    "id", "tracking_code", "full_name", "email", "whatsapp", "university", "track", "duration",
    "github_url", "linkedin_url", "portfolio_url", "resume_url", "statement", "status", "created_at",
    "admin_review_notes", "reviewed_at", "updated_at", "reviewed_by",
  ],
  career: [
    "id", "application_id", "full_name", "email", "phone", "location", "role", "experience",
    "previous_company", "previous_salary", "expected_salary", "notice_period", "linkedin_url", "github_url",
    "resume_url", "cover_note", "status", "created_at", "admin_review_notes", "reviewed_at", "updated_at", "reviewed_by",
  ],
} as const;
const CSV_HEADERS: Record<string, string> = {
  id: "Internal Record ID", tracking_code: "Internship Tracking ID", application_id: "Career Application ID",
  full_name: "Applicant Name", email: "Email", whatsapp: "WhatsApp", university: "University",
  track: "Internship Track", duration: "Duration", github_url: "GitHub URL", linkedin_url: "LinkedIn URL",
  portfolio_url: "Portfolio URL", resume_url: "Résumé URL", statement: "Application Statement", role: "Role Applied For",
  phone: "Phone", location: "Location", experience: "Experience", previous_company: "Previous Company",
  previous_salary: "Previous Salary", expected_salary: "Expected Salary", notice_period: "Notice Period",
  cover_note: "Cover Note", status: "Application Status", created_at: "Submitted At (UTC)",
  admin_review_notes: "Private Admin Review Notes", reviewed_at: "Last Reviewed At (UTC)",
  updated_at: "Last Updated At (UTC)", reviewed_by: "Reviewing Admin User ID",
};
const SUBMISSION_WINDOW_HOURS = { "24h": 24, "7d": 24 * 7, "30d": 24 * 30 } as const;

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[\s\u0000-\u001f]*[=+@\-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const kind = request.nextUrl.searchParams.get("kind");
  if (!validApplicationKind(kind)) return privateNoStore(NextResponse.json({ error: "Choose internships or careers." }, { status: 400 }));
  const db = createAdminDatabaseClient();
  if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
  const status = request.nextUrl.searchParams.get("status") || "all";
  const submittedWithin = request.nextUrl.searchParams.get("submittedWithin") || "all";
  const search = (request.nextUrl.searchParams.get("q") || "").replace(/[^a-zA-Z0-9\s@._+-]/g, "").trim().slice(0, 80);
  if (submittedWithin !== "all" && !Object.hasOwn(SUBMISSION_WINDOW_HOURS, submittedWithin)) return privateNoStore(NextResponse.json({ error: "Choose a valid submission date range." }, { status: 400 }));
  const allowedStatuses = kind === "internship"
    ? ["under_review", "in_review", "shortlisted", "rejected", "accepted", "completed"]
    : ["review_pending", "in_review", "shortlisted", "rejected", "hired"];
  if (status !== "all" && !allowedStatuses.includes(status)) return privateNoStore(NextResponse.json({ error: "Choose a valid application status." }, { status: 400 }));
  const columnNames = EXPORT_COLUMNS[kind];
  const cutoff = submittedWithin === "all"
    ? null
    : new Date(Date.now() - SUBMISSION_WINDOW_HOURS[submittedWithin as keyof typeof SUBMISSION_WINDOW_HOURS] * 60 * 60 * 1000).toISOString();
  let data: Record<string, unknown>[] | null = null;
  let error: { code?: string } | null = null;
  if (kind === "internship") {
    let query = db.from("internship_applications").select(columnNames.join(",")).order("created_at", { ascending: false });
    if (cutoff) query = query.gte("created_at", cutoff);
    if (status !== "all") query = query.eq("status", status);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    const result = await query.limit(MAX_EXPORT_ROWS + 1);
    data = result.data as unknown as Record<string, unknown>[] | null;
    error = result.error;
  } else {
    let query = db.from("career_applications").select(columnNames.join(",")).order("created_at", { ascending: false });
    if (cutoff) query = query.gte("created_at", cutoff);
    if (status !== "all") query = query.eq("status", status);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    const result = await query.limit(MAX_EXPORT_ROWS + 1);
    data = result.data as unknown as Record<string, unknown>[] | null;
    error = result.error;
  }
  if (error) return privateNoStore(NextResponse.json({ error: "Unable to prepare the export." }, { status: 503 }));
  if ((data?.length ?? 0) > MAX_EXPORT_ROWS) return privateNoStore(NextResponse.json({ error: "This export exceeds 10,000 applications. Filter the list and export smaller groups." }, { status: 413 }));
  const rows = data ?? [];
  const csv = [columnNames.map((column) => csvCell(CSV_HEADERS[column] ?? column)).join(","), ...rows.map((row) => columnNames.map((column) => csvCell(row[column])).join(","))].join("\r\n");
  const windowLabel = submittedWithin === "all" ? "all-time" : `last-${submittedWithin}`;
  const today = new Date().toISOString().slice(0, 10);
  const response = new NextResponse(`\uFEFF${csv}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="devatrix-${kind}-applications-${windowLabel}-${today}.csv"`, "X-Exported-Count": String(rows.length), "X-Exported-Window": submittedWithin } });
  return privateNoStore(response);
}
