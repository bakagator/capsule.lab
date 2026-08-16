"use client";

import { useCallback, useEffect, useState } from "react";
import type { Draft } from "@/lib/types";
import NewsPanel from "./NewsPanel";
import DraftCard from "./DraftCard";

export default function Studio() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/drafts");
    const data = await res.json();
    setDrafts(data.drafts ?? []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pending = drafts.filter((d) => d.status === "pending");
  const others = drafts.filter((d) => d.status !== "pending");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">松田スタジオ</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          ニュースを取り込み → 松田さんらしい文章を生成 → 確認・承認 → 各SNS / note へ。
        </p>
      </header>

      <div className="space-y-6">
        <NewsPanel onGenerated={refresh} />

        <section>
          <h2 className="mb-3 text-lg font-bold">
            ② 確認・承認{" "}
            {pending.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                {pending.length}
              </span>
            )}
          </h2>

          {!loaded && (
            <p className="text-sm text-black/50 dark:text-white/50">読み込み中…</p>
          )}
          {loaded && drafts.length === 0 && (
            <p className="text-sm text-black/50 dark:text-white/50">
              まだ下書きはありません。上でニュースから生成してください。
            </p>
          )}

          <div className="space-y-4">
            {pending.map((d) => (
              <DraftCard key={d.id} draft={d} onChange={refresh} />
            ))}
          </div>

          {others.length > 0 && (
            <>
              <h3 className="mb-3 mt-6 text-sm font-semibold text-black/50 dark:text-white/50">
                処理済み
              </h3>
              <div className="space-y-4">
                {others.map((d) => (
                  <DraftCard key={d.id} draft={d} onChange={refresh} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="mt-10 text-xs text-black/40 dark:text-white/30">
        フェーズ1（承認フロー＋生成）。投稿連携（X / Threads / Instagram）とnote半自動、
        定期実行はフェーズ2以降で有効化します。
      </footer>
    </main>
  );
}
