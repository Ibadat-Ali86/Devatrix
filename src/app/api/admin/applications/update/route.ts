import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi, validApplicationKind } from "@/lib/admin/server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INTERNSHIP_STATUSES = new Set(["under_review", "in_review", "shortlisted", "rejected", "accepted", "completed"]);
const CAREER_STATUSES = new Set(["review_pending", "in_review", "shortlisted", "rejected", "hired"]);

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  if (!request.headers.get("content-type")?.includes("application/json") || Number(request.headers.get("content-length") || 0) > 12_000) return privateNoStore(NextResponse.json({ error: "Invalid update." }, { status: 400 }));

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return privateNoStore(NextResponse.json({ error: "Invalid update." }, { status: 400 }));
    const { kind, id, status, notes } = body as Record<string, unknown>;
    if (!validApplicationKind(kind) || typeof id !== "string" || !UUID.test(id)) return privateNoStore(NextResponse.json({ error: "Invalid application." }, { status: 400 }));
    const allowed = kind === "internship" ? INTERNSHIP_STATUSES : CAREER_STATUSES;
    if ((status !== undefined && (typeof status !== "string" || !allowed.has(status))) || (notes !== undefined && (typeof notes !== "string" || notes.length > 5000))) {
      return privateNoStore(NextResponse.json({ error: "Check the status and keep review notes under 5,000 characters." }, { status: 400 }));
    }
    if (status === undefined && notes === undefined) return privateNoStore(NextResponse.json({ error: "No changes provided." }, { status: 400 }));

    const db = createAdminDatabaseClient();
    if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
    const table = kind === "internship" ? "internship_applications" : "career_applications";
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.admin_review_notes = notes.trim() || null;
    if (status !== undefined) {
      update.reviewed_at = new Date().toISOString();
      update.reviewed_by = auth.user.id;
    }
    const { data, error } = await db.from(table).update(update).eq("id", id).select("id,status,admin_review_notes,reviewed_at,reviewed_by").maybeSingle();
    if (error) {
      console.error("Admin application update failed", { kind, code: error.code });
      return privateNoStore(NextResponse.json({ error: "Unable to save this application." }, { status: 503 }));
    }
    if (!data) return privateNoStore(NextResponse.json({ error: "Application not found." }, { status: 404 }));
    return privateNoStore(NextResponse.json({ application: data }));
  } catch {
    return privateNoStore(NextResponse.json({ error: "Invalid update." }, { status: 400 }));
  }
}
