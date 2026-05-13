import { NextResponse } from "next/server";
import { mockRecentReviews, mockReview } from "@/lib/mock-data";
import { sleep, uid } from "@/lib/utils";
import type {
  ApiResponse,
  ReviewRequestPayload,
  ReviewResult,
} from "@/types";

export const runtime = "nodejs";

/**
 * GET /api/review — Return the user's recent reviews (mock).
 */
export async function GET() {
  await sleep(120);
  const body: ApiResponse<ReviewResult[]> = {
    ok: true,
    data: mockRecentReviews,
  };
  return NextResponse.json(body);
}

/**
 * POST /api/review — Pretend to run an AI code review.
 *
 * Real implementation later:
 *   - validate `code` length & language
 *   - call OpenAI (function calling) with prompt + system rules
 *   - persist result via Mongoose `Review` model
 */
export async function POST(req: Request) {
  let payload: ReviewRequestPayload;
  try {
    payload = (await req.json()) as ReviewRequestPayload;
  } catch {
    const fail: ApiResponse<never> = { ok: false, error: "Invalid JSON body" };
    return NextResponse.json(fail, { status: 400 });
  }

  if (!payload?.code || typeof payload.code !== "string") {
    const fail: ApiResponse<never> = { ok: false, error: "`code` is required" };
    return NextResponse.json(fail, { status: 400 });
  }
  if (payload.code.length > 20_000) {
    const fail: ApiResponse<never> = {
      ok: false,
      error: "Code is too long (max 20,000 chars).",
    };
    return NextResponse.json(fail, { status: 413 });
  }

  await sleep(900);

  const result: ReviewResult = {
    ...mockReview,
    id: uid("rev"),
    language: payload.language || "typescript",
    filename: payload.filename,
    createdAt: new Date().toISOString(),
  };

  const body: ApiResponse<ReviewResult> = { ok: true, data: result };
  return NextResponse.json(body);
}
