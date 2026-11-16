import "server-only";

import { createAdminDatabaseClient } from "@/lib/admin/server";

export type SiteContentItem = {
  slug: string;
  content_type: string;
  title: string;
  summary: string;
  badge: string;
  is_published: boolean;
  sort_order: number;
};

export async function getPublishedSiteContent(): Promise<SiteContentItem[] | null> {
  const db = createAdminDatabaseClient();
  if (!db) return null;
  const { data, error } = await db.from("site_content").select("slug,content_type,title,summary,badge,is_published,sort_order").eq("is_published", true).order("sort_order");
  if (error) {
    console.error("Published site content unavailable", { code: error.code });
    return null;
  }
  return (data ?? []) as SiteContentItem[];
}
