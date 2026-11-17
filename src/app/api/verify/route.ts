import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

type VerifiedCredential = {
  id: string;
  recipient: string;
  role: string;
  track: string;
  institution: string;
  issuedOn: string;
  status: "ACTIVE_VERIFIED" | "REVOKED";
  hash: string;
  source: "supabase" | "demo";
};

const DEMO_REGISTRY: Record<string, VerifiedCredential> = {
  "DVX-ENG-2026-9041": {
    id: "DVX-ENG-2026-9041",
    recipient: "Hamza Tariq",
    role: "Senior Distributed Systems Engineer",
    track: "Tier-1 Autonomous Mesh & Kubernetes",
    institution: "FAST-NUCES Islamabad (Class of 2024)",
    issuedOn: "January 15, 2026",
    status: "ACTIVE_VERIFIED",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    source: "demo",
  },
  "DVX-VAN-2026-0128": {
    id: "DVX-VAN-2026-0128",
    recipient: "Fatima Noor",
    role: "Devatrix Vanguard Fellow",
    track: "Sovereign AI & Agent Swarm Architecture",
    institution: "NUST SEECS (Class of 2025)",
    issuedOn: "February 28, 2026",
    status: "ACTIVE_VERIFIED",
    hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    source: "demo",
  },
  "DVX-ARC-2025-4192": {
    id: "DVX-ARC-2025-4192",
    recipient: "Zubair Ahmed Khan",
    role: "Principal Solutions Architect",
    track: "Enterprise FinTech & High-Concurrency Systems",
    institution: "LUMS SSE (Class of 2021)",
    issuedOn: "November 02, 2025",
    status: "ACTIVE_VERIFIED",
    hash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    source: "demo",
  },
};

function formatDateLabel(iso: string | null | undefined): string {
  if (!iso) return "Active Cohort";
  try {
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function makeFingerprint(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export async function GET(request: NextRequest) {
  const raw = (request.nextUrl.searchParams.get("id") || "").trim();
  if (!raw || raw.length > 80) {
    return NextResponse.json({ found: false, error: "Please enter a valid credential or tracking ID." }, { status: 400 });
  }

  const normalized = raw.toUpperCase();
  const db = createAdminDatabaseClient();

  if (db) {
    try {
      // 1. Search by Enrollment Code in internship_enrollments
      const { data: enrollment } = await db
        .from("internship_enrollments")
        .select("id,enrollment_code,track_slug,status,started_at,completed_at,source_application_id")
        .ilike("enrollment_code", normalized)
        .maybeSingle();

      if (enrollment) {
        const [{ data: app }, { data: cert }, { data: trackRow }] = await Promise.all([
          enrollment.source_application_id
            ? db.from("internship_applications").select("full_name,university,track,tracking_code").eq("id", enrollment.source_application_id).maybeSingle()
            : Promise.resolve({ data: null }),
          db.from("certificate_requests").select("status,certificate_type,issued_at").eq("enrollment_id", enrollment.id).eq("status", "issued").maybeSingle(),
          db.from("site_content").select("title").eq("slug", enrollment.track_slug).maybeSingle(),
        ]);

        const trackTitle = trackRow?.title || app?.track || enrollment.track_slug;
        const recipientName = app?.full_name || "Devatrix Verified Learner";
        const issuedDate = formatDateLabel(cert?.issued_at || enrollment.completed_at || enrollment.started_at);
        const roleLabel = cert
          ? `Certified Devatrix Intern (${cert.certificate_type === "premium" ? "Honors / Premium" : "Verified"})`
          : enrollment.status === "completed"
          ? "Devatrix Internship Graduate"
          : "Active Devatrix Intern";

        const credential: VerifiedCredential = {
          id: enrollment.enrollment_code,
          recipient: recipientName,
          role: roleLabel,
          track: trackTitle,
          institution: app?.university || "Devatrix Engineering Academy",
          issuedOn: issuedDate,
          status: "ACTIVE_VERIFIED",
          hash: makeFingerprint([enrollment.id, enrollment.enrollment_code, recipientName, trackTitle]),
          source: "supabase",
        };
        return NextResponse.json({ found: true, credential }, { headers: { "Cache-Control": "no-store" } });
      }

      // 2. Search by Application Tracking Code in internship_applications (accepted / completed)
      const { data: app } = await db
        .from("internship_applications")
        .select("id,full_name,university,track,tracking_code,status,created_at")
        .ilike("tracking_code", normalized)
        .in("status", ["accepted", "completed"])
        .maybeSingle();

      if (app) {
        const credential: VerifiedCredential = {
          id: app.tracking_code || normalized,
          recipient: app.full_name,
          role: app.status === "completed" ? "Devatrix Internship Graduate" : "Verified Devatrix Intern",
          track: app.track,
          institution: app.university || "Devatrix Engineering Academy",
          issuedOn: formatDateLabel(app.created_at),
          status: "ACTIVE_VERIFIED",
          hash: makeFingerprint([app.id, app.tracking_code || "", app.full_name, app.track]),
          source: "supabase",
        };
        return NextResponse.json({ found: true, credential }, { headers: { "Cache-Control": "no-store" } });
      }
    } catch (err) {
      console.error("[Verify API] Supabase lookup error:", err);
    }
  }

  // 3. Fallback to official showcase samples if exact demo ID was requested
  if (DEMO_REGISTRY[normalized]) {
    return NextResponse.json({ found: true, credential: DEMO_REGISTRY[normalized] });
  }

  return NextResponse.json({ found: false }, { status: 404 });
}
