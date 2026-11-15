import type { NextRequest } from "next/server";

export function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const url = new URL(origin);
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProtocol ? `${forwardedProtocol}:` : request.nextUrl.protocol;
    return (protocol === "http:" || protocol === "https:") && url.protocol === protocol && url.host === host;
  } catch {
    return false;
  }
}
