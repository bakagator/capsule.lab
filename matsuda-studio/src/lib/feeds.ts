import Parser from "rss-parser";
import type { NewsItem } from "./types";

// 取り込むRSSフィード。ここを編集すれば自由に増やせます。
export const FEEDS: { source: string; url: string }[] = [
  { source: "NHK 主要", url: "https://www.nhk.or.jp/rss/news/cat0.xml" },
  { source: "ITmedia", url: "https://rss.itmedia.co.jp/rss/2.0/topstory.xml" },
];

const parser = new Parser({ timeout: 10000 });

function toId(link: string): string {
  // リンクから安定したIDを作る
  let hash = 0;
  for (let i = 0; i < link.length; i++) {
    hash = (hash << 5) - hash + link.charCodeAt(i);
    hash |= 0;
  }
  return `news_${Math.abs(hash)}`;
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 全フィードから記事を取得。失敗したフィードはスキップして続行。
export async function fetchNews(limitPerFeed = 8): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return (parsed.items ?? []).slice(0, limitPerFeed).map((item) => {
        const link = item.link ?? "";
        return {
          id: toId(link || (item.title ?? Math.random().toString())),
          title: (item.title ?? "(無題)").trim(),
          link,
          source: feed.source,
          summary: stripHtml(item.contentSnippet ?? item.content ?? "").slice(0, 200),
          publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        } satisfies NewsItem;
      });
    })
  );

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }
  // 新しい順
  items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return items;
}
