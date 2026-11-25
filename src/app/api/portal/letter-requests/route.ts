import { NextRequest } from "next/server";
import { handleCompletionLetterRequest } from "@/lib/portal/letter-requests";

export async function POST(request: NextRequest) {
  return handleCompletionLetterRequest(request);
}
