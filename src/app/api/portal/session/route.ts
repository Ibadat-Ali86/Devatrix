import { NextRequest, NextResponse } from "next/server";
import { createPortalClient } from "@/lib/supabase/portal-server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json") || Number(request.headers.get("content-length") || 0) > 4096) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
    const { email, password } = body as Record<string, unknown>;
    if (typeof email !== "string" || email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || typeof password !== "string" || !password || password.length > 1024) {
      return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
    }

    const supabase = await createPortalClient();
    if (!supabase) return NextResponse.json({ error: "Sign-in is temporarily unavailable. Please try again later." }, { status: 503 });
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user || !data.user.email_confirmed_at) {
      if (data.session) await supabase.auth.signOut({ scope: "local" });
      return NextResponse.json({ error: "Unable to sign in. Please check your details or contact the Devatrix team." }, { status: 401 });
    }
    const access = await supabase.from("intern_portal_access").select("user_id").eq("user_id", data.user.id).eq("is_active", true).limit(1).maybeSingle();
    if (access.error || !access.data) {
      await supabase.auth.signOut({ scope: "local" });
      return NextResponse.json({ error: "Unable to sign in. Please check your details or contact the Devatrix team." }, { status: 401 });
    }
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Sign-in is temporarily unavailable. Please try again later." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
  const supabase = await createPortalClient();
  if (!supabase) return NextResponse.json({ error: "Sign-out is temporarily unavailable." }, { status: 503 });
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) return NextResponse.json({ error: "Unable to sign out. Please try again." }, { status: 503 });
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
