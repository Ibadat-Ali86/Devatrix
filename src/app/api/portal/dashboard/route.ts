import { NextResponse } from "next/server";
import { getActiveLearner } from "@/lib/portal/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized") return NextResponse.json({ error: "Sign in to view your learner dashboard." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  if (!user || !db) return NextResponse.json({ error: "The learner dashboard is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const [enrollments, applications, tracks, settings] = await Promise.all([
    db.from("internship_enrollments").select("id, track_slug, enrollment_code, status, started_at, expected_end_at, completed_at, site_content!internship_enrollments_track_slug_fkey(title, summary, badge)").eq("user_id", user.id).order("created_at", { ascending: false }),
    db.from("intern_portal_access").select("internship_applications(id, full_name, track, status, created_at)").eq("user_id", user.id),
    db.from("site_content").select("slug, title, summary, badge").eq("content_type", "internship_track").eq("is_published", true).order("sort_order"),
    db.from("certificate_settings").select("simple_fee, premium_fee, currency, payment_instructions, signatory_name, signatory_title").eq("singleton", true).maybeSingle(),
  ]);
  if (enrollments.error || applications.error || tracks.error || settings.error) {
    return NextResponse.json({ error: "We couldn’t load your learner information. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const enrollmentIds = (enrollments.data ?? []).map((item) => item.id);
  const [milestones, requests] = enrollmentIds.length ? await Promise.all([
    db.from("internship_milestones").select("id, enrollment_id, week_number, title, instructions, due_at, status, submission_url, learner_notes, reviewer_feedback, submitted_at").in("enrollment_id", enrollmentIds).order("week_number"),
    db.from("certificate_requests").select("id, enrollment_id, certificate_type, status, fee_amount, currency, requested_at, issued_at").in("enrollment_id", enrollmentIds),
  ]) : [{ data: [], error: null }, { data: [], error: null }];
  if (milestones.error || requests.error) return NextResponse.json({ error: "We couldn’t load your progress. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const fullName = (applications.data ?? []).map((row) => row.internship_applications).flat().find(Boolean)?.full_name;
  return NextResponse.json({
    learner: { email: user.email, name: typeof fullName === "string" ? fullName : user.user_metadata?.full_name ?? "Learner" },
    enrollments: enrollments.data ?? [],
    milestones: milestones.data ?? [],
    certificateRequests: requests.data ?? [],
    applications: (applications.data ?? []).map((row) => row.internship_applications).flat().filter(Boolean),
    tracks: tracks.data ?? [],
    certificateSettings: settings.data ?? null,
  }, { headers: { "Cache-Control": "private, no-store, max-age=0", Vary: "Cookie" } });
}
