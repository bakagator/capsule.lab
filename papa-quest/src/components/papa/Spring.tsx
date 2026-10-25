"use client";

import { useState } from "react";
import { LOG_CATEGORIES, LOG_XP_PER_DAY, streak, today } from "@/lib/papa/life";
import { play } from "@/lib/papa/sfx";
import { trustOf, type ProgressApi } from "@/lib/papa/useProgress";
import { Btn, Gauge, Message, TopBar, Win } from "./ui";

export default function Spring({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const { progress } = api;
  const [cat, setCat] = useState(LOG_CATEGORIES[0].id);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ bonus: boolean; key: number } | null>(null);
  const trust = trustOf(progress);
  const todays = progress.logs.filter((l) => l.date === today()).length;
  const days = streak(progress.logs);
  const category = LOG_CATEGORIES.find((c) => c.id === cat)!;

  function submit() {
    if (!text.trim()) return;
    const bonus = api.addLog(cat, text);
    play(bonus ? "win" : "select");
    setResult((r) => ({ bonus, key: (r?.key ?? 0) + 1 }));
    setText("");
  }

  return (
    <div>
      <TopBar title="⛲ きずなの泉" onBack={onBack} />
      <div className="fade-in flex flex-col gap-3">
        <div className="text-center" style={{ fontSize: 56, lineHeight: 1.1 }}>
          🧚
        </div>
        <Message
          speaker="いずみの せいれい"
          lines={[
            "ここは きずなの泉。",
            "ママへの「ありがとう」や\nママの ために した ことを きろくすると\nママの しんらいが たかまるのです。",
            `1日 ${LOG_XP_PER_DAY}つまでは けいけんちも さずけましょう。\nしんらいが たかまると さいだいHPも ふえますよ。`,
          ]}
        />

        <Win>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm">
              <span style={{ color: "var(--wife)" }}>♥</span> ママの しんらい
            </span>
            <span className="text-sm" style={{ color: "var(--gold)" }}>
              {trust.name}
            </span>
          </div>
          <Gauge
            value={trust.next === null ? 1 : trust.points - trust.min}
            max={trust.next === null ? 1 : trust.next - trust.min}
            color="var(--wife)"
          />
          <div className="flex justify-between text-[11px] mt-1 tabular-nums" style={{ color: "var(--text-muted)" }}>
            <span>
              {trust.points}pt{trust.next !== null && `（つぎの ランクまで ${trust.next - trust.points}）`}
            </span>
            <span>HP +{trust.hpBonus}</span>
          </div>
          <div className="flex justify-between text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
            <span>🔥 れんぞく {days}日</span>
            <span>
              きょうの ボーナス {Math.min(todays, LOG_XP_PER_DAY)}/{LOG_XP_PER_DAY}
            </span>
          </div>
        </Win>

        <Win>
          <div className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            ✍ きょうの きろく
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {LOG_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  play("select");
                  setCat(c.id);
                }}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  background: cat === c.id ? "var(--gold)" : "var(--win-2)",
                  color: cat === c.id ? "#1A1406" : "var(--text)",
                }}
              >
                {c.sprite} {c.label}
              </button>
            ))}
          </div>
          <label htmlFor="log-text" className="sr-only">
            きろくの ないよう
          </label>
          <textarea
            id="log-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={140}
            rows={3}
            placeholder={category.hint}
            className="w-full mb-3"
            style={{
              background: "#05081A",
              border: "2px solid var(--frame)",
              borderRadius: 4,
              padding: "8px 10px",
              color: "var(--text)",
              fontFamily: "inherit",
              fontSize: 16,
              resize: "vertical",
            }}
          />
          <div className="flex justify-center">
            <Btn gold onClick={submit} disabled={!text.trim()}>
              ⛲ いずみに きろくする
            </Btn>
          </div>
        </Win>

        {result && (
          <Message
            key={result.key}
            lines={
              result.bonus
                ? ["いずみが きらきらと かがやいた！", "ママの しんらいが 5 あがった！"]
                : ["きろくした！", "きょうの ボーナスは おわり。\nでも きろくは ちゃんと のこるよ。"]
            }
          />
        )}

        <Win>
          <div className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            📖 きずなの きろく（{progress.logs.length}）
          </div>
          {progress.logs.length === 0 ? (
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              まだ きろくが ない。きょう ママに した ことを ひとつ かいてみよう。
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {progress.logs.slice(0, 50).map((l) => {
                const c = LOG_CATEGORIES.find((x) => x.id === l.cat);
                return (
                  <li key={l.id} className="flex items-start gap-2 text-sm">
                    <span className="shrink-0">{c?.sprite ?? "✍"}</span>
                    <span className="flex-1 min-w-0" style={{ overflowWrap: "anywhere" }}>
                      {l.text}
                      <span className="block text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {l.date}　{c?.label}
                      </span>
                    </span>
                    <button
                      onClick={() => api.deleteLog(l.id)}
                      className="shrink-0 text-xs"
                      style={{ color: "var(--text-muted)", cursor: "pointer", padding: "2px 6px" }}
                      aria-label="この きろくを けす"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Win>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          ほんものの ママに ことばで つたえることが、いちばんの けいけんちです。きろくは この たんまつの ブラウザだけに ほぞんされます。
        </p>
      </div>
    </div>
  );
}
