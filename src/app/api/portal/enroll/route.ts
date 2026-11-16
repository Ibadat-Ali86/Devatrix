import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";
import { milestonesForTrack } from "@/lib/portal/milestone-templates";

function newEnrollmentCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("");
}

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  if (!isSmallJsonRequest(request, 2048)) return NextResponse.json({ error: "Please choose a published internship." }, { status: 400 });
  const body = parseObject(await request.json().catch(() => null));
  const slug = body?.trackSlug;
  if (typeof slug !== "string" || !/^[a-z0-9-]{2,80}$/.test(slug)) return NextResponse.json({ error: "Please choose a published internship." }, { status: 400 });
  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized") return NextResponse.json({ error: "Sign in with your active learner account to enroll." }, { status: 401 });
  if (!user || !db) return NextResponse.json({ error: "Enrollment is temporarily unavailable." }, { status: 503 });

  const { data: track, error: trackError } = await db.from("site_content").select("slug").eq("slug", slug).eq("content_type", "internship_track").eq("is_published", true).maybeSingle();
  if (trackError) return NextResponse.json({ error: "Enrollment is temporarily unavailable." }, { status: 503 });
  if (!track) return NextResponse.json({ error: "This internship is not currently open for enrollment." }, { status: 404 });

  const now = new Date();
  for (let attempt = 0; attempt < 4; attempt++) {
    const inserted = await db.rpc("register_internship_enrollment", {
      p_user_id: user.id,
      p_track_slug: slug,
      p_enrollment_code: newEnrollmentCode(),
      p_started_at: now.toISOString(),
      p_expected_end_at: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString(),
      p_milestones: milestonesForTrack(slug).map(({ week, title, instructions }) => ({ week_number: week, title, instructions })),
    });
    if (!inserted.error) return NextResponse.json({ enrollment: { id: inserted.data.id, enrollment_code: inserted.data.enrollment_code } }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
    if (inserted.error.code === "23505" && inserted.error.details?.includes("(user_id, track_slug)")) {
      const existing = await db.from("internship_enrollments").select("id, enrollment_code").eq("user_id", user.id).eq("track_slug", slug).single();
      if (!existing.error) return NextResponse.json({ enrollment: existing.data, alreadyEnrolled: true }, { headers: { "Cache-Control": "private, no-store" } });
      return NextResponse.json({ error: "Your enrollment already exists. Refresh the dashboard to see it." }, { status: 409 });
    }
    if (inserted.error.code !== "23505") break;
  }
  return NextResponse.json({ error: "We couldn’t create your enrollment. Please try again." }, { status: 503 });
}
