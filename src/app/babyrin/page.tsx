// べびりんダッシュボード(読み取り専用)。
// LINE の外からも、いまのチャレンジ継続状況とやることを一覧できる。
// サーバーコンポーネントとしてストアを直接読む。

import Link from "next/link";
import { loadState, hasPersistentStore } from "@/lib/babyrin/store";
import { cadenceLabel, isDoneToday } from "@/lib/babyrin/domain";
import { jstDateStr } from "@/lib/babyrin/time";
import type { Owner } from "@/lib/babyrin/types";

export const dynamic = "force-dynamic";

function ownerBadge(owner: Owner) {
  const map: Record<Owner, { label: string; color: string; bg: string }> = {
    妻: { label: "妻", color: "var(--wife)", bg: "var(--wife-bg)" },
    夫: { label: "夫", color: "var(--husband)", bg: "var(--husband-bg)" },
    共有: { label: "共有", color: "var(--accent)", bg: "var(--surface-2)" },
  };
  const s = map[owner];
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

export default async function BabyrinDashboard() {
  const state = await loadState();
  const today = jstDateStr();
  const challenges = state.challenges.filter((c) => c.active);
  const openTasks = state.tasks.filter((t) => !t.done);
  const configured = hasPersistentStore();

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🐣</span> べびりん
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          夫婦専用の秘書。やることと新しいチャレンジが続くように、そっとお尻を叩きます。
        </p>
      </div>

      {/* チャレンジ */}
      <section className="mb-8">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-muted)" }}>
          🔥 チャレンジ（習慣づくり）
        </h2>
        {challenges.length === 0 ? (
          <EmptyCard text="まだチャレンジはありません。LINEで「チャレンジ 毎日ストレッチ」のように送ると登録できます。" />
        ) : (
          <div className="flex flex-col gap-3">
            {challenges.map((c) => {
              const done = isDoneToday(c, today);
              return (
                <div
                  key={c.id}
                  className="rounded-2xl p-4"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {ownerBadge(c.owner)}
                      <span className="font-bold truncate">{c.title}</span>
                    </div>
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {cadenceLabel(c.cadence)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                        {c.streak}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        日連続🔥
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      最高 {c.longestStreak}日
                    </div>
                    <div className="ml-auto">
                      {done ? (
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{ color: "#2E7D5B", background: "#E4F5EC" }}
                        >
                          今日クリア✅
                        </span>
                      ) : (
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{ color: "var(--primary)", background: "var(--primary-light)" }}
                        >
                          今日まだ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* やること */}
      <section className="mb-8">
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-muted)" }}>
          📋 やること（{openTasks.length}件）
        </h2>
        {openTasks.length === 0 ? (
          <EmptyCard text="やることは今ぜんぶ片づいています。身軽〜🕊️" />
        ) : (
          <div className="flex flex-col gap-2">
            {openTasks.map((t) => (
              <div
                key={t.id}
                className="rounded-xl px-4 py-3 flex items-center gap-2"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {ownerBadge(t.owner)}
                <span className="flex-1 truncate">{t.title}</span>
                {t.due && (
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: t.due <= today ? "var(--primary)" : "var(--text-muted)" }}
                  >
                    〜{t.due}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* セットアップ状態 */}
      {!configured && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
        >
          ⚙️ 永続ストア（Upstash Redis）が未設定のため、データはサーバー再起動で消えます。
          本番運用の手順は{" "}
          <code>docs/babyrin-setup.md</code> を参照してください。
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm" style={{ color: "var(--primary)" }}>
          ← まつだ家トップへ
        </Link>
      </div>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div
      className="rounded-2xl p-5 text-sm text-center"
      style={{ background: "var(--surface)", border: "1px dashed var(--border)", color: "var(--text-muted)" }}
    >
      {text}
    </div>
  );
}
