import { NextResponse } from "next/server";
import { createAdminDatabaseClient } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = createAdminDatabaseClient();
  if (!db) return NextResponse.json({ available: false, tracks: [], announcement: null }, { headers: { "Cache-Control": "no-store" } });
  const { data, error } = await db.from("site_content").select("slug,content_type,title,summary,badge,is_published,sort_order").eq("is_published", true).order("sort_order");
  if (error) {
    console.error("Public CMS content unavailable", { code: error.code });
    return NextResponse.json({ available: false, tracks: [], announcement: null }, { headers: { "Cache-Control": "no-store" } });
  }
  const items = data ?? [];
  const announcement = items.find((item) => item.content_type === "announcement");
  return NextResponse.json({
    available: true,
    tracks: items.filter((item) => item.content_type === "internship_track").map((item) => ({ id: item.slug, title: item.title, summary: item.summary, badge: item.badge })),
    pages: Object.fromEntries(items.filter((item) => item.content_type === "page_copy").map((item) => [item.slug, { title: item.title, summary: item.summary, badge: item.badge }])),
    services: items.filter((item) => item.content_type === "service").map((item) => ({ id: item.slug, title: item.title, summary: item.summary, badge: item.badge })),
    caseStudies: items.filter((item) => item.content_type === "case_study").map((item) => ({ id: item.slug, title: item.title, summary: item.summary, badge: item.badge })),
    announcement: announcement ? { title: announcement.title, summary: announcement.summary } : null,
  }, { headers: { "Cache-Control": "no-store" } });
}
