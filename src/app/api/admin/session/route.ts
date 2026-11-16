import { NextRequest, NextResponse } from "next/server";
import { createPortalClient } from "@/lib/supabase/portal-server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";
import { isAdminEmail, privateNoStore } from "@/lib/admin/server";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  if (!request.headers.get("content-type")?.includes("application/json") || Number(request.headers.get("content-length") || 0) > 4096) {
    return privateNoStore(NextResponse.json({ error: "Please check your sign-in details and try again." }, { status: 400 }));
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return privateNoStore(NextResponse.json({ error: "Please check your sign-in details and try again." }, { status: 400 }));
    const { email, password } = body as Record<string, unknown>;
    if (typeof email !== "string" || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || typeof password !== "string" || !password || password.length > 1024) {
      return privateNoStore(NextResponse.json({ error: "Please check your sign-in details and try again." }, { status: 400 }));
    }
    if (!isAdminEmail(email.trim())) return privateNoStore(NextResponse.json({ error: "Unable to sign in with those details." }, { status: 401 }));

    const supabase = await createPortalClient();
    if (!supabase) return privateNoStore(NextResponse.json({ error: "Admin sign-in is temporarily unavailable." }, { status: 503 }));
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user?.email_confirmed_at || !isAdminEmail(data.user.email)) {
      if (data.session) await supabase.auth.signOut({ scope: "local" });
      return privateNoStore(NextResponse.json({ error: "Unable to sign in with those details." }, { status: 401 }));
    }
    return privateNoStore(NextResponse.json({ success: true }));
  } catch {
    return privateNoStore(NextResponse.json({ error: "Admin sign-in is temporarily unavailable." }, { status: 503 }));
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  const supabase = await createPortalClient();
  if (!supabase) return privateNoStore(NextResponse.json({ error: "Admin sign-out is temporarily unavailable." }, { status: 503 }));
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) return privateNoStore(NextResponse.json({ error: "Unable to sign out. Please try again." }, { status: 503 }));
  return privateNoStore(NextResponse.json({ success: true }));
}
