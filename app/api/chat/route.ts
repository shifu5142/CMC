import { NextResponse } from "next/server";
import { sleep, uid } from "@/lib/utils";
import type { ApiResponse, ChatMessage } from "@/types";

export const runtime = "nodejs";

/**
 * POST /api/chat — Mock conversational endpoint.
 *
 * Real implementation later:
 *   - Stream from OpenAI / Anthropic with system prompt that knows the
 *     current review context (passed as tool input from the client).
 */
export async function POST(req: Request) {
  let payload: { messages?: ChatMessage[] } = {};
  try {
    payload = await req.json();
  } catch {
    /* allow empty body for smoke checks */
  }

  await sleep(700);

  const lastUser = [...(payload.messages ?? [])]
    .reverse()
    .find((m) => m.role === "user");

  const content = lastUser
    ? `Got it — here's how I'd approach “${lastUser.content.slice(0, 80)}”:\n\n1. Reproduce the issue in isolation.\n2. Apply the suggested fix (see issue card).\n3. Add a regression test before merging.`
    : "Ask me anything about your last review!";

  const reply: ChatMessage = {
    id: uid("msg"),
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
  };

  const res: ApiResponse<ChatMessage> = { ok: true, data: reply };
  return NextResponse.json(res);
}
