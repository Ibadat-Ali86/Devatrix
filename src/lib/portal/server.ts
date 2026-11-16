import "server-only";

import type { NextRequest } from "next/server";
import { createPortalClient } from "@/lib/supabase/portal-server";
import { createAdminDatabaseClient } from "@/lib/admin/server";

export async function getActiveLearner() {
  const auth = await createPortalClient();
  if (!auth) return { user: null, db: null, error: "unavailable" as const };
  const { data, error } = await auth.auth.getUser();
  if (error || !data.user?.email_confirmed_at) return { user: null, db: null, error: "unauthorized" as const };
  const db = createAdminDatabaseClient();
  if (!db) return { user: null, db: null, error: "unavailable" as const };
  const { data: access, error: accessError } = await db
    .from("intern_portal_access")
    .select("application_id")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (accessError) return { user: null, db: null, error: "unavailable" as const };
  if (!access) return { user: null, db: null, error: "unauthorized" as const };
  return { user: data.user, db, error: null };
}

export function hasPortalSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const originUrl = new URL(origin);
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProtocol ? `${forwardedProtocol}:` : request.nextUrl.protocol;
    return (protocol === "http:" || protocol === "https:") && originUrl.protocol === protocol && originUrl.host === host;
  } catch {
    return false;
  }
}

export function isSmallJsonRequest(request: NextRequest, limit = 8192): boolean {
  return Boolean(request.headers.get("content-type")?.includes("application/json"))
    && Number(request.headers.get("content-length") || 0) <= limit;
}

export function parseObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
