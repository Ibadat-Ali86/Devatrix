import { NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;
  const db = createAdminDatabaseClient();
  if (!db) return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));

  const [internships, careers, internshipRecent, careerRecent] = await Promise.all([
    db.from("internship_applications").select("id", { count: "exact", head: true }),
    db.from("career_applications").select("id", { count: "exact", head: true }),
    db.from("internship_applications").select("id,full_name,email,track,tracking_code,status,created_at").order("created_at", { ascending: false }).limit(5),
    db.from("career_applications").select("id,full_name,email,role,status,created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  if (internships.error || careers.error || internshipRecent.error || careerRecent.error) {
    console.error("Admin overview query failed");
    return privateNoStore(NextResponse.json({ error: "Unable to load the admin overview." }, { status: 503 }));
  }

  return privateNoStore(NextResponse.json({
    counts: { internships: internships.count ?? 0, careers: careers.count ?? 0 },
    recent: [
      ...(internshipRecent.data ?? []).map((row) => ({ ...row, kind: "internship" as const, position: row.track })),
      ...(careerRecent.data ?? []).map((row) => ({ ...row, kind: "career" as const, position: row.role })),
    ].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 8),
  }));
}
