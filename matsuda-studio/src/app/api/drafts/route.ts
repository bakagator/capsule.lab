import { NextResponse } from "next/server";
import { listDrafts } from "@/lib/store";

export const dynamic = "force-dynamic";

// GET /api/drafts — 下書き一覧
export async function GET() {
  const drafts = await listDrafts();
  return NextResponse.json({ drafts });
}
