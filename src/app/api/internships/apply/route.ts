import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: any = {};
    let savedResumePath = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        whatsapp: formData.get("whatsapp") as string,
        university: formData.get("university") as string,
        track: formData.get("track") as string,
        duration: (formData.get("duration") as string) || "6 Weeks (Intensive Virtual Sprint)",
        githubUrl: (formData.get("githubUrl") as string) || "",
        linkedinUrl: (formData.get("linkedinUrl") as string) || "",
        portfolioUrl: (formData.get("portfolioUrl") as string) || "",
        resumeUrl: (formData.get("resumeUrl") as string) || "",
        statement: (formData.get("statement") as string) || "",
      };

      const file = formData.get("resumeFile") as File | null;
      if (file && typeof file === "object" && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeName = `INT_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);
        savedResumePath = `/uploads/resumes/${safeName}`;
      }
    } else {
      data = await req.json();
    }

    const {
      fullName,
      email,
      whatsapp,
      university,
      track,
      duration = "6 Weeks (Intensive Virtual Sprint)",
      githubUrl = "",
      linkedinUrl = "",
      portfolioUrl = "",
      resumeUrl = "",
      statement = "",
    } = data;

    // Field Validation - GitHub and Resume are optional
    if (!fullName || !email || !whatsapp || !university || !track) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields. Please fill in your name, email, WhatsApp, university, and preferred track.",
        },
        { status: 400 }
      );
    }

    // Generate unique Candidate ID: DEV-INT-2026-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const candidateId = `DEV-INT-2026-${randomDigits}`;
    const timestamp = new Date().toISOString();

    const finalResume = savedResumePath || resumeUrl || "";

    const record = {
      id: candidateId,
      candidateId,
      fullName: (fullName || "").trim(),
      email: (email || "").trim().toLowerCase(),
      whatsapp: (whatsapp || "").trim(),
      university: (university || "").trim(),
      track: (track || "").trim(),
      duration: (duration || "6 Weeks (Intensive Virtual Sprint)").trim(),
      githubUrl: (githubUrl || "").trim(),
      linkedinUrl: (linkedinUrl || "").trim(),
      portfolioUrl: (portfolioUrl || "").trim(),
      resumePath: finalResume,
      statement: (statement || "").trim(),
      status: "Under Review",
      createdAt: timestamp,
      clientIp: req.headers.get("x-forwarded-for") || "127.0.0.1",
    };

    // 1. Persist to Local Application Database (data/internship-applications.json)
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "internship-applications.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existingData: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch (parseError) {
        existingData = [];
      }
    }

    existingData.unshift(record);
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`[Devatrix Internships] Saved application ${candidateId} for ${record.fullName}`);

    // 2. Asynchronous Background Sync to Google Sheets (if webhook configured)
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (googleSheetWebhookUrl) {
      fetch(googleSheetWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch((err) => {
        console.error(`[Google Sheets Sync Error]:`, err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        candidateId,
        message: "Application successfully submitted and registered.",
        data: {
          candidateId,
          fullName: record.fullName,
          track: record.track,
          createdAt: record.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Internship application API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while processing your application. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get("candidateId");

    const filePath = path.join(process.cwd(), "data", "internship-applications.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ total: 0, items: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data: any[] = JSON.parse(fileContent);

    if (candidateId) {
      const match = data.find((item) => item.candidateId === candidateId);
      if (match) {
        return NextResponse.json({
          found: true,
          candidate: {
            candidateId: match.candidateId,
            fullName: match.fullName,
            track: match.track,
            duration: match.duration,
            status: match.status,
            createdAt: match.createdAt,
          },
        });
      } else {
        return NextResponse.json({ found: false, error: "Candidate ID not found" }, { status: 404 });
      }
    }

    return NextResponse.json({
      total: data.length,
      recentCount: Math.min(data.length, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
