"use client";

import { useState } from "react";
import { WISH_PRESETS } from "@/lib/papa/life";
import { play } from "@/lib/papa/sfx";
import type { ProgressApi } from "@/lib/papa/useProgress";
import { Btn, Message, TopBar, Win } from "./ui";

export default function Tower({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const { wishes } = api.progress;
  const [text, setText] = useState("");
  const [cheer, setCheer] = useState<{ text: string; key: number } | null>(null);
  const doneCount = wishes.filter((w) => w.done).length;
  const presets = WISH_PRESETS.filter((p) => !wishes.some((w) => w.text === p));
  // 上の階ほど新しい：未達成を上、達成済みを下（土台）に積む
  const floors = [...wishes.filter((w) => !w.done).reverse(), ...wishes.filter((w) => w.done)];

  function add(t: string) {
    if (!t.trim()) return;
    api.addWish(t);
    play("select");
    setText("");
  }

  function toggle(id: string, wasDone: boolean, t: string) {
    api.toggleWish(id);
    if (!wasDone) {
      play("win");
      setCheer((c) => ({ text: t, key: (c?.key ?? 0) + 1 }));
    } else {
      play("miss");
    }
  }

  return (
    <div>
      <TopBar title="🗼 ゆめの塔" onBack={onBack} />
      <div className="fade-in flex flex-col gap-3">
        <div className="text-center" style={{ fontSize: 56, lineHeight: 1.1 }}>
          🧙‍♀️
        </div>
        <Message
          speaker="ゆめの ばんにん"
          lines={[
            "ここは ゆめの塔。",
            "かぞくで やりたいことを かきこめば\n塔は どんどん たかくなる。",
            "ゆめを かなえるたびに けいけんちと\nママの しんらいが あがるぞ。",
          ]}
        />

        <Win>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: "var(--gold)" }}>✍ あたらしい ゆめ</span>
            <span style={{ color: "var(--text-muted)" }}>
              かなえた ゆめ {doneCount}/{wishes.length}
            </span>
          </div>
          <div className="flex gap-2 mb-3">
            <label htmlFor="wish-text" className="sr-only">
              やりたいこと
            </label>
            <input
              id="wish-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add(text)}
              maxLength={40}
              placeholder="例：かぞく3人で うみに いく"
              className="flex-1 min-w-0"
              style={{
                background: "#05081A",
                border: "2px solid var(--frame)",
                borderRadius: 4,
                padding: "8px 10px",
                color: "var(--text)",
                fontFamily: "inherit",
                fontSize: 16,
              }}
            />
            <Btn gold onClick={() => add(text)} disabled={!text.trim()}>
              ついか
            </Btn>
          </div>
          {presets.length > 0 && (
            <>
              <div className="text-[11px] mb-1.5" style={{ color: "var(--text-muted)" }}>
                ヒント（タップで ついか）
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => add(p)}
                    className="btn"
                    style={{ padding: "3px 8px", fontSize: 11 }}
                  >
                    ＋ {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </Win>

        {cheer && (
          <Message
            key={cheer.key}
            lines={[`ゆめが かなった！\n「${cheer.text}」`, "ママの しんらいが 8 あがった！"]}
          />
        )}

        <div className="flex flex-col items-center">
          <div style={{ fontSize: 28, lineHeight: 1 }}>✨</div>
          <div className="w-full flex flex-col" style={{ maxWidth: 360 }}>
            {floors.length === 0 ? (
              <Win className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                まだ 塔は たっていない。さいしょの ゆめを かいてみよう。
              </Win>
            ) : (
              floors.map((w, i) => (
                <div
                  key={w.id}
                  className="flex items-center gap-2"
                  style={{
                    background: w.done ? "#2A2410" : "var(--win)",
                    borderLeft: "3px solid var(--frame)",
                    borderRight: "3px solid var(--frame)",
                    borderTop: i === 0 ? "3px solid var(--frame)" : "1px dashed rgba(243,238,220,0.3)",
                    borderBottom: i === floors.length - 1 ? "3px solid var(--frame)" : "none",
                    padding: "8px 10px",
                  }}
                >
                  <span className="text-[10px] tabular-nums shrink-0" style={{ color: "var(--text-muted)", width: 30 }}>
                    {floors.length - i}F
                  </span>
                  <button
                    onClick={() => toggle(w.id, w.done, w.text)}
                    className="flex-1 min-w-0 flex items-start gap-2 text-left text-sm"
                    style={{ cursor: "pointer", color: w.done ? "var(--gold)" : "var(--text)" }}
                  >
                    <span className="shrink-0">{w.done ? "★" : "□"}</span>
                    <span style={{ overflowWrap: "anywhere" }}>
                      {w.text}
                      {w.doneAt && (
                        <span className="block text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {w.doneAt} に かなえた
                        </span>
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() => api.deleteWish(w.id)}
                    className="shrink-0 text-xs"
                    style={{ color: "var(--text-muted)", cursor: "pointer", padding: "2px 6px" }}
                    aria-label="この ゆめを けす"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <div style={{ width: "100%", maxWidth: 400, height: 10, background: "var(--grass-1)", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}
