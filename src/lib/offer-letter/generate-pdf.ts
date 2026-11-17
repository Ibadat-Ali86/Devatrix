import "server-only";

import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, degrees, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

export type OfferLetterPdfInput = {
  fullName: string;
  track: string;
  startDate: string;
  endDate: string;
};

type TextRun = { text: string; bold?: boolean };

const NAVY = rgb(6 / 255, 24 / 255, 51 / 255);        // #061833
const SAPPHIRE = rgb(15 / 255, 52 / 255, 107 / 255);  // #0F346B
const AMBER = rgb(245 / 255, 158 / 255, 11 / 255);    // #F59E0B
const ICE = rgb(226 / 255, 232 / 255, 240 / 255);     // #E2E8F0
const WHITE = rgb(1, 1, 1);
const BODY = rgb(51 / 255, 65 / 255, 85 / 255);       // #334155
const MUTED = rgb(100 / 255, 116 / 255, 139 / 255);   // #64748B
const RULE = rgb(148 / 255, 163 / 255, 184 / 255);    // #94A3B8
const STAMP_INK = rgb(22 / 255, 51 / 255, 107 / 255); // #16336B

function sanitizePdfText(value: string, trimEdges = true): string {
  // Standard PDF WinAnsi fonts reject unsupported unicode glyphs; normalize safely.
  const normalized = value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ");
  return trimEdges ? normalized.trim() : normalized;
}

function drawPolygon(page: PDFPage, points: Array<[number, number]>, color: RGB, opacity = 1) {
  if (points.length < 3) return;
  const height = page.getHeight();
  // drawSvgPath uses top-left SVG coordinates relative to the given (x, y) origin
  const d = points
    .map(([px, py], i) => `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${(height - py).toFixed(2)}`)
    .join(" ") + " Z";
  page.drawSvgPath(d, {
    x: 0,
    y: height,
    color,
    opacity,
  });
}

function drawRichParagraph(
  page: PDFPage,
  runs: TextRun[],
  opts: {
    x: number;
    y: number;
    maxWidth: number;
    fontSize: number;
    lineHeight: number;
    regular: PDFFont;
    bold: PDFFont;
    color: RGB;
    boldColor: RGB;
  },
): number {
  type WordToken = { text: string; bold: boolean; width: number };
  const tokens: WordToken[] = [];

  for (const run of runs) {
    const clean = sanitizePdfText(run.text, false);
    const font = run.bold ? opts.bold : opts.regular;
    const hasLeadingSpace = clean.startsWith(" ");
    if (hasLeadingSpace && tokens.length > 0 && !tokens[tokens.length - 1].text.endsWith(" ")) {
      const prevFont = tokens[tokens.length - 1].bold ? opts.bold : opts.regular;
      tokens[tokens.length - 1].text += " ";
      tokens[tokens.length - 1].width = prevFont.widthOfTextAtSize(tokens[tokens.length - 1].text, opts.fontSize);
    }
    const trimmed = clean.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(" ");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      const suffix = i < parts.length - 1 || clean.endsWith(" ") ? " " : "";
      const piece = part + suffix;
      tokens.push({
        text: piece,
        bold: Boolean(run.bold),
        width: font.widthOfTextAtSize(piece, opts.fontSize),
      });
    }
  }

  const lines: WordToken[][] = [];
  let currentLine: WordToken[] = [];
  let currentWidth = 0;

  for (const token of tokens) {
    const trimmedWidth = (token.bold ? opts.bold : opts.regular).widthOfTextAtSize(token.text.trimEnd(), opts.fontSize);
    if (currentLine.length > 0 && currentWidth + trimmedWidth > opts.maxWidth) {
      lines.push(currentLine);
      currentLine = [token];
      currentWidth = token.width;
    } else {
      currentLine.push(token);
      currentWidth += token.width;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  let cursorY = opts.y;
  for (const line of lines) {
    let cursorX = opts.x;
    for (const token of line) {
      const font = token.bold ? opts.bold : opts.regular;
      page.drawText(token.text, {
        x: cursorX,
        y: cursorY,
        size: opts.fontSize,
        font,
        color: token.bold ? opts.boldColor : opts.color,
      });
      cursorX += token.width;
    }
    cursorY -= opts.lineHeight;
  }

  return cursorY;
}

function drawArcText(
  page: PDFPage,
  text: string,
  opts: {
    cx: number;
    cy: number;
    radius: number;
    startAngleDeg: number;
    endAngleDeg: number;
    font: PDFFont;
    size: number;
    color: RGB;
    opacity: number;
    isBottom?: boolean;
  },
) {
  const chars = Array.from(text);
  if (chars.length === 0) return;
  const totalSpan = opts.endAngleDeg - opts.startAngleDeg;
  const step = chars.length > 1 ? totalSpan / (chars.length - 1) : 0;

  for (let i = 0; i < chars.length; i++) {
    const angleDeg = opts.startAngleDeg + i * step;
    const rad = (angleDeg * Math.PI) / 180;
    const ch = chars[i];
    const chW = opts.font.widthOfTextAtSize(ch, opts.size);

    // Rotation so character tangent follows circle cleanly
    const rotDeg = opts.isBottom ? angleDeg + 90 : angleDeg - 90;
    const rotRad = (rotDeg * Math.PI) / 180;

    // Position on circle shifted half char-width back along tangent
    const x = opts.cx + opts.radius * Math.cos(rad) - (chW / 2) * Math.cos(rotRad);
    const y = opts.cy + opts.radius * Math.sin(rad) - (chW / 2) * Math.sin(rotRad);

    page.drawText(ch, {
      x,
      y,
      size: opts.size,
      font: opts.font,
      color: opts.color,
      opacity: opts.opacity,
      rotate: degrees(rotDeg),
    });
  }
}

function drawCorporateStamp(page: PDFPage, cx: number, cy: number, boldFont: PDFFont) {
  const opacity = 0.82;
  const tilt = -8; // Natural hand-stamped angle

  // Concentric rings
  page.drawCircle({ x: cx, y: cy, size: 39, borderColor: STAMP_INK, borderWidth: 1.8, borderOpacity: opacity });
  page.drawCircle({ x: cx, y: cy, size: 36, borderColor: STAMP_INK, borderWidth: 0.7, borderOpacity: opacity });
  page.drawCircle({ x: cx, y: cy, size: 23.5, borderColor: STAMP_INK, borderWidth: 0.9, borderOpacity: opacity });

  // Top & Bottom circular arcs
  drawArcText(page, "DEVATRIX TECHNOLOGIES", {
    cx,
    cy,
    radius: 28,
    startAngleDeg: 162 + tilt,
    endAngleDeg: 18 + tilt,
    font: boldFont,
    size: 5.7,
    color: STAMP_INK,
    opacity,
  });

  drawArcText(page, "LAHORE - PAKISTAN", {
    cx,
    cy,
    radius: 32.5,
    startAngleDeg: 205 + tilt,
    endAngleDeg: 335 + tilt,
    font: boldFont,
    size: 5.2,
    color: STAMP_INK,
    opacity,
    isBottom: true,
  });

  // Rotated inner band lines & center text
  const rad = (tilt * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rotPt = (dx: number, dy: number): [number, number] => [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];

  const [l1x, l1y] = rotPt(-22, 7.5);
  const [l2x, l2y] = rotPt(22, 7.5);
  page.drawLine({ start: { x: l1x, y: l1y }, end: { x: l2x, y: l2y }, color: STAMP_INK, thickness: 0.8, opacity });

  const [b1x, b1y] = rotPt(-22, -7.5);
  const [b2x, b2y] = rotPt(22, -7.5);
  page.drawLine({ start: { x: b1x, y: b1y }, end: { x: b2x, y: b2y }, color: STAMP_INK, thickness: 0.8, opacity });

  const drawCenteredRotated = (label: string, dy: number, size: number) => {
    const w = boldFont.widthOfTextAtSize(label, size);
    const [tx, ty] = rotPt(-w / 2, dy);
    page.drawText(label, { x: tx, y: ty, size, font: boldFont, color: STAMP_INK, opacity, rotate: degrees(tilt) });
  };

  drawCenteredRotated("AUTHORIZED", 11.5, 4.1);
  drawCenteredRotated("DEVATRIX", -2.6, 7.2);
  drawCenteredRotated("EST. 2022", -14.8, 4.3);
}

export async function generateOfferLetterPdf(input: OfferLetterPdfInput): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Internship Offer Letter - ${sanitizePdfText(input.fullName)}`);
  pdfDoc.setAuthor("Devatrix Technologies");
  pdfDoc.setSubject("Official Internship Offer Letter");

  // Standard A4 Portrait: 595.28 x 841.89 pt
  const W = 595.28;
  const H = 841.89;
  const page = pdfDoc.addPage([W, H]);

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // 1. Top-Right Signature Devatrix Diagonal Ribbons
  const trScale = 235 / 380;
  const trPt = (sx: number, sy: number): [number, number] => [W - (380 - sx) * trScale, H - sy * trScale];
  drawPolygon(page, [trPt(84, 0), trPt(132, 0), trPt(380, 248), trPt(380, 296)], ICE, 0.72);
  drawPolygon(page, [trPt(128, 0), trPt(176, 0), trPt(380, 204), trPt(380, 252)], SAPPHIRE, 1);
  drawPolygon(page, [trPt(176, 0), trPt(182, 0), trPt(380, 198), trPt(380, 204)], WHITE, 0.95);
  drawPolygon(page, [trPt(182, 0), trPt(380, 0), trPt(380, 198)], NAVY, 1);
  drawPolygon(page, [trPt(222, 0), trPt(254, 0), trPt(380, 126), trPt(380, 158)], AMBER, 1);
  drawPolygon(page, [trPt(274, 0), trPt(288, 0), trPt(380, 92), trPt(380, 106)], SAPPHIRE, 0.8);

  // 2. Bottom-Right Matching Signature Devatrix Diagonal Ribbons
  const brPt = (sx: number, sy: number): [number, number] => [W - (380 - sx) * trScale, (380 - sy) * trScale];
  drawPolygon(page, [brPt(84, 380), brPt(132, 380), brPt(380, 132), brPt(380, 84)], ICE, 0.72);
  drawPolygon(page, [brPt(128, 380), brPt(176, 380), brPt(380, 176), brPt(380, 128)], SAPPHIRE, 1);
  drawPolygon(page, [brPt(176, 380), brPt(182, 380), brPt(380, 182), brPt(380, 176)], WHITE, 0.95);
  drawPolygon(page, [brPt(182, 380), brPt(380, 380), brPt(380, 182)], NAVY, 1);
  drawPolygon(page, [brPt(222, 380), brPt(254, 380), brPt(380, 254), brPt(380, 222)], AMBER, 1);
  drawPolygon(page, [brPt(274, 380), brPt(288, 380), brPt(380, 288), brPt(380, 274)], SAPPHIRE, 0.8);

  const marginX = 52;

  // 3. Top-Left Official Devatrix Brand Lockup: [Falcon Logo | Devatrix / TECHNOLOGIES]
  const logoPath = path.join(process.cwd(), "public", "logo-navy-transparent.png");
  let textStartX = marginX;
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImg = await pdfDoc.embedPng(logoBytes);
    const logoH = 44;
    const logoW = (logoImg.width / logoImg.height) * logoH;
    page.drawImage(logoImg, { x: marginX, y: H - 92, width: logoW, height: logoH });

    // Vertical Amber Divider Bar
    const divX = marginX + logoW + 11;
    page.drawRectangle({ x: divX, y: H - 88, width: 1.8, height: 36, color: AMBER });
    textStartX = divX + 12;
  }

  page.drawText("Devatrix", { x: textStartX, y: H - 70, size: 20, font: boldFont, color: NAVY });
  page.drawText("T E C H N O L O G I E S", { x: textStartX + 1, y: H - 83, size: 7.4, font: boldFont, color: NAVY, opacity: 0.85 });

  // 4. Clean Left-Aligned Offer Letter Title + Amber Bar
  page.drawText("Internship Offer Letter", { x: marginX, y: H - 156, size: 22.5, font: boldFont, color: NAVY });
  page.drawRectangle({ x: marginX, y: H - 168, width: 42, height: 2.6, color: AMBER });

  // 5. Concise Executive Letter Body
  const safeName = sanitizePdfText(input.fullName);
  const safeTrack = sanitizePdfText(input.track);
  const safeStart = sanitizePdfText(input.startDate);
  const safeEnd = sanitizePdfText(input.endDate);

  let y = H - 214;
  page.drawText(`Dear ${safeName},`, { x: marginX, y, size: 13.5, font: boldFont, color: NAVY });
  y -= 22;
  page.drawText("Welcome to Devatrix Technologies.", { x: marginX, y, size: 11.2, font: boldFont, color: MUTED });
  y -= 28;

  const paraOpts = {
    x: marginX,
    maxWidth: 445,
    fontSize: 11,
    lineHeight: 18.5,
    regular: regularFont,
    bold: boldFont,
    color: BODY,
    boldColor: NAVY,
  };

  y = drawRichParagraph(
    page,
    [
      { text: "Congratulations! We are pleased to formally offer you the position of " },
      { text: "Intern ", bold: true },
      { text: "and confirm your selection for the " },
      { text: `${safeTrack} Internship and Training Program `, bold: true },
      { text: "at " },
      { text: "Devatrix Technologies", bold: true },
      { text: ", effective from " },
      { text: safeStart, bold: true },
      { text: " to " },
      { text: `${safeEnd} (6 Weeks)`, bold: true },
      { text: "." },
    ],
    { ...paraOpts, y },
  );
  y -= 14;

  y = drawRichParagraph(
    page,
    [
      { text: "This " },
      { text: "Remote Internship and Training Program ", bold: true },
      { text: "is structured and mentored by Devatrix Technologies as a hands-on professional learning opportunity designed to build industry-ready engineering capability." },
    ],
    { ...paraOpts, y },
  );
  y -= 14;

  y = drawRichParagraph(
    page,
    [
      { text: "During your tenure, you will complete program orientation and focus on strengthening core technical concepts through practical, real-world project deliverables. You are expected to carry out all assigned work with professionalism, originality, and diligence in accordance with the guidance of our engineering team." },
    ],
    { ...paraOpts, y },
  );
  y -= 14;

  y = drawRichParagraph(
    page,
    [
      { text: "We look forward to a rewarding and fruitful association that equips you for impactful future projects." },
    ],
    { ...paraOpts, y },
  );

  // 6. Signature Block (Left) & Authentic Corporate Rubber Stamp (Right)
  const sigBaseY = Math.min(y - 44, 245);

  page.drawText("Sincerely,", { x: marginX, y: sigBaseY + 34, size: 11, font: boldFont, color: NAVY });

  // Embed Real Cleaned Transparent CEO Signature Positioned Down Onto Line
  const sigPath = path.join(process.cwd(), "public", "ceo-signature.png");
  if (fs.existsSync(sigPath)) {
    const sigBytes = fs.readFileSync(sigPath);
    const sigImg = await pdfDoc.embedPng(sigBytes);
    const sigH = 38;
    const sigW = (sigImg.width / sigImg.height) * sigH;
    page.drawImage(sigImg, { x: marginX - 4, y: sigBaseY - 9, width: sigW, height: sigH });
  }

  // Signature Rule + Title (Name Removed as Requested)
  page.drawLine({
    start: { x: marginX, y: sigBaseY - 2 },
    end: { x: marginX + 148, y: sigBaseY - 2 },
    color: RULE,
    thickness: 0.85,
  });
  page.drawText("Founder & CEO", { x: marginX, y: sigBaseY - 17, size: 10.5, font: boldFont, color: NAVY });
  page.drawText("Devatrix Technologies", { x: marginX, y: sigBaseY - 31, size: 9.2, font: regularFont, color: MUTED });

  // Right-Aligned Authentic Corporate Rubber Stamp (Opposite Signature, Clear of Bottom-Right Ribbons)
  drawCorporateStamp(page, marginX + 402, sigBaseY + 12, boldFont);

  // 7. Signature Devatrix Bottom-Left Amber Pill & Contact Line
  page.drawRectangle({ x: marginX, y: 66, width: 28, height: 2.3, color: AMBER });
  page.drawText("devatrixtechnologies@gmail.com  |  www.devatrix.site  |  Lahore, Pakistan", {
    x: marginX,
    y: 50,
    size: 8.3,
    font: regularFont,
    color: MUTED,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
