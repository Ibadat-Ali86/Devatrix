import { NextRequest, NextResponse } from "next/server";
import { createPortalClient } from "@/lib/supabase/portal-server";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) {
    return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  }

  if (!isSmallJsonRequest(request, 4096)) {
    return NextResponse.json({ error: "Invalid settings request." }, { status: 400 });
  }

  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized" || !user) {
    return NextResponse.json({ error: "Sign in to update your account settings." }, { status: 401 });
  }
  if (!db) {
    return NextResponse.json({ error: "Settings service temporarily unavailable." }, { status: 503 });
  }

  const body = parseObject(await request.json().catch(() => null));
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name && !password) {
    return NextResponse.json({ error: "Provide a name or new password to update." }, { status: 400 });
  }

  if (name && (name.length < 2 || name.length > 100)) {
    return NextResponse.json({ error: "Name must be between 2 and 100 characters." }, { status: 400 });
  }

  if (password && (password.length < 8 || password.length > 100)) {
    return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
  }

  const auth = await createPortalClient();
  if (!auth) {
    return NextResponse.json({ error: "Authentication service unavailable." }, { status: 503 });
  }

  const updatePayload: { password?: string; data?: { full_name: string } } = {};
  if (password) updatePayload.password = password;
  if (name) updatePayload.data = { full_name: name };

  const { data: updatedAuth, error: authError } = await auth.auth.updateUser(updatePayload);
  if (authError) {
    return NextResponse.json({ error: authError.message || "Failed to update profile settings." }, { status: 400 });
  }

  if (name && user.email) {
    await db
      .from("internship_applications")
      .update({ full_name: name, updated_at: new Date().toISOString() })
      .eq("email", user.email);
  }

  return NextResponse.json({
    success: true,
    user: {
      name: updatedAuth.user?.user_metadata?.full_name || name || user.user_metadata?.full_name,
      email: user.email,
    },
  });
}
