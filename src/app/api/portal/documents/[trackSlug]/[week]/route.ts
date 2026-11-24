import { NextRequest, NextResponse } from "next/server";
import { generateBriefPdf } from "@/lib/portal/generate-brief-pdf";
import { trackMilestones } from "@/lib/portal/milestone-templates";

const TRACK_TITLES: Record<string, string> = {
  "web-fullstack": "Full-Stack Web Development",
  "frontend-fullstack": "Frontend & Full-Stack Web Engineering",
  "mobile-crossplatform": "Mobile App Development with Flutter",
  "cloud-devops": "DevOps Engineer & Cloud Infrastructure",
  "ai-engineering": "Applied AI & Agent Engineering",
  "ai-agents": "Applied AI & Agent Engineering",
  "cybersecurity": "Cybersecurity & Ethical Hacking",
  "data-science": "Data Science & Machine Learning",
  "data-analytics": "Data Analytics & Business Intelligence",
  "react-native": "Mobile App Engineering with React Native",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ trackSlug: string; week: string }> }
) {
  try {
    const { trackSlug, week } = await context.params;
    const weekNumber = parseInt(week, 10);

    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 6) {
      return new NextResponse("Invalid week number", { status: 400 });
    }

    const templates = trackMilestones[trackSlug] || trackMilestones["web-fullstack"];
    const milestone = templates.find((m) => m.week === weekNumber) || {
      week: weekNumber,
      title: `Week ${weekNumber} Practical Milestone`,
      instructions: "Implement production-ready code meeting the technical standards outlined in your Devatrix track curriculum.",
    };

    const trackTitle = TRACK_TITLES[trackSlug] || trackSlug.replaceAll("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

    const pdfBuffer = await generateBriefPdf({
      trackTitle,
      trackSlug,
      weekNumber,
      title: milestone.title,
      instructions: milestone.instructions,
      instructorName: "Umair ul Hassan",
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Devatrix-Week-${weekNumber}-Brief.pdf"`,
        "Content-Security-Policy": "frame-ancestors 'self'",
        "X-Frame-Options": "SAMEORIGIN",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return new NextResponse("Error generating PDF brief", { status: 500 });
  }
}
