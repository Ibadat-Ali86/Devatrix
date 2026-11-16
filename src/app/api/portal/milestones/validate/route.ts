import { NextRequest, NextResponse } from "next/server";
import { checkPublicGitHubRepository } from "@/lib/portal/github-repository";
import { getActiveLearner, hasPortalSameOrigin, isSmallJsonRequest, parseObject } from "@/lib/portal/server";

export async function POST(request: NextRequest) {
  if (!hasPortalSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  if (!isSmallJsonRequest(request, 4096)) return NextResponse.json({ error: "Please add a valid GitHub repository link." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  const body = parseObject(await request.json().catch(() => null));
  const repositoryUrl = body?.repositoryUrl;
  if (typeof repositoryUrl !== "string" || repositoryUrl.length > 2048) return NextResponse.json({ error: "Please add a valid GitHub repository link." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });

  const { user, db, error } = await getActiveLearner();
  if (error === "unauthorized") return NextResponse.json({ error: "Sign in to verify a project repository." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  if (!user || !db) return NextResponse.json({ error: "Repository verification is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });

  const check = await checkPublicGitHubRepository(repositoryUrl);
  if (check === "public") return NextResponse.json({ public: true }, { headers: { "Cache-Control": "private, no-store" } });
  if (check === "not_public") return NextResponse.json({ error: "We couldn’t confirm that repository is public. Check the link and make the GitHub repository public before submitting your work." }, { status: 422, headers: { "Cache-Control": "private, no-store" } });
  if (check === "invalid") return NextResponse.json({ error: "Use a valid https://github.com/owner/repository link." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  return NextResponse.json({ error: "GitHub couldn’t verify the repository right now. Please try again in a moment." }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
}
