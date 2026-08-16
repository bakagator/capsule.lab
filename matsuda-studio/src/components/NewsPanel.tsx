"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/types";

export default function NewsPanel({
  onGenerated,
}: {
  onGenerated: () => void;
}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadNews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ingest");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "取得失敗");
      setNews(data.news);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function generate(item: NewsItem) {
    setGeneratingId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ news: item }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成失敗");
      onGenerated();
    } catch (e) {
      setError(String(e));
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">① ニュースを取り込む</h2>
        <button
          onClick={loadNews}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "取得中…" : "RSSを取得"}
        </button>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {news.length === 0 && !loading && (
        <p className="text-sm text-black/50 dark:text-white/50">
          「RSSを取得」を押すと最新ニュースが並びます。
        </p>
      )}

      <ul className="space-y-2">
        {news.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-black/5 bg-white/70 p-3 dark:border-white/5 dark:bg-white/5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="mt-0.5 text-xs text-black/50 dark:text-white/40">
                {item.source}
              </p>
            </div>
            <button
              onClick={() => generate(item)}
              disabled={generatingId === item.id}
              className="shrink-0 rounded-lg border border-indigo-600 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
            >
              {generatingId === item.id ? "生成中…" : "松田文を生成"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
