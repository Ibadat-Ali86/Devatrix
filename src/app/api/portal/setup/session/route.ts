import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore } from "@/lib/admin/server";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";
import { createPortalClient } from "@/lib/supabase/portal-server";

export async function GET() {
  const { user, error } = await getActiveLearner();
  if (!user || error) return privateNoStore(NextResponse.json({ error: "This setup link is invalid or has expired. Ask the Devatrix team to send a new one." }, { status: 401 }));
  return privateNoStore(NextResponse.json({ authorized: true }));
}

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  if (!isSmallJsonRequest(request, 16_384)) return privateNoStore(NextResponse.json({ error: "This setup link is invalid. Ask the Devatrix team to send a new one." }, { status: 400 }));
  const body = parseObject(await request.json().catch(() => null));
  const email = body?.email;
  const tokenHash = body?.tokenHash;
  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof tokenHash !== "string" || tokenHash.length > 256) return privateNoStore(NextResponse.json({ error: "This setup link is invalid or has expired. Ask the Devatrix team to send a new one." }, { status: 400 }));

  const auth = await createPortalClient();
  const db = createAdminDatabaseClient();
  if (!auth || !db) return privateNoStore(NextResponse.json({ error: "Account setup is temporarily unavailable." }, { status: 503 }));
  const { data, error } = await auth.auth.verifyOtp({ email, token_hash: tokenHash, type: "magiclink" });
  if (error || !data.user?.email_confirmed_at) return privateNoStore(NextResponse.json({ error: "This setup link is invalid or has expired. Ask the Devatrix team to send a new one." }, { status: 401 }));
  const { data: access, error: accessError } = await db.from("intern_portal_access")
    .select("user_id")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (accessError || !access) {
    await auth.auth.signOut({ scope: "local" });
    return privateNoStore(NextResponse.json({ error: "Portal access is not active for this account. Contact the Devatrix team." }, { status: accessError ? 503 : 403 }));
  }
  return privateNoStore(NextResponse.json({ authorized: true }));
}
