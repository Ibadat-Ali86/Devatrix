import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi } from "@/lib/admin/server";
import { hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const db = createAdminDatabaseClient();
  if (!db) return privateNoStore(NextResponse.json({ error: "Learner records are temporarily unavailable." }, { status: 503 }));
  const [enrollments, milestones, requests, settings] = await Promise.all([
    db.from("internship_enrollments").select("id, user_id, source_application_id, track_slug, enrollment_code, status, started_at, expected_end_at, completed_at, site_content!internship_enrollments_track_slug_fkey(title), internship_applications(full_name, email, track)").order("created_at", { ascending: false }).limit(250),
    db.from("internship_milestones").select("id, enrollment_id, week_number, title, instructions, due_at, status, submission_url, learner_notes, reviewer_feedback, submitted_at, reviewed_at").order("due_at").limit(1500),
    db.from("certificate_requests").select("id, enrollment_id, certificate_type, status, fee_amount, currency, payment_reference, requested_at, payment_verified_at, issued_at").order("requested_at", { ascending: false }).limit(500),
    db.from("certificate_settings").select("simple_fee, premium_fee, currency, payment_instructions, signatory_name, signatory_title, updated_at").eq("singleton", true).maybeSingle(),
  ]);
  if (enrollments.error || milestones.error || requests.error || settings.error) return privateNoStore(NextResponse.json({ error: "Learner records are temporarily unavailable." }, { status: 503 }));
  const userIds = Array.from(new Set((enrollments.data ?? []).map((row) => row.user_id)));
  const [access, accounts] = userIds.length ? await Promise.all([
    db.from("intern_portal_access").select("user_id, internship_applications(full_name, email, track)").in("user_id", userIds).eq("is_active", true),
    db.from("intern_accounts").select("user_id, email").in("user_id", userIds),
  ]) : [{ data: [], error: null }, { data: [], error: null }];
  if (access.error || accounts.error) return privateNoStore(NextResponse.json({ error: "Learner identity records are temporarily unavailable." }, { status: 503 }));
  const learners = new Map<string, { full_name: string; email: string; track: string }>();
  for (const row of access.data ?? []) {
    const application = Array.isArray(row.internship_applications) ? row.internship_applications[0] : row.internship_applications;
    if (application && !learners.has(row.user_id)) learners.set(row.user_id, application);
  }
  for (const account of accounts.data ?? []) {
    if (!learners.has(account.user_id)) learners.set(account.user_id, { full_name: "Learner", email: account.email, track: "" });
  }
  const learnerEnrollments = (enrollments.data ?? []).map((row) => ({ ...row, learner: learners.get(row.user_id) ?? { full_name: "Learner", email: "", track: "" } }));
  return privateNoStore(NextResponse.json({ enrollments: learnerEnrollments, milestones: milestones.data ?? [], requests: requests.data ?? [], settings: settings.data ?? null }));
}

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  if (!isSmallJsonRequest(request, 8192)) return privateNoStore(NextResponse.json({ error: "Please check the update and try again." }, { status: 400 }));
  const body = parseObject(await request.json().catch(() => null));
  if (!body || typeof body.action !== "string") return privateNoStore(NextResponse.json({ error: "Choose an update to make." }, { status: 400 }));
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const db = createAdminDatabaseClient();
  if (!db) return privateNoStore(NextResponse.json({ error: "Learner records are temporarily unavailable." }, { status: 503 }));
  const now = new Date().toISOString();

  if (body.action === "save_settings") {
    const fee = (value: unknown) => value === null || value === "" ? null : typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10000000 ? value : undefined;
    const simpleFee = fee(body.simpleFee);
    const premiumFee = fee(body.premiumFee);
    const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "";
    const instructions = typeof body.paymentInstructions === "string" ? body.paymentInstructions.trim() : "";
    const signer = typeof body.signatoryName === "string" ? body.signatoryName.trim() : "";
    const signerTitle = typeof body.signatoryTitle === "string" ? body.signatoryTitle.trim() : "";
    if (simpleFee === undefined || premiumFee === undefined || (currency && !/^[A-Z]{3}$/.test(currency)) || instructions.length > 1200 || signer.length > 120 || !signerTitle || signerTitle.length > 120 || ((simpleFee !== null || premiumFee !== null) && !currency)) {
      return privateNoStore(NextResponse.json({ error: "Enter valid fee amounts, a three-letter currency, and concise payment/signatory details." }, { status: 400 }));
    }
    const result = await db.from("certificate_settings").upsert({
      singleton: true, simple_fee: simpleFee, premium_fee: premiumFee, currency: currency || null,
      payment_instructions: instructions, signatory_name: signer, signatory_title: signerTitle,
      updated_by: auth.user.id, updated_at: now,
    }, { onConflict: "singleton" });
    if (result.error) return privateNoStore(NextResponse.json({ error: "We couldn’t save the certificate settings." }, { status: 503 }));
    return privateNoStore(NextResponse.json({ success: true }));
  }

  if (body.action === "review_milestone") {
    const id = body.milestoneId;
    const decision = body.decision;
    const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) || !["approve", "revision"].includes(String(decision)) || feedback.length > 1500) {
      return privateNoStore(NextResponse.json({ error: "Choose approval or revision and provide valid feedback." }, { status: 400 }));
    }
    const { data: milestone, error: readError } = await db.from("internship_milestones").select("id, enrollment_id, status").eq("id", id).maybeSingle();
    if (readError) return privateNoStore(NextResponse.json({ error: "The milestone could not be loaded." }, { status: 503 }));
    if (!milestone || milestone.status !== "submitted") return privateNoStore(NextResponse.json({ error: "Only submitted milestones can be reviewed." }, { status: 409 }));
    const nextStatus = decision === "approve" ? "completed" : "revision_requested";
    const update = await db.from("internship_milestones").update({ status: nextStatus, reviewer_feedback: feedback, reviewed_by: auth.user.id, reviewed_at: now, updated_at: now }).eq("id", id).eq("status", "submitted");
    if (update.error) return privateNoStore(NextResponse.json({ error: "We couldn’t save the review." }, { status: 503 }));
    if (nextStatus === "completed") {
      const { count, error: countError } = await db.from("internship_milestones").select("id", { count: "exact", head: true }).eq("enrollment_id", milestone.enrollment_id).neq("status", "completed");
      if (countError) return privateNoStore(NextResponse.json({ error: "Milestone approved, but completion could not be refreshed. Reload the record." }, { status: 503 }));
      if (count === 0) {
        const completed = await db.from("internship_enrollments").update({ status: "completed", completed_at: now, updated_at: now }).eq("id", milestone.enrollment_id);
        if (completed.error) return privateNoStore(NextResponse.json({ error: "Milestone approved, but enrollment completion could not be saved. Reload the record." }, { status: 503 }));
      }
    }
    return privateNoStore(NextResponse.json({ success: true }));
  }

  if (body.action === "set_deadline") {
    const id = body.milestoneId;
    const dueAt = body.dueAt;
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) || typeof dueAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dueAt) || !Number.isFinite(Date.parse(dueAt))) {
      return privateNoStore(NextResponse.json({ error: "Choose a valid milestone deadline." }, { status: 400 }));
    }
    const { data: milestone, error: milestoneError } = await db.from("internship_milestones").select("id, status").eq("id", id).maybeSingle();
    if (milestoneError) return privateNoStore(NextResponse.json({ error: "The milestone could not be loaded." }, { status: 503 }));
    if (!milestone || milestone.status === "completed") return privateNoStore(NextResponse.json({ error: "Completed milestone deadlines cannot be changed." }, { status: 409 }));
    const saved = await db.from("internship_milestones").update({ due_at: new Date(dueAt).toISOString(), updated_at: now }).eq("id", id);
    if (saved.error) return privateNoStore(NextResponse.json({ error: "We couldn’t save the new deadline." }, { status: 503 }));
    return privateNoStore(NextResponse.json({ success: true }));
  }

  if (body.action === "update_certificate" || body.action === "update_letter_request") {
    const id = body.requestId;
    const operation = body.operation;
    const reference = typeof body.paymentReference === "string" ? body.paymentReference.trim() : "";
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id) || !["verify_payment", "issue", "reject"].includes(String(operation)) || reference.length > 120) {
      return privateNoStore(NextResponse.json({ error: "Choose a valid request action." }, { status: 400 }));
    }
    const { data: cert, error: certError } = await db
      .from("certificate_requests")
      .select("id, enrollment_id, status, payment_verified_at, payment_verified_by")
      .eq("id", id)
      .maybeSingle();
    if (certError) return privateNoStore(NextResponse.json({ error: "The request could not be loaded." }, { status: 503 }));
    if (!cert) return privateNoStore(NextResponse.json({ error: "Completion request not found." }, { status: 404 }));
    const next = operation === "verify_payment" ? "paid" : operation === "issue" ? "issued" : "rejected";
    const allowed =
      operation === "verify_payment"
        ? cert.status === "payment_pending"
        : operation === "issue"
        ? ["requested", "paid"].includes(cert.status)
        : ["requested", "payment_pending"].includes(cert.status);
    if (!allowed) return privateNoStore(NextResponse.json({ error: "This request is not in a state for that action." }, { status: 409 }));
    if (operation === "issue" && cert.status === "paid") {
      const { data: certificateSettings, error: settingsError } = await db.from("certificate_settings").select("signatory_name").eq("singleton", true).maybeSingle();
      if (settingsError || !certificateSettings?.signatory_name?.trim()) return privateNoStore(NextResponse.json({ error: "Add the approved signatory name in certificate settings before issuing a certificate." }, { status: 409 }));
    }
    const changes: Record<string, unknown> = { status: next, updated_at: now };
    if (operation === "verify_payment") Object.assign(changes, { payment_verified_at: now, payment_verified_by: auth.user.id, payment_reference: reference || null });
    if (operation === "issue") {
      Object.assign(changes, {
        issued_at: now,
        issued_by: auth.user.id,
        // WHY: DB check constraint requires payment_verified_at whenever status is in ('paid', 'issued').
        payment_verified_at: cert.payment_verified_at ?? now,
        payment_verified_by: cert.payment_verified_by ?? auth.user.id,
      });
      if (reference) changes.payment_reference = reference;
    }
    if (operation === "reject") {
      Object.assign(changes, { payment_verified_at: null, payment_verified_by: null, issued_at: null, issued_by: null });
      if (reference) changes.payment_reference = reference;
    }
    const updated = await db.from("certificate_requests").update(changes).eq("id", id);
    if (updated.error) return privateNoStore(NextResponse.json({ error: "We couldn’t update the completion request." }, { status: 503 }));
    return privateNoStore(NextResponse.json({ success: true }));
  }

  return privateNoStore(NextResponse.json({ error: "That update is not supported." }, { status: 400 }));
}
