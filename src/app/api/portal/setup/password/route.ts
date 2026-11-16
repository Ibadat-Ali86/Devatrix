import { NextRequest, NextResponse } from "next/server";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";
import { createPortalClient } from "@/lib/supabase/portal-server";

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  if (!isSmallJsonRequest(request, 4096)) return NextResponse.json({ error: "Choose a password with at least 12 characters." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  const body = parseObject(await request.json().catch(() => null));
  const password = body?.password;
  if (typeof password !== "string" || password.length < 12 || password.length > 256) return NextResponse.json({ error: "Choose a password with at least 12 characters." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });

  const { user, error } = await getActiveLearner();
  if (!user || error) return NextResponse.json({ error: "This setup link is invalid or has expired. Ask the Devatrix team to send a new one." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const supabase = await createPortalClient();
  if (!supabase) return NextResponse.json({ error: "Account setup is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) return NextResponse.json({ error: "We couldn’t save that password. Choose a different password and try again." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "private, no-store" } });
}
