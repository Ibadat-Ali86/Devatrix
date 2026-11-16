import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi, validApplicationKind } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const db = createAdminDatabaseClient();
  if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));

  const params = request.nextUrl.searchParams;
  const kind = params.get("kind");
  const page = Number(params.get("page") || "1");
  const status = params.get("status") || "all";
  const submittedWithin = params.get("submittedWithin") || "all";
  const windowHours = { "24h": 24, "7d": 24 * 7, "30d": 24 * 30 } as const;
  if (!validApplicationKind(kind) || !Number.isInteger(page) || page < 1 || page > 200) return privateNoStore(NextResponse.json({ error: "Invalid application query." }, { status: 400 }));
  if (submittedWithin !== "all" && !Object.hasOwn(windowHours, submittedWithin)) return privateNoStore(NextResponse.json({ error: "Choose a valid submission date range." }, { status: 400 }));
  const allowedStatuses = kind === "internship"
    ? ["under_review", "in_review", "shortlisted", "rejected", "accepted", "completed"]
    : ["review_pending", "in_review", "shortlisted", "rejected", "hired"];
  if (status !== "all" && !allowedStatuses.includes(status)) return privateNoStore(NextResponse.json({ error: "Choose a valid application status." }, { status: 400 }));
  const table = kind === "internship" ? "internship_applications" : "career_applications";
  const search = (params.get("q") || "").replace(/[^a-zA-Z0-9\s@._+-]/g, "").trim().slice(0, 80);
  const from = (page - 1) * 50;
  let query = db.from(table).select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, from + 49);
  if (status !== "all") query = query.eq("status", status);
  if (submittedWithin !== "all") {
    const hours = windowHours[submittedWithin as keyof typeof windowHours];
    query = query.gte("created_at", new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());
  }
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  const { data, error, count } = await query;
  if (error) {
    console.error("Admin application query failed", { kind, code: error.code });
    return privateNoStore(NextResponse.json({ error: "Unable to load applications." }, { status: 503 }));
  }
  return privateNoStore(NextResponse.json({ applications: data ?? [], total: count ?? 0, page, pageSize: 50 }));
}
