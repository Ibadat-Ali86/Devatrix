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
        phone: formData.get("phone") as string,
        location: formData.get("location") as string,
        role: formData.get("role") as string,
        experience: formData.get("experience") as string,
        previousCompany: (formData.get("previousCompany") as string) || "",
        previousSalary: (formData.get("previousSalary") as string) || "",
        expectedSalary: (formData.get("expectedSalary") as string) || "",
        noticePeriod: (formData.get("noticePeriod") as string) || "",
        linkedinUrl: (formData.get("linkedinUrl") as string) || "",
        githubUrl: (formData.get("githubUrl") as string) || "",
        resumeUrl: (formData.get("resumeUrl") as string) || "",
        coverNote: (formData.get("coverNote") as string) || "",
      };

      const file = formData.get("resumeFile") as File | null;
      if (file && typeof file === "object" && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
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
      phone,
      location,
      role = "General / Future Openings",
      experience,
      previousCompany = "",
      previousSalary = "",
      expectedSalary = "",
      noticePeriod = "Immediate",
      linkedinUrl = "",
      githubUrl = "",
      resumeUrl = "",
      coverNote = "",
    } = data;

    // Field Validation
    if (!fullName || !email || !phone || !location) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields. Please provide your Full Name, Email, Phone/WhatsApp, and Current Location.",
        },
        { status: 400 }
      );
    }

    // Generate unique Job Application ID: DEV-JOB-2026-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `DEV-JOB-2026-${randomDigits}`;
    const timestamp = new Date().toISOString();

    const finalResume = savedResumePath || resumeUrl || "";

    const record = {
      id: applicationId,
      applicationId,
      fullName: (fullName || "").trim(),
      email: (email || "").trim().toLowerCase(),
      phone: (phone || "").trim(),
      location: (location || "").trim(),
      role: (role || "General Application").trim(),
      experience: (experience || "Not Specified").trim(),
      previousCompany: (previousCompany || "N/A").trim(),
      previousSalary: (previousSalary || "Confidential").trim(),
      expectedSalary: (expectedSalary || "Negotiable").trim(),
      noticePeriod: (noticePeriod || "Immediate").trim(),
      resumePath: finalResume,
      linkedinUrl: (linkedinUrl || "").trim(),
      githubUrl: (githubUrl || "").trim(),
      coverNote: (coverNote || "").trim(),
      status: "Review Pending",
      createdAt: timestamp,
      clientIp: req.headers.get("x-forwarded-for") || "127.0.0.1",
    };

    // 1. Save to local data/career-applications.json
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "career-applications.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existingData: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) existingData = [];
      } catch (parseErr) {
        existingData = [];
      }
    }

    existingData.unshift(record);
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`[Devatrix Careers] Saved application ${applicationId} for ${record.fullName} (${record.role})`);

    // 2. Background Google Sheets sync if webhook set
    const webhookUrl = process.env.GOOGLE_SHEET_CAREERS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch((err) => console.error("[Google Sheets Careers Sync Error]:", err));
    }

    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: "Job application successfully submitted.",
        data: {
          applicationId,
          fullName: record.fullName,
          role: record.role,
          createdAt: record.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Career application API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error processing career application. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "data", "career-applications.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ total: 0, items: [] });
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return NextResponse.json({
      total: data.length,
      recent: data.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
