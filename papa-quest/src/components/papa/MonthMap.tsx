"use client";

import { useState } from "react";
import { MONTHS, type MonthStage } from "@/lib/papa/data";
import type { ProgressApi } from "@/lib/papa/useProgress";
import { BackBar, Card, PrimaryButton } from "./ui";

export default function MonthMap({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [stage, setStage] = useState<MonthStage | null>(null);
  const { missions, earned } = api.progress;

  const doneCount = (s: MonthStage) => s.missions.filter((_, i) => missions[`${s.id}-${i}`]).length;
  const isClear = (s: MonthStage) => earned[`${s.id}-clear`] !== undefined;

  function toggle(s: MonthStage, i: number) {
    const key = `${s.id}-${i}`;
    api.toggleMission(key);
    const willBeDone = doneCount(s) + (missions[key] ? -1 : 1);
    if (willBeDone === s.missions.length) api.award(`${s.id}-clear`, 30);
  }

  if (stage) {
    const count = doneCount(stage);
    return (
      <div>
        <BackBar title={`${stage.emoji} ${stage.label}（${stage.period}）`} onBack={() => setStage(null)} />
        <div className="fade-in flex flex-col gap-3">
          <Card style={{ background: "var(--wife-bg)" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "var(--wife)" }}>
              🤰 ママのようす
            </div>
            <p className="text-sm leading-relaxed">{stage.mama}</p>
          </Card>
          <Card style={{ background: "var(--papa-bg)" }}>
            <div className="text-xs font-bold mb-1" style={{ color: "var(--papa)" }}>
              🧠 パパの心の準備
            </div>
            <p className="text-sm leading-relaxed">{stage.papaMind}</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold">🎯 ミッション</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {count} / {stage.missions.length}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {stage.missions.map((m, i) => {
                const on = !!missions[`${stage.id}-${i}`];
                return (
                  <button
                    key={i}
                    onClick={() => toggle(stage, i)}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all"
                    style={{
                      background: on ? "var(--good-bg)" : "var(--surface-2)",
                      border: `1px solid ${on ? "var(--good)" : "transparent"}`,
                      cursor: "pointer",
                    }}
                  >
                    <span className="text-lg leading-none">{on ? "✅" : "⬜"}</span>
                    <span style={{ textDecoration: on ? "line-through" : "none", color: on ? "var(--text-muted)" : "var(--text)" }}>
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>
            {count === stage.missions.length && (
              <div className="pop-in text-center text-sm font-bold mt-3" style={{ color: "var(--good)" }}>
                🏅 ステージクリア！
              </div>
            )}
          </Card>
          <div className="text-center">
            <PrimaryButton onClick={() => setStage(null)}>マップへもどる</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackBar title="🗺️ パパの成長マップ" onBack={onBack} />
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        妊娠初期から1歳まで。各ステージのミッションをクリアして進もう！
      </p>
      <div className="relative">
        <div
          className="absolute top-6 bottom-6"
          style={{ left: "50%", width: 4, marginLeft: -2, background: "var(--border)", borderRadius: 2 }}
        />
        <div className="flex flex-col gap-4">
          {MONTHS.map((s, i) => {
            const clear = isClear(s);
            const left = i % 2 === 0;
            const count = doneCount(s);
            return (
              <div key={s.id} className={`relative flex ${left ? "justify-start" : "justify-end"}`}>
                <button
                  onClick={() => setStage(s)}
                  className="relative w-[46%] rounded-2xl p-3 text-left transition-transform active:scale-95"
                  style={{
                    background: clear ? "var(--good-bg)" : "var(--surface)",
                    border: `2px solid ${clear ? "var(--good)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <div className="text-sm font-bold">{s.label}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {s.period}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: clear ? "var(--good)" : "var(--text-muted)" }}>
                    {clear ? "🏅 クリア" : `ミッション ${count}/${s.missions.length}`}
                  </div>
                </button>
                <div
                  className="absolute top-1/2 rounded-full"
                  style={{
                    left: "50%",
                    width: 16,
                    height: 16,
                    marginLeft: -8,
                    marginTop: -8,
                    background: clear ? "var(--good)" : "var(--surface)",
                    border: `3px solid ${clear ? "var(--good)" : "var(--papa)"}`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
