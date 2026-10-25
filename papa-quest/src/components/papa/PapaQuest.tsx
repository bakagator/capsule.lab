"use client";

import { useState } from "react";
import { LESSONS, MONTHS, XP_PER_LEVEL } from "@/lib/papa/data";
import { levelInfo, useProgress } from "@/lib/papa/useProgress";
import BurpGame from "./BurpGame";
import CareQuest from "./CareQuest";
import ClassQuest from "./ClassQuest";
import MilkGame from "./MilkGame";
import MonthMap from "./MonthMap";
import { Bar, Card } from "./ui";

type Screen = "hub" | "care" | "month" | "class" | "burp" | "milk";

export default function PapaQuest() {
  const api = useProgress();
  const [screen, setScreen] = useState<Screen>("hub");
  const { progress, loaded, toast } = api;
  const e = progress.earned;
  const has = (id: string) => e[id] !== undefined;

  const lessonsDone = LESSONS.filter((l) => has(`${l.id}-clear`)).length;
  const monthsDone = MONTHS.filter((m) => has(`${m.id}-clear`)).length;
  const burpDone = has("burp-clear") || has("burp-gentle");
  const milkDone = has("milk-clear") || has("milk-perfect");

  const quests: { id: Screen; emoji: string; title: string; desc: string; status: string; done: boolean; color: string }[] = [
    {
      id: "care",
      emoji: "💐",
      title: "ママへの気遣いクエスト",
      desc: "こんな時どうする？シチュエーションクイズ",
      status: has("care-clear") ? "クリア済み" : "全8問",
      done: has("care-clear"),
      color: "var(--wife)",
    },
    {
      id: "month",
      emoji: "🗺️",
      title: "パパの成長マップ",
      desc: "妊娠初期〜1歳まで、月ごとの心の準備",
      status: `${monthsDone} / ${MONTHS.length} ステージ`,
      done: monthsDone === MONTHS.length,
      color: "var(--accent)",
    },
    {
      id: "class",
      emoji: "🎓",
      title: "両親学級オンライン",
      desc: "沐浴・おむつ・抱っこ・陣痛サポートなど",
      status: `${lessonsDone} / ${LESSONS.length} 修了`,
      done: lessonsDone === LESSONS.length,
      color: "var(--papa)",
    },
    {
      id: "burp",
      emoji: "💨",
      title: "ゲップ名人チャレンジ",
      desc: "抱き方＆トントンのタイミングゲーム",
      status: burpDone ? "クリア済み" : "ミニゲーム",
      done: burpDone,
      color: "#8E7CC3",
    },
    {
      id: "milk",
      emoji: "🍼",
      title: "ミルク職人への道",
      desc: "手順ならべ＆温度調整ゲーム",
      status: milkDone ? "クリア済み" : "ミニゲーム",
      done: milkDone,
      color: "var(--good)",
    },
  ];

  const badges = [
    { emoji: "💐", name: "気遣い上手", got: has("care-clear") },
    { emoji: "🗺️", name: "準備万端", got: monthsDone >= 3 },
    { emoji: "🎓", name: "学級修了", got: lessonsDone === LESSONS.length },
    { emoji: "💨", name: "ゲップ名人", got: burpDone },
    { emoji: "🤲", name: "やさしい手", got: has("burp-gentle") },
    { emoji: "👨‍🍳", name: "ミルク職人", got: has("milk-perfect") },
    { emoji: "🎂", name: "1歳おめでとう", got: monthsDone === MONTHS.length },
  ];

  const info = levelInfo(progress.xp);
  const back = () => setScreen("hub");

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {toast && (
        <div className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ top: 76 }}>
          <div
            key={toast}
            className="pop-in rounded-full px-5 py-2 text-sm font-bold shadow-lg"
            style={{ background: "var(--text)", color: "#fff" }}
          >
            {toast}
          </div>
        </div>
      )}

      {!loaded ? null : screen === "hub" ? (
        <div className="fade-in">
          <Card className="mb-4" style={{ background: "linear-gradient(135deg, var(--papa-bg), var(--surface))" }}>
            <div className="flex items-center gap-4">
              <div
                className="rounded-full flex items-center justify-center text-4xl shrink-0"
                style={{ width: 68, height: 68, background: "var(--surface)", border: "3px solid var(--papa)" }}
              >
                👨‍🍼
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold" style={{ color: "var(--papa)" }}>
                  Lv.{info.level}
                </div>
                <div className="text-lg font-bold mb-1">{info.title}</div>
                <Bar value={info.into} max={XP_PER_LEVEL} />
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {info.isMax ? `MAX！ 累計 ${progress.xp} XP` : `次のレベルまで ${XP_PER_LEVEL - info.into} XP`}
                </div>
              </div>
            </div>
          </Card>

          <h2 className="text-sm font-bold mb-2">⚔️ クエスト</h2>
          <div className="flex flex-col gap-3 mb-6">
            {quests.map((q) => (
              <button
                key={q.id}
                onClick={() => setScreen(q.id)}
                className="flex items-center gap-3 rounded-2xl p-3 text-left transition-transform active:scale-[0.98]"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: `5px solid ${q.color}`,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}
              >
                <span className="text-3xl">{q.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{q.title}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {q.desc}
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    background: q.done ? "var(--good)" : "var(--surface-2)",
                    color: q.done ? "#fff" : "var(--text-muted)",
                  }}
                >
                  {q.done ? "✓ " : ""}
                  {q.status}
                </span>
              </button>
            ))}
          </div>

          <h2 className="text-sm font-bold mb-2">🏅 バッジ</h2>
          <Card className="mb-6">
            <div className="grid grid-cols-4 gap-3">
              {badges.map((b) => (
                <div key={b.name} className="text-center">
                  <div
                    className="mx-auto rounded-full flex items-center justify-center text-2xl mb-1"
                    style={{
                      width: 48,
                      height: 48,
                      background: b.got ? "var(--papa-bg)" : "var(--surface-2)",
                      filter: b.got ? "none" : "grayscale(1)",
                      opacity: b.got ? 1 : 0.4,
                    }}
                  >
                    {b.emoji}
                  </div>
                  <div className="text-[10px] leading-tight" style={{ color: b.got ? "var(--text)" : "var(--text-muted)" }}>
                    {b.got ? b.name : "？？？"}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
            ※ 内容は一般的な目安です。赤ちゃんやママの体調で気になることがあれば、産院・小児科・自治体の窓口に相談してください。
          </p>
          <div className="text-center">
            <button
              onClick={() => {
                if (confirm("進捗をリセットしますか？")) api.reset();
              }}
              className="text-xs underline"
              style={{ color: "var(--text-muted)", cursor: "pointer" }}
            >
              進捗をリセット
            </button>
          </div>
        </div>
      ) : screen === "care" ? (
        <CareQuest api={api} onBack={back} />
      ) : screen === "month" ? (
        <MonthMap api={api} onBack={back} />
      ) : screen === "class" ? (
        <ClassQuest api={api} onBack={back} />
      ) : screen === "burp" ? (
        <BurpGame api={api} onBack={back} />
      ) : (
        <MilkGame api={api} onBack={back} />
      )}
    </div>
  );
}
