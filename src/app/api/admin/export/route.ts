import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi, validApplicationKind } from "@/lib/admin/server";

export const dynamic = "force-dynamic";
const MAX_EXPORT_ROWS = 10_000;

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
  const columnNames = kind === "internship"
    ? "id,tracking_code,full_name,email,whatsapp,university,track,duration,github_url,linkedin_url,portfolio_url,resume_url,statement,status,admin_review_notes,reviewed_at,created_at,updated_at".split(",")
    : "id,application_id,full_name,email,phone,location,role,experience,previous_company,previous_salary,expected_salary,notice_period,linkedin_url,github_url,resume_url,cover_note,status,admin_review_notes,reviewed_at,created_at,updated_at".split(",");
  const status = request.nextUrl.searchParams.get("status") || "all";
  const search = (request.nextUrl.searchParams.get("q") || "").replace(/[^a-zA-Z0-9\s@._+-]/g, "").trim().slice(0, 80);
  let data: Record<string, unknown>[] | null = null;
  let error: { code?: string } | null = null;
  if (kind === "internship") {
    let query = db.from("internship_applications").select("id,tracking_code,full_name,email,whatsapp,university,track,duration,github_url,linkedin_url,portfolio_url,resume_url,statement,status,admin_review_notes,reviewed_at,created_at,updated_at").order("created_at", { ascending: false });
    if (status !== "all" && /^[a-z_]{2,32}$/.test(status)) query = query.eq("status", status);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    const result = await query.limit(MAX_EXPORT_ROWS + 1);
    data = result.data as unknown as Record<string, unknown>[] | null;
    error = result.error;
  } else {
    let query = db.from("career_applications").select("id,application_id,full_name,email,phone,location,role,experience,previous_company,previous_salary,expected_salary,notice_period,linkedin_url,github_url,resume_url,cover_note,status,admin_review_notes,reviewed_at,created_at,updated_at").order("created_at", { ascending: false });
    if (status !== "all" && /^[a-z_]{2,32}$/.test(status)) query = query.eq("status", status);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    const result = await query.limit(MAX_EXPORT_ROWS + 1);
    data = result.data as unknown as Record<string, unknown>[] | null;
    error = result.error;
  }
  if (error) return privateNoStore(NextResponse.json({ error: "Unable to prepare the export." }, { status: 503 }));
  if ((data?.length ?? 0) > MAX_EXPORT_ROWS) return privateNoStore(NextResponse.json({ error: "This export exceeds 10,000 applications. Filter the list and export smaller groups." }, { status: 413 }));
  const rows = data ?? [];
  const csv = [columnNames.map(csvCell).join(","), ...rows.map((row) => columnNames.map((column) => csvCell(row[column])).join(","))].join("\r\n");
  const response = new NextResponse(`\uFEFF${csv}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="devatrix-${kind}-applications-${new Date().toISOString().slice(0, 10)}.csv"` } });
  return privateNoStore(response);
}
