import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_NOTE_LENGTH = 120;

const sanitizeNote = (value: unknown): string | null | undefined => {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (cleaned.length > MAX_NOTE_LENGTH) return undefined;
  return cleaned || null;
};

/**
 * Persists an internee's completion letter request after all 6 curriculum milestones
 * are completed and approved. Maps cleanly onto `certificate_requests` with status
 * `requested` and no fee requirement so existing database constraints remain intact.
 */
export async function handleCompletionLetterRequest(request: NextRequest): Promise<NextResponse> {
  if (!hasPortalSameOrigin(request)) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }
  if (!isSmallJsonRequest(request, 2048)) {
    return NextResponse.json({ error: "Please check your completion letter request and try again." }, { status: 400 });
  }

  const body = parseObject(await request.json().catch(() => null));
  const enrollmentId = body?.enrollmentId;
  const note = sanitizeNote(body?.note);

  if (typeof enrollmentId !== "string" || !UUID_PATTERN.test(enrollmentId)) {
    return NextResponse.json({ error: "Choose a valid internship enrollment." }, { status: 400 });
  }
  if (note === undefined) {
    return NextResponse.json({ error: `Request note must be ${MAX_NOTE_LENGTH} characters or fewer.` }, { status: 400 });
  }

  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized") {
    return NextResponse.json({ error: "Sign in to request your completion letter." }, { status: 401 });
  }
  if (!user || !db) {
    return NextResponse.json({ error: "Completion letter requests are temporarily unavailable." }, { status: 503 });
  }

  const { data: enrollment, error: enrollmentError } = await db
    .from("internship_enrollments")
    .select("id, status")
    .eq("id", enrollmentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (enrollmentError) {
    return NextResponse.json({ error: "Completion letter requests are temporarily unavailable." }, { status: 503 });
  }
  if (!enrollment) {
    return NextResponse.json({ error: "We couldn’t find that enrollment." }, { status: 404 });
  }

  const { count, error: milestoneError } = await db
    .from("internship_milestones")
    .select("id", { count: "exact", head: true })
    .eq("enrollment_id", enrollmentId)
    .eq("status", "completed");

  if (milestoneError) {
    return NextResponse.json({ error: "Completion letter requests are temporarily unavailable." }, { status: 503 });
  }
  if (enrollment.status !== "completed" || count !== 6) {
    return NextResponse.json(
      { error: "Complete all six milestones and receive their approval before requesting your completion letter." },
      { status: 409 },
    );
  }

  const { data: existingRows, error: existingError } = await db
    .from("certificate_requests")
    .select("id, certificate_type, status")
    .eq("enrollment_id", enrollmentId);

  if (existingError) {
    return NextResponse.json({ error: "Completion letter requests are temporarily unavailable." }, { status: 503 });
  }

  const activeRow = (existingRows ?? []).find((row) =>
    ["requested", "payment_pending", "paid", "issued"].includes(row.status),
  );
  if (activeRow) {
    const message =
      activeRow.status === "issued"
        ? "Your completion letter has already been issued by the Devatrix admin team."
        : "Your completion letter request has already been sent and is awaiting admin review.";
    return NextResponse.json({ error: message, status: activeRow.status }, { status: 409 });
  }

  const rejectedSimple = (existingRows ?? []).find((row) => row.certificate_type === "simple" && row.status === "rejected");
  const now = new Date().toISOString();

  // WHY: Persist under `simple` + `requested` with null fees to honor existing Postgres check constraints
  // without requiring certificate pricing settings or an unapplied schema migration.
  const saved = rejectedSimple
    ? await db
        .from("certificate_requests")
        .update({
          status: "requested",
          fee_amount: null,
          currency: null,
          payment_reference: note,
          requested_at: now,
          payment_verified_at: null,
          payment_verified_by: null,
          issued_at: null,
          issued_by: null,
          updated_at: now,
        })
        .eq("id", rejectedSimple.id)
        .select("id, enrollment_id, status, payment_reference, requested_at, issued_at")
        .single()
    : await db
        .from("certificate_requests")
        .insert({
          enrollment_id: enrollmentId,
          certificate_type: "simple",
          status: "requested",
          fee_amount: null,
          currency: null,
          payment_reference: note,
        })
        .select("id, enrollment_id, status, payment_reference, requested_at, issued_at")
        .single();

  if (saved.error || !saved.data) {
    return NextResponse.json({ error: "We couldn’t save your completion letter request. Please try again." }, { status: 503 });
  }

  return NextResponse.json(
    {
      request: {
        id: saved.data.id,
        enrollment_id: saved.data.enrollment_id,
        status: saved.data.status,
        note: saved.data.payment_reference ?? null,
        requested_at: saved.data.requested_at,
        issued_at: saved.data.issued_at,
      },
    },
    { status: 201, headers: { "Cache-Control": "private, no-store" } },
  );
}
