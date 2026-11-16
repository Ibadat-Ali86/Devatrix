import "server-only";

import { createClient, type User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createPortalClient } from "@/lib/supabase/portal-server";

function allowedAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string | undefined): boolean {
  return Boolean(email && allowedAdminEmails().has(email.toLowerCase()));
}

export async function getAdminUser(): Promise<User | null> {
  const supabase = await createPortalClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email_confirmed_at || !isAdminEmail(data.user.email)) return null;
  return data.user;
}

export async function requireAdminApi(): Promise<{ user: User } | { response: NextResponse }> {
  const user = await getAdminUser();
  if (!user) {
    return { response: NextResponse.json({ error: "Admin access is required." }, { status: 401, headers: { "Cache-Control": "no-store" } }) };
  }
  return { user };
}

export function createAdminDatabaseClient() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return null;
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { "X-Client-Info": "devatrix-admin-server" } },
  });
}

export function privateNoStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Vary", "Cookie");
  return response;
}

export function validApplicationKind(value: unknown): value is "internship" | "career" {
  return value === "internship" || value === "career";
}
