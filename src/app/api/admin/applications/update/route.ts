import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi, validApplicationKind } from "@/lib/admin/server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";
import { milestonesForTrack } from "@/lib/portal/milestone-templates";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INTERNSHIP_STATUSES = new Set(["under_review", "in_review", "shortlisted", "rejected", "accepted", "completed"]);
const CAREER_STATUSES = new Set(["review_pending", "in_review", "shortlisted", "rejected", "hired"]);

function enrollmentCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("");
}

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

    if (kind === "internship" && status === "accepted") {
      const { data: application, error: applicationError } = await db.from("internship_applications").select("track, track_slug").eq("id", id).maybeSingle();
      if (applicationError || !application) return privateNoStore(NextResponse.json({ error: "Unable to load this application." }, { status: 503 }));
      let trackQuery = db.from("site_content").select("slug").eq("content_type", "internship_track").eq("is_published", true);
      trackQuery = typeof application.track_slug === "string" ? trackQuery.eq("slug", application.track_slug) : trackQuery.eq("title", application.track);
      const { data: track, error: trackError } = await trackQuery.maybeSingle();
      if (trackError || !track) return privateNoStore(NextResponse.json({ error: "This internship track is no longer published, so the application can’t be accepted." }, { status: 409 }));
      const startedAt = new Date();
      const expectedEndAt = new Date(startedAt.getTime() + 42 * 24 * 60 * 60 * 1000);
      let accepted = null;
      for (let attempt = 0; attempt < 4; attempt++) {
        const result = await db.rpc("accept_internship_application", {
          p_application_id: id,
          p_reviewer_id: auth.user.id,
          p_enrollment_code: enrollmentCode(),
          p_started_at: startedAt.toISOString(),
          p_expected_end_at: expectedEndAt.toISOString(),
          p_milestones: milestonesForTrack(track.slug).map(({ week, title, instructions }) => ({ week_number: week, title, instructions })),
          p_admin_notes: typeof notes === "string" ? notes : null,
        });
        if (!result.error) { accepted = result.data; break; }
        if (result.error.code !== "23505" || !result.error.details?.includes("enrollment_code")) {
          console.error("Admin internship acceptance failed", { code: result.error.code });
          return privateNoStore(NextResponse.json({ error: "Unable to accept this application and prepare its learner enrollment." }, { status: 503 }));
        }
      }
      if (!accepted) return privateNoStore(NextResponse.json({ error: "Unable to generate an enrollment code. Please try again." }, { status: 503 }));
      return privateNoStore(NextResponse.json({ application: { id, status: "accepted" }, enrollment: accepted }));
    }

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
