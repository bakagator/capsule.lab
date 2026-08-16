import { NextResponse } from "next/server";
import { getDraft, updateDraft } from "@/lib/store";
import { publishDraft } from "@/lib/publish";

export const dynamic = "force-dynamic";

// POST /api/publish — 承認済み下書きを各プラットフォームへ投稿（試行）
export async function POST(req: Request) {
  const { id } = (await req.json()) as { id: string };
  const draft = await getDraft(id);
  if (!draft) {
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  }
  if (draft.status !== "approved") {
    return NextResponse.json(
      { error: "承認済みの下書きのみ投稿できます" },
      { status: 400 }
    );
  }

  const results = await publishDraft(draft);
  const anyOk = Object.values(results).some((r) => r.ok);

  const updated = await updateDraft(id, {
    publishResults: results,
    status: anyOk ? "published" : draft.status,
  });

  return NextResponse.json({ draft: updated, results });
}
