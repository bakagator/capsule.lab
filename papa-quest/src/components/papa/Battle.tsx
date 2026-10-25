"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/papa/data";
import type { Monster } from "@/lib/papa/rpg";
import { play } from "@/lib/papa/sfx";
import { currentHp, hpMax, levelInfo, type ProgressApi } from "@/lib/papa/useProgress";
import { Cmd, Gauge, HpGauge, Message, Win } from "./ui";

export type Encounter = { question: QuizQuestion; monster: Monster };

// 選択肢がすでに「」で始まっていれば二重にしない
const quote = (t: string) => (t.startsWith("「") ? t : `「${t}」`);

type Phase = "appear" | "command" | "win" | "miss" | "lost";

export default function Battle({
  encounters,
  api,
  xpPerWin,
  onClear,
}: {
  encounters: Encounter[];
  api: ProgressApi;
  xpPerWin: number;
  onClear: (perfect: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("appear");
  const [wrong, setWrong] = useState<number[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [fx, setFx] = useState<"hit" | "quake" | null>(null);
  const [perfect, setPerfect] = useState(0);
  const [hpAfterMiss, setHpAfterMiss] = useState(1);

  const { question: q, monster: m } = encounters[idx];
  const hero = api.progress.name || "パパ";
  const level = levelInfo(api.progress.xp).level;
  const hp = currentHp(api.progress);
  const defeated = phase === "win";

  function pick(i: number) {
    const c = q.choices[i];
    if (c.correct) {
      const first = wrong.length === 0;
      play("hit");
      setFx("hit");
      if (first) {
        setPerfect((n) => n + 1);
        api.award(q.id, m.boss ? xpPerWin * 2 : xpPerWin);
      }
      setLines([
        `${hero}の こうどう！\n${quote(c.text)}`,
        first
          ? `かいしんの いちげき！\n${m.name}を やっつけた！`
          : `${m.name}を やっつけた！`,
        c.feedback,
        `💡 ${q.tip}`,
      ]);
      setPhase("win");
      setTimeout(() => play("win"), 500);
    } else {
      const left = api.damage(m.atk);
      play("damage");
      setFx("quake");
      setWrong((w) => [...w, i]);
      setHpAfterMiss(left);
      setLines([
        `${hero}の こうどう！\n${quote(c.text)}`,
        `しかし ${m.name}には きかなかった！`,
        `${m.name}の こうげき！\n${hero}は ${m.atk}の ダメージを うけた！`,
        c.feedback,
      ]);
      setPhase("miss");
    }
  }

  function afterMessage() {
    setFx(null);
    if (phase === "appear") {
      setPhase("command");
    } else if (phase === "miss") {
      if (hpAfterMiss <= 0) {
        play("lose");
        setPhase("lost");
      } else {
        setPhase("command");
      }
    } else if (phase === "win") {
      if (idx === encounters.length - 1) {
        onClear(perfect);
      } else {
        setIdx(idx + 1);
        setWrong([]);
        setPhase("appear");
      }
    } else if (phase === "lost") {
      // 負けても同じまものから再挑戦できる
      api.heal();
      setWrong([]);
      setPhase("appear");
    }
  }

  const messageLines =
    phase === "appear"
      ? [`${m.boss ? "⚠ ボスせん！\n" : ""}${m.name}が あらわれた！`]
      : phase === "lost"
        ? [
            `${hero}は ちからつきた……`,
            "そのとき ママが あたたかい おちゃを\nいれてくれた。HPが ぜんかいふく した！",
            "きを とりなおして もういちど！",
          ]
        : lines;

  return (
    <div className={fx === "quake" ? "quake" : ""}>
      <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        <span>
          たたかい {idx + 1} / {encounters.length}
        </span>
        <span>{m.boss ? "👑 ボス" : ""}</span>
      </div>

      {/* てき */}
      <div
        className="relative mb-3 flex flex-col items-center justify-end rounded-lg overflow-hidden"
        style={{
          height: 190,
          background: "radial-gradient(ellipse at 50% 85%, #2A3570 0%, #0B1022 70%)",
          border: "3px solid var(--frame)",
        }}
      >
        <div
          key={`${idx}-${phase}`}
          className={`${defeated ? "vanish" : fx === "hit" ? "hit" : phase === "appear" ? "pop-in" : "bob"}`}
          style={{ fontSize: m.boss ? 108 : 84, lineHeight: 1, marginBottom: 10 }}
        >
          {m.sprite}
        </div>
        <div className="w-full px-4 pb-3">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: m.boss ? "var(--gold)" : "var(--text)" }}>{m.name}</span>
          </div>
          <Gauge value={defeated ? 0 : m.hp} max={m.hp} color="var(--danger)" height={8} />
        </div>
      </div>

      {/* じぶん */}
      <Win className="mb-3" style={{ padding: "10px 14px" }}>
        <div className="flex items-center justify-between text-sm mb-1">
          <span>{hero}</span>
          <span style={{ color: "var(--text-muted)" }}>Lv {level}</span>
        </div>
        <HpGauge hp={hp} max={hpMax(api.progress)} />
      </Win>

      {phase === "command" ? (
        <div className="fade-in flex flex-col gap-3">
          <Win style={{ padding: "10px 14px" }}>
            <div className="text-xs mb-1" style={{ color: "var(--gold)" }}>
              {q.emoji} {q.title}
            </div>
            <p className="text-sm leading-relaxed">{q.scene}</p>
          </Win>
          <Win style={{ padding: "8px 10px" }}>
            <div className="text-xs px-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
              どうする？
            </div>
            {q.choices.map((c, i) => (
              <Cmd key={i} onClick={() => pick(i)} disabled={wrong.includes(i)}>
                <span className="text-sm" style={{ textDecoration: wrong.includes(i) ? "line-through" : "none" }}>
                  {c.text}
                </span>
              </Cmd>
            ))}
          </Win>
        </div>
      ) : (
        <Message key={`${idx}-${phase}-${wrong.length}`} lines={messageLines} onDone={afterMessage} />
      )}
    </div>
  );
}
