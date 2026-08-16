import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/feeds";

export const dynamic = "force-dynamic";

// GET /api/ingest — RSSから最新ニュースを取得
export async function GET() {
  try {
    const { items, errors } = await fetchNews();
    return NextResponse.json({ news: items, errors });
  } catch (err) {
    return NextResponse.json(
      { error: "ニュース取得に失敗しました", detail: String(err) },
      { status: 500 }
    );
  }
}
