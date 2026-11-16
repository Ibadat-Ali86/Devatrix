import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi } from "@/lib/admin/server";
import { hasSameOrigin } from "@/lib/supabase/portal-request";
import { isFooterSettings } from "@/lib/content/footer";

export const dynamic = "force-dynamic";
const TRACK_SLUGS = new Set(["web-fullstack", "ai-agents", "data-science", "data-analytics", "ai-fde", "react-native", "flutter"]);
const PAGE_SLUGS = new Set(["home-hero", "about-hero", "services-hero", "work-hero"]);
const SERVICE_SLUGS = new Set(["service-custom-software", "service-cloud-devops", "service-ai-ml", "service-web-mobile"]);
const CASE_STUDY_SLUGS = new Set(["case-study-saas", "case-study-ai", "case-study-telemetry", "case-study-commerce"]);
const FOOTER_SLUG = "footer-details";
const CONTENT_SLUGS = new Set([...TRACK_SLUGS, ...PAGE_SLUGS, ...SERVICE_SLUGS, ...CASE_STUDY_SLUGS, "site-announcement", FOOTER_SLUG]);

export async function GET() {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const db = createAdminDatabaseClient();
  if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
  const { data, error } = await db.from("site_content").select("slug,content_type,title,summary,badge,content,is_published,sort_order,updated_at").order("sort_order");
  if (error) return privateNoStore(NextResponse.json({ error: "Unable to load CMS content." }, { status: 503 }));
  return privateNoStore(NextResponse.json({ items: data ?? [] }));
}

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) return privateNoStore(NextResponse.json({ error: "Request not allowed." }, { status: 403 }));
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  if (!request.headers.get("content-type")?.includes("application/json") || Number(request.headers.get("content-length") || 0) > 12_000) return privateNoStore(NextResponse.json({ error: "Invalid content update." }, { status: 400 }));
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return privateNoStore(NextResponse.json({ error: "Invalid content update." }, { status: 400 }));
    const { slug, title, summary, badge, isPublished, content } = body as Record<string, unknown>;
    if (typeof slug !== "string" || !CONTENT_SLUGS.has(slug) || typeof title !== "string" || title.trim().length < 2 || title.length > 140 || typeof summary !== "string" || summary.length > 1200 || typeof badge !== "string" || badge.length > 120 || typeof isPublished !== "boolean") {
      return privateNoStore(NextResponse.json({ error: "Check the title, summary, badge, and publish setting." }, { status: 400 }));
    }
    const db = createAdminDatabaseClient();
    if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
    if (slug === FOOTER_SLUG && !isFooterSettings(content)) return privateNoStore(NextResponse.json({ error: "Check the footer contact, social links, and display text." }, { status: 400 }));
    const update = { title: title.trim(), summary: summary.trim(), badge: badge.trim(), is_published: isPublished, updated_by: auth.user.id, updated_at: new Date().toISOString(), ...(slug === FOOTER_SLUG ? { content } : {}) };
    const { data, error } = await db.from("site_content").update(update).eq("slug", slug).select("slug,title,summary,badge,content,is_published,updated_at").maybeSingle();
    if (error?.code === "23505") return privateNoStore(NextResponse.json({ error: "That title is already used by another published internship track." }, { status: 409 }));
    if (error) return privateNoStore(NextResponse.json({ error: "Unable to save CMS content." }, { status: 503 }));
    if (!data) return privateNoStore(NextResponse.json({ error: "CMS item not found. Apply the admin migration first." }, { status: 404 }));
    return privateNoStore(NextResponse.json({ item: data }));
  } catch {
    return privateNoStore(NextResponse.json({ error: "Invalid content update." }, { status: 400 }));
  }
}
