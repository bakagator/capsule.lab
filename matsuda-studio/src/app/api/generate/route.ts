import { NextResponse } from "next/server";
import { generateVariants } from "@/lib/generate";
import { addDraft } from "@/lib/store";
import { ALL_PLATFORMS } from "@/lib/platforms";
import type { Draft, NewsItem, Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

// POST /api/generate — ニュース1件から下書きを生成してストアに追加
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      news: NewsItem;
      platforms?: Platform[];
    };
    if (!body?.news?.title) {
      return NextResponse.json({ error: "newsが必要です" }, { status: 400 });
    }
    const platforms =
      body.platforms && body.platforms.length > 0 ? body.platforms : ALL_PLATFORMS;

    const { variants, mock } = await generateVariants(body.news, platforms);

    const now = new Date().toISOString();
    const draft: Draft = {
      id: `draft_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: "pending",
      source: {
        title: body.news.title,
        link: body.news.link,
        source: body.news.source,
      },
      variants,
      createdAt: now,
      updatedAt: now,
      mock,
    };
    await addDraft(draft);
    return NextResponse.json({ draft });
  } catch (err) {
    return NextResponse.json(
      { error: "生成に失敗しました", detail: String(err) },
      { status: 500 }
    );
  }
}
