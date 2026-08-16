import { NextResponse } from "next/server";
import { deleteDraft, getDraft, updateDraft } from "@/lib/store";
import type { Draft, DraftStatus, Variant } from "@/lib/types";
import { PLATFORMS } from "@/lib/platforms";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/drafts/:id — 本文の編集 / 状態変更（承認・却下）
export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await getDraft(id);
  if (!existing) {
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  }

  const body = (await req.json()) as {
    status?: DraftStatus;
    variants?: { platform: string; text: string }[];
  };

  const patch: Partial<Draft> = {};

  if (body.status) {
    patch.status = body.status;
  }

  if (body.variants) {
    // 送られてきた本文で該当プラットフォームを更新し、文字数を再計算
    const next: Variant[] = existing.variants.map((v) => {
      const edit = body.variants!.find((e) => e.platform === v.platform);
      if (!edit) return v;
      const text = edit.text;
      const charCount = [...text].length;
      return {
        ...v,
        text,
        charCount,
        overLimit: charCount > PLATFORMS[v.platform].charLimit,
      };
    });
    patch.variants = next;
  }

  const updated = await updateDraft(id, patch);
  return NextResponse.json({ draft: updated });
}

// DELETE /api/drafts/:id
export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  await deleteDraft(id);
  return NextResponse.json({ ok: true });
}
