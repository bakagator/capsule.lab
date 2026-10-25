"use client";

import { useState } from "react";
import { MONTHS, type MonthStage } from "@/lib/papa/data";
import { play } from "@/lib/papa/sfx";
import type { ProgressApi } from "@/lib/papa/useProgress";
import { Btn, Message, TopBar, Win } from "./ui";

export default function MonthMap({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [stage, setStage] = useState<MonthStage | null>(null);
  const { missions, earned } = api.progress;
  const hero = api.progress.name || "パパ";

  const doneCount = (s: MonthStage) => s.missions.filter((_, i) => missions[`${s.id}-${i}`]).length;
  const isClear = (s: MonthStage) => earned[`${s.id}-clear`] !== undefined;
  const current = MONTHS.findIndex((s) => !isClear(s));

  function toggle(s: MonthStage, i: number) {
    const key = `${s.id}-${i}`;
    api.toggleMission(key);
    play(missions[key] ? "miss" : "select");
    const willBeDone = doneCount(s) + (missions[key] ? -1 : 1);
    if (willBeDone === s.missions.length && api.award(`${s.id}-clear`, 30)) {
      setTimeout(() => play("win"), 200);
    }
  }

  if (stage) {
    const count = doneCount(stage);
    return (
      <div>
        <TopBar title={`${stage.emoji} ${stage.label}の まち`} onBack={() => setStage(null)} backLabel="街道へ" />
        <div className="fade-in flex flex-col gap-3">
          <div className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            ― {stage.period} ―
          </div>
          <Message
            speaker="むらびと（ママの ようす）"
            lines={[stage.mama, `ちょうろうの ところへ いってみなされ。`]}
          />
          <Message speaker="ちょうろう（パパの こころえ）" lines={[`${hero}よ。\n${stage.papaMind}`]} />
          <Win>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span style={{ color: "var(--gold)" }}>📜 クエストいらい</span>
              <span className="tabular-nums" style={{ color: "var(--text-muted)" }}>
                {count}/{stage.missions.length}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {stage.missions.map((m, i) => {
                const on = !!missions[`${stage.id}-${i}`];
                return (
                  <button
                    key={i}
                    onClick={() => toggle(stage, i)}
                    className="cmd text-sm"
                    style={{ color: on ? "var(--text-muted)" : "var(--text)" }}
                  >
                    <span style={{ color: on ? "var(--hp)" : "var(--text-muted)", flexShrink: 0 }}>{on ? "■" : "□"}</span>
                    <span style={{ textDecoration: on ? "line-through" : "none" }}>{m}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              げんじつで やりとげたら チェックしよう
            </p>
          </Win>
          {count === stage.missions.length && (
            <Win className="pop-in text-center text-sm" style={{ color: "var(--gold)" }}>
              ★ この まちを すくった！
            </Win>
          )}
          <div className="flex justify-center">
            <Btn onClick={() => setStage(null)}>街道へ もどる</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="🛤️ 時の街道" onBack={onBack} />
      <Message
        speaker="たびびと"
        lines={["この街道は 妊娠初期から 1さいの たんじょうびまで つづいている。", "まちの クエストを ぜんぶ こなすと\nその まちを すくえるぞ。"]}
      />
      <div className="relative mt-4 rounded-lg overflow-hidden field" style={{ border: "3px solid var(--frame)", padding: "16px 12px" }}>
        <div
          className="absolute top-6 bottom-6"
          style={{ left: "50%", width: 14, marginLeft: -7, background: "var(--path)", opacity: 0.9 }}
        />
        <div className="relative flex flex-col gap-3">
          {MONTHS.map((s, i) => {
            const clear = isClear(s);
            const left = i % 2 === 0;
            const here = i === current;
            return (
              <div key={s.id} className={`relative flex ${left ? "justify-start" : "justify-end"}`}>
                <button
                  onClick={() => {
                    play("select");
                    setStage(s);
                  }}
                  className="win relative text-left"
                  style={{
                    width: "44%",
                    padding: "8px 10px",
                    cursor: "pointer",
                    borderColor: clear ? "var(--gold)" : "var(--frame)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-sm">{s.label}</div>
                      <div className="text-[10px]" style={{ color: clear ? "var(--gold)" : "var(--text-muted)" }}>
                        {clear ? "★ すくった" : `クエスト ${doneCount(s)}/${s.missions.length}`}
                      </div>
                    </div>
                  </div>
                </button>
                <div
                  className="absolute top-1/2 flex items-center justify-center"
                  style={{ left: "50%", width: 32, height: 32, marginLeft: -16, marginTop: -16 }}
                >
                  {here ? (
                    <span className="bob text-2xl" aria-label="いまここ">
                      🧑‍🍼
                    </span>
                  ) : (
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        background: clear ? "var(--gold)" : "var(--win)",
                        border: "3px solid var(--frame)",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
