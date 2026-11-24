import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export type BriefPdfInput = {
  trackTitle: string;
  trackSlug: string;
  weekNumber: number;
  title: string;
  instructions: string;
  dueDate?: string;
  instructorName?: string;
};

const NAVY = rgb(6 / 255, 24 / 255, 51 / 255);        // #061833
const SAPPHIRE = rgb(15 / 255, 52 / 255, 107 / 255);  // #0F346B
const AMBER = rgb(245 / 255, 158 / 255, 11 / 255);    // #F59E0B
const SLATE = rgb(51 / 255, 65 / 255, 85 / 255);      // #334155
const MUTED = rgb(100 / 255, 116 / 255, 139 / 255);   // #64748B
const BORDER = rgb(226 / 255, 232 / 255, 240 / 255);  // #E2E8F0
const BG_LIGHT = rgb(248 / 255, 250 / 255, 252 / 255); // #F8FAFC
const WHITE = rgb(1, 1, 1);

function sanitizeText(value: string): string {
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateBriefPdf(input: BriefPdfInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 (Portrait)
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // 1. Decorative Header Bar
  page.drawRectangle({
    x: 0,
    y: height - 6,
    width,
    height: 6,
    color: AMBER,
  });

  // 2. Devatrix Falcon Logo
  const logoPath = path.join(process.cwd(), "public", "logo-transparent.png");
  if (fs.existsSync(logoPath)) {
    try {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      page.drawImage(logoImage, {
        x: 40,
        y: height - 58,
        width: 38,
        height: 38,
      });
    } catch {
      // Fallback gracefully if logo embedding fails
    }
  }

  // 3. Organization Header Text
  page.drawText("DEVATRIX TECHNOLOGIES", {
    x: 88,
    y: height - 36,
    size: 13,
    font: fontBold,
    color: NAVY,
  });

  page.drawText("Virtual Academy · 6-Week Practical Internship Program", {
    x: 88,
    y: height - 50,
    size: 9,
    font: fontRegular,
    color: MUTED,
  });

  // Top Right Reference Badge
  const refCode = `SPEC-W${input.weekNumber}-${input.trackSlug.slice(0, 4).toUpperCase()}`;
  page.drawRectangle({
    x: width - 180,
    y: height - 50,
    width: 140,
    height: 20,
    color: BG_LIGHT,
    borderColor: BORDER,
    borderWidth: 1,
  });
  page.drawText(refCode, {
    x: width - 170,
    y: height - 42,
    size: 8,
    font: fontBold,
    color: SAPPHIRE,
  });

  // Divider Line
  page.drawLine({
    start: { x: 40, y: height - 68 },
    end: { x: width - 40, y: height - 68 },
    thickness: 1,
    color: BORDER,
  });

  // 4. Hero Milestone Banner Card
  const bannerY = height - 150;
  page.drawRectangle({
    x: 40,
    y: bannerY,
    width: width - 80,
    height: 70,
    color: NAVY,
  });

  // Accent vertical stripe
  page.drawRectangle({
    x: 40,
    y: bannerY,
    width: 4,
    height: 70,
    color: AMBER,
  });

  page.drawText(sanitizeText(input.trackTitle).toUpperCase(), {
    x: 54,
    y: bannerY + 50,
    size: 8,
    font: fontBold,
    color: AMBER,
  });

  page.drawText(`Week ${input.weekNumber}: ${sanitizeText(input.title)}`, {
    x: 54,
    y: bannerY + 28,
    size: 15,
    font: fontBold,
    color: WHITE,
  });

  page.drawText(
    `Batch 2026 · Academic Lead: ${input.instructorName || "Umair ul Hassan"} · Maximum Score: 100 Points`,
    {
      x: 54,
      y: bannerY + 12,
      size: 8,
      font: fontRegular,
      color: rgb(203 / 255, 213 / 255, 225 / 255),
    }
  );

  let cursorY = bannerY - 24;

  // 5. Section 1: Objective & Scope
  page.drawText("1. MILESTONE OBJECTIVE & SCOPE", {
    x: 40,
    y: cursorY,
    size: 10,
    font: fontBold,
    color: NAVY,
  });
  cursorY -= 14;

  // Wrap instructions text cleanly
  const instructions = sanitizeText(input.instructions);
  const words = instructions.split(" ");
  let line = "";
  const maxWidth = width - 80;

  for (const word of words) {
    const testLine = line + (line ? " " : "") + word;
    const testWidth = fontRegular.widthOfTextAtSize(testLine, 9.5);
    if (testWidth > maxWidth) {
      page.drawText(line, { x: 40, y: cursorY, size: 9.5, font: fontRegular, color: SLATE });
      line = word;
      cursorY -= 14;
    } else {
      line = testLine;
    }
  }
  if (line) {
    page.drawText(line, { x: 40, y: cursorY, size: 9.5, font: fontRegular, color: SLATE });
    cursorY -= 20;
  }

  // 6. Section 2: Technical Deliverables & Production Standards
  page.drawText("2. TECHNICAL DELIVERABLES & REQUIREMENTS", {
    x: 40,
    y: cursorY,
    size: 10,
    font: fontBold,
    color: NAVY,
  });
  cursorY -= 16;

  const deliverables = [
    "Modular, production-grade source code with strict type annotations.",
    "Meaningful, progressive Git commit history (no monolithic single commits).",
    "Comprehensive README.md documenting setup, architecture decisions, and screenshots.",
    "Responsive design verified across mobile, tablet, and desktop viewports.",
    "Live deployment URL (Vercel, Netlify, or cloud provider) where applicable.",
  ];

  for (const item of deliverables) {
    page.drawCircle({
      x: 46,
      y: cursorY + 3,
      size: 2,
      color: AMBER,
    });
    page.drawText(item, {
      x: 56,
      y: cursorY,
      size: 9,
      font: fontRegular,
      color: SLATE,
    });
    cursorY -= 14;
  }

  cursorY -= 10;

  // 7. Section 3: 100-Point Assessment Rubric
  page.drawText("3. 100-POINT EVALUATION RUBRIC", {
    x: 40,
    y: cursorY,
    size: 10,
    font: fontBold,
    color: NAVY,
  });
  cursorY -= 16;

  // Rubric Table Header
  const tableY = cursorY;
  page.drawRectangle({
    x: 40,
    y: tableY - 16,
    width: width - 80,
    height: 18,
    color: BG_LIGHT,
    borderColor: BORDER,
    borderWidth: 1,
  });

  page.drawText("CRITERIA", { x: 48, y: tableY - 10, size: 8, font: fontBold, color: NAVY });
  page.drawText("EVALUATION STANDARD", { x: 180, y: tableY - 10, size: 8, font: fontBold, color: NAVY });
  page.drawText("POINTS", { x: width - 85, y: tableY - 10, size: 8, font: fontBold, color: NAVY });

  cursorY = tableY - 16;

  const rubricRows = [
    {
      criteria: "Architecture & Code Quality",
      desc: "Directory structure, clean component boundaries, strict typing, and DRY logic.",
      points: "40 pts",
    },
    {
      criteria: "Functional Completeness",
      desc: "All required milestone features work end-to-end without unhandled errors or console warnings.",
      points: "40 pts",
    },
    {
      criteria: "Documentation & Handover",
      desc: "Comprehensive README, test coverage evidence, and live deployment link.",
      points: "20 pts",
    },
  ];

  for (const row of rubricRows) {
    cursorY -= 24;
    page.drawRectangle({
      x: 40,
      y: cursorY,
      width: width - 80,
      height: 24,
      borderColor: BORDER,
      borderWidth: 1,
    });
    page.drawText(row.criteria, { x: 48, y: cursorY + 8, size: 8.5, font: fontBold, color: SLATE });
    page.drawText(row.desc, { x: 180, y: cursorY + 8, size: 8, font: fontRegular, color: MUTED });
    page.drawText(row.points, { x: width - 85, y: cursorY + 8, size: 8.5, font: fontBold, color: SAPPHIRE });
  }

  cursorY -= 20;

  // 8. Section 4: Submission Protocol
  page.drawText("4. SUBMISSION PROTOCOL & VERIFICATION", {
    x: 40,
    y: cursorY,
    size: 10,
    font: fontBold,
    color: NAVY,
  });
  cursorY -= 14;

  const protocolText =
    "Submit your public GitHub repository URL in the Devatrix Classroom Classwork tab before the deadline. Our automated pipeline verifies public accessibility, and senior reviewers assess submissions every Sunday. Approved milestones unlock verified credentials.";

  const pWords = protocolText.split(" ");
  let pLine = "";
  for (const w of pWords) {
    const tLine = pLine + (pLine ? " " : "") + w;
    if (fontRegular.widthOfTextAtSize(tLine, 8.5) > maxWidth) {
      page.drawText(pLine, { x: 40, y: cursorY, size: 8.5, font: fontRegular, color: SLATE });
      pLine = w;
      cursorY -= 12;
    } else {
      pLine = tLine;
    }
  }
  if (pLine) {
    page.drawText(pLine, { x: 40, y: cursorY, size: 8.5, font: fontRegular, color: SLATE });
    cursorY -= 20;
  }

  // 9. Official Footer with Watermark / Verification
  page.drawLine({
    start: { x: 40, y: 55 },
    end: { x: width - 40, y: 55 },
    thickness: 1,
    color: BORDER,
  });

  page.drawText("Devatrix Technologies · Authorized by Umair ul Hassan (Principal Architect & CEO)", {
    x: 40,
    y: 42,
    size: 8,
    font: fontBold,
    color: NAVY,
  });

  page.drawText("Official Academic Specification · Document Private to Enrolled Interns · devatrix.site", {
    x: 40,
    y: 30,
    size: 7.5,
    font: fontOblique,
    color: MUTED,
  });

  return await pdfDoc.save();
}
