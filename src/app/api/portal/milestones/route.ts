import { NextRequest, NextResponse } from "next/server";
import { checkPublicGitHubRepository } from "@/lib/portal/github-repository";
import { calculateMilestoneSchedule } from "@/lib/portal/milestone-schedule";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  if (!isSmallJsonRequest(request, 8192)) return NextResponse.json({ error: "Please check your submission." }, { status: 400 });
  const body = parseObject(await request.json().catch(() => null));
  const id = body?.milestoneId;
  const url = body?.submissionUrl;
  const notes = body?.notes;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) || typeof url !== "string" || url.length > 2048 || typeof notes !== "string" || notes.length > 1500) {
    return NextResponse.json({ error: "Add a valid project link and a short note." }, { status: 400 });
  }
  let parsedUrl: URL;
  try { parsedUrl = new URL(url); } catch { return NextResponse.json({ error: "Enter a valid public project link." }, { status: 400 }); }
  if (!(["https:", "http:"].includes(parsedUrl.protocol)) || parsedUrl.username || parsedUrl.password) return NextResponse.json({ error: "Enter a valid public project link." }, { status: 400 });

  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized") return NextResponse.json({ error: "Sign in to submit your work." }, { status: 401 });
  if (!user || !db) return NextResponse.json({ error: "Submission is temporarily unavailable." }, { status: 503 });
  const { data: milestone, error: readError } = await db.from("internship_milestones").select("id, status, due_at, week_number, internship_enrollments!inner(user_id, status)").eq("id", id).eq("internship_enrollments.user_id", user.id).maybeSingle();
  if (readError) return NextResponse.json({ error: "Submission is temporarily unavailable." }, { status: 503 });
  if (!milestone) return NextResponse.json({ error: "We couldn’t find that milestone." }, { status: 404 });
  if (["completed", "submitted"].includes(milestone.status)) return NextResponse.json({ error: "This milestone is already complete or awaiting review." }, { status: 409 });

  const schedule = calculateMilestoneSchedule({
    week_number: milestone.week_number,
    due_at: milestone.due_at,
    status: milestone.status,
  });

  if (schedule.isLocked) {
    return NextResponse.json({ error: "This milestone is locked and will automatically unlock on Monday at 12:00 AM." }, { status: 403 });
  }

  if (schedule.isClosed) {
    return NextResponse.json({ error: "The submission window has closed. Final cutoff was Monday at 11:59 PM." }, { status: 403 });
  }

  const repositoryCheck = await checkPublicGitHubRepository(parsedUrl.toString());
  if (repositoryCheck === "not_public") return NextResponse.json({ error: "This repository isn’t publicly available. Make the GitHub repository public and try again." }, { status: 422 });
  if (repositoryCheck === "invalid") return NextResponse.json({ error: "Use a valid https://github.com/owner/repository link." }, { status: 400 });
  if (repositoryCheck === "unavailable") return NextResponse.json({ error: "GitHub couldn’t verify the repository right now. Please try again in a moment." }, { status: 503 });

  const submissionNotes = schedule.isGracePeriod
    ? `[LATE SUBMISSION - 24h Grace Window] ${notes.trim()}`
    : notes.trim();

  const { error: updateError } = await db.from("internship_milestones").update({
    status: "submitted",
    submission_url: parsedUrl.toString(),
    learner_notes: submissionNotes,
    submitted_at: new Date().toISOString(),
    reviewer_feedback: null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (updateError) return NextResponse.json({ error: "We couldn’t save your work. Please try again." }, { status: 503 });
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "private, no-store" } });
}
