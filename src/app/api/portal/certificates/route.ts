import { NextRequest, NextResponse } from "next/server";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  if (!isSmallJsonRequest(request, 2048)) return NextResponse.json({ error: "Please select a certificate style." }, { status: 400 });
  const body = parseObject(await request.json().catch(() => null));
  const enrollmentId = body?.enrollmentId;
  const type = body?.certificateType;
  if (typeof enrollmentId !== "string" || !/^[0-9a-f-]{36}$/i.test(enrollmentId) || !["simple", "premium"].includes(String(type))) {
    return NextResponse.json({ error: "Please select a certificate style." }, { status: 400 });
  }
  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized") return NextResponse.json({ error: "Sign in to request a certificate." }, { status: 401 });
  if (!user || !db) return NextResponse.json({ error: "Certificate requests are temporarily unavailable." }, { status: 503 });
  const { data: enrollment, error: enrollmentError } = await db.from("internship_enrollments").select("id, status").eq("id", enrollmentId).eq("user_id", user.id).maybeSingle();
  if (enrollmentError) return NextResponse.json({ error: "Certificate requests are temporarily unavailable." }, { status: 503 });
  if (!enrollment) return NextResponse.json({ error: "We couldn’t find that enrollment." }, { status: 404 });
  const { count, error: milestoneError } = await db.from("internship_milestones").select("id", { count: "exact", head: true }).eq("enrollment_id", enrollmentId).eq("status", "completed");
  if (milestoneError) return NextResponse.json({ error: "Certificate requests are temporarily unavailable." }, { status: 503 });
  if (enrollment.status !== "completed" || count !== 6) return NextResponse.json({ error: "Complete all six milestones and receive their approval before requesting a certificate." }, { status: 409 });
  const { data: settings, error: settingsError } = await db.from("certificate_settings").select("simple_fee, premium_fee, currency").eq("singleton", true).single();
  if (settingsError) return NextResponse.json({ error: "Certificate fees have not been configured. Please contact the Devatrix team." }, { status: 409 });
  const fee = type === "simple" ? settings.simple_fee : settings.premium_fee;
  if (fee === null || !settings.currency) return NextResponse.json({ error: "Certificate fees have not been configured. Please contact the Devatrix team." }, { status: 409 });

  const { data: existing } = await db.from("certificate_requests").select("id, status").eq("enrollment_id", enrollmentId).eq("certificate_type", type).maybeSingle();
  if (existing && existing.status !== "rejected") return NextResponse.json({ error: "A request for this certificate style already exists.", status: existing.status }, { status: 409 });
  const now = new Date().toISOString();
  const saved = existing
    ? await db.from("certificate_requests").update({ status: "payment_pending", fee_amount: fee, currency: settings.currency, payment_reference: null, requested_at: now, payment_verified_at: null, payment_verified_by: null, issued_at: null, issued_by: null, updated_at: now }).eq("id", existing.id).select("id, status, certificate_type, fee_amount, currency, requested_at").single()
    : await db.from("certificate_requests").insert({ enrollment_id: enrollmentId, certificate_type: type, status: "payment_pending", fee_amount: fee, currency: settings.currency }).select("id, status, certificate_type, fee_amount, currency, requested_at").single();
  if (saved.error) return NextResponse.json({ error: "We couldn’t save your request. Please try again." }, { status: 503 });
  return NextResponse.json({ request: saved.data }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
}
