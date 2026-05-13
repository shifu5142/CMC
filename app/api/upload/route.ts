import { NextResponse } from "next/server";
import { sleep, uid } from "@/lib/utils";
import type { ApiResponse, UploadedFile } from "@/types";

export const runtime = "nodejs";

/**
 * POST /api/upload — Mock UploadThing handler.
 *
 * Real implementation later:
 *   - Use `createUploadthing` from `uploadthing/next`
 *   - Validate file size & MIME, auth via Clerk
 */
export async function POST(req: Request) {
  let body: { name?: string; size?: number; type?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* tolerate empty body for the mock */
  }

  await sleep(450);

  const file: UploadedFile = {
    id: uid("up"),
    name: body.name ?? "untitled.ts",
    url: `https://utfs.io/f/${uid("file")}.ts`,
    size: body.size ?? 8000,
    type: body.type ?? "text/typescript",
    uploadedAt: new Date().toISOString(),
  };

  const res: ApiResponse<UploadedFile> = { ok: true, data: file };
  return NextResponse.json(res);
}

export async function GET() {
  const res: ApiResponse<{ ready: boolean }> = {
    ok: true,
    data: { ready: true },
  };
  return NextResponse.json(res);
}
