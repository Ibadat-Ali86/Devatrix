import { NextRequest, NextResponse } from "next/server";
import { createAdminDatabaseClient, privateNoStore, requireAdminApi } from "@/lib/admin/server";
import { getCohortSettings } from "@/lib/offer-letter/dispatch";
import { generateOfferLetterPdf } from "@/lib/offer-letter/generate-pdf";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const db = createAdminDatabaseClient();
  if (!db) {
    return privateNoStore(NextResponse.json({ error: "Admin database is not configured." }, { status: 503 }));
  }

  const applicationId = request.nextUrl.searchParams.get("id") || "";
  if (!UUID.test(applicationId)) {
    return privateNoStore(NextResponse.json({ error: "Valid application ID is required." }, { status: 400 }));
  }

  const { data: app, error } = await db
    .from("internship_applications")
    .select("full_name,track")
    .eq("id", applicationId)
    .maybeSingle();

  if (error || !app) {
    return privateNoStore(NextResponse.json({ error: "Application not found." }, { status: error ? 503 : 404 }));
  }

  const settings = await getCohortSettings(db);
  const pdfBuffer = await generateOfferLetterPdf({
    fullName: app.full_name,
    track: app.track,
    startDate: settings.batch_start_date,
    endDate: settings.batch_end_date,
  });

  const cleanFileName = `${app.full_name.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Candidate"} - Devatrix Offer Letter.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${cleanFileName}"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
