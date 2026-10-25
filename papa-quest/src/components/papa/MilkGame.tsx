"use client";

import { useEffect, useRef, useState } from "react";
import { MILK_STEPS, type QuizQuestion } from "@/lib/papa/data";
import { play } from "@/lib/papa/sfx";
import type { ProgressApi } from "@/lib/papa/useProgress";
import Battle from "./Battle";
import { Btn, Message, TopBar, Win } from "./ui";

type Phase = "intro" | "order" | "cool" | "battle" | "done";
type Hold = "cool" | "warm" | null;

const LEFTOVER_QUIZ: QuizQuestion = {
  id: "milk-leftover-q",
  emoji: "🍼",
  title: "飲み残しミルク",
  scene: "赤ちゃんがミルクを半分残して寝てしまった。残りはどうする？",
  choices: [
    { text: "冷蔵庫に入れて次の授乳で使う", correct: false, feedback: "飲み残しには雑菌が増えやすいので再利用はNGです。" },
    { text: "もったいないけど捨てる", correct: true, feedback: "正解！飲み残しや、作ってから2時間以上たったミルクは捨てましょう。" },
    { text: "常温で置いておき、起きたらあげる", correct: false, feedback: "常温は特に雑菌が増えやすく危険です。" },
  ],
  tip: "ミルクは作り置きせず、飲む直前に作るのが基本。",
};

const GERM = { name: "のみのこしバイキン", sprite: "🦠", hp: 40, atk: 15 };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MilkGame({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [pool, setPool] = useState(() => shuffle(MILK_STEPS));
  const [placed, setPlaced] = useState<typeof MILK_STEPS>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  const [temp, setTemp] = useState(70);
  const [hold, setHold] = useState<Hold>(null);
  const [checkMsg, setCheckMsg] = useState<string | null>(null);
  const tempRef = useRef(70);

  useEffect(() => {
    if (phase !== "cool") return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const rate = hold === "cool" ? -7 : hold === "warm" ? 4 : -0.3;
      tempRef.current = Math.max(15, Math.min(75, tempRef.current + rate * dt));
      setTemp(tempRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, hold]);

  function tapStep(id: string) {
    const expected = MILK_STEPS[placed.length];
    if (id === expected.id) {
      play("select");
      setPlaced([...placed, expected]);
      setPool((p) => p.filter((s) => s.id !== id));
      // 「冷ます」の手前まで並べたら、温度調整へ
      if (expected.id === "fill") {
        tempRef.current = 70;
        setTemp(70);
        setCheckMsg(null);
        setPhase("cool");
      }
    } else {
      play("damage");
      setMistakes((m) => m + 1);
      setShakeId(id);
      setTimeout(() => setShakeId(null), 400);
    }
  }

  function check() {
    const t = Math.round(tempRef.current);
    if (t > 40) {
      play("miss");
      setCheckMsg(`🔥 ${t}℃ あちっ！ まだ あつすぎる`);
    } else if (t < 36) {
      play("miss");
      setCheckMsg(`🧊 ${t}℃ ぬるすぎる… すこし あたためよう`);
    } else {
      play("win");
      setCheckMsg(null);
      setHold(null);
      setPlaced((p) => [...p, ...MILK_STEPS.slice(p.length)]);
      setPool([]);
      setRound((r) => r + 1);
      setPhase("battle");
    }
  }

  function restart() {
    setPool(shuffle(MILK_STEPS));
    setPlaced([]);
    setMistakes(0);
    setHold(null);
    setPhase("order");
  }

  const holdProps = (mode: Exclude<Hold, null>) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setHold(mode);
    },
    onPointerUp: () => setHold(null),
    onPointerCancel: () => setHold(null),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const t = Math.round(temp);
  const tempColor = t > 40 ? "var(--danger)" : t < 36 ? "var(--mp)" : "var(--hp)";
  const perfect = mistakes === 0;

  return (
    <div>
      <TopBar title="⚗️ ミルク錬金工房" onBack={onBack} />

      {phase === "intro" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 64, lineHeight: 1.1 }}>
            🧑‍🔬
          </div>
          <Message
            speaker="れんきんじゅつし"
            lines={[
              "ようこそ ミルク錬金工房へ。",
              "かんぺきな ミルクを れんせいするには\nただしい てじゅんと おんどが ひつようだ。",
              "レシピを ただしい じゅんばんに えらんでみよ！",
            ]}
            onDone={() => setPhase("order")}
          />
        </div>
      )}

      {phase === "order" && (
        <div className="fade-in flex flex-col gap-3">
          <Win style={{ padding: "10px 14px" }}>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--gold)" }}>STEP1：レシピを ならべろ</span>
              <span style={{ color: "var(--text-muted)" }}>しっぱい {mistakes}</span>
            </div>
          </Win>
          <Recipe placed={placed} />
          <Win style={{ padding: "8px 10px" }}>
            <div className="text-xs px-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
              つぎの てじゅんは？
            </div>
            {pool.map((s) => (
              <button
                key={s.id}
                onClick={() => tapStep(s.id)}
                className={`cmd text-sm ${shakeId === s.id ? "shake" : ""}`}
                style={{ color: shakeId === s.id ? "var(--danger)" : "var(--text)" }}
              >
                <span className="cur">▶</span>
                <span>
                  {s.emoji} {s.text}
                </span>
              </button>
            ))}
          </Win>
        </div>
      )}

      {phase === "cool" && (
        <div className="fade-in flex flex-col gap-3">
          <Win style={{ padding: "10px 14px" }}>
            <div className="text-xs" style={{ color: "var(--gold)" }}>
              STEP2：ひとはだ（36〜40℃）に ちょうせい
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              ボタンを ながおしで ひやす／あたためる
            </div>
          </Win>
          <Win>
            <div className="flex items-end justify-center gap-6">
              <div style={{ fontSize: 64, lineHeight: 1 }}>🍼</div>
              <div
                className="relative overflow-hidden"
                style={{ width: 26, height: 180, background: "#05081A", border: "2px solid var(--frame)", borderRadius: 3 }}
              >
                {/* 目標帯 36〜40℃（表示範囲 15〜75℃） */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    bottom: `${((36 - 15) / 60) * 100}%`,
                    height: `${(4 / 60) * 100}%`,
                    borderTop: "2px dashed var(--gold)",
                    borderBottom: "2px dashed var(--gold)",
                    zIndex: 1,
                  }}
                />
                <div
                  className="absolute left-0 right-0 bottom-0"
                  style={{ height: `${((temp - 15) / 60) * 100}%`, background: tempColor }}
                />
              </div>
              <div className="text-3xl tabular-nums" style={{ color: tempColor, minWidth: 80 }}>
                {t}℃
              </div>
            </div>
            <div className="text-center text-xs mt-2" style={{ minHeight: 18 }}>
              {hold === "cool" && "🚰 じゃーー"}
              {hold === "warm" && "♨️ ぽかぽか"}
            </div>
          </Win>
          <div className="grid grid-cols-2 gap-2">
            <button
              {...holdProps("cool")}
              className="btn select-none touch-none flex-col"
              style={{ background: hold === "cool" ? "var(--mp)" : "var(--win-2)", color: hold === "cool" ? "#05081A" : "var(--text)" }}
            >
              🚰 りゅうすいで ひやす
              <span className="text-[10px] opacity-80">ながおし</span>
            </button>
            <button
              {...holdProps("warm")}
              className="btn select-none touch-none flex-col"
              style={{ background: hold === "warm" ? "var(--danger)" : "var(--win-2)", color: hold === "warm" ? "#05081A" : "var(--text)" }}
            >
              ♨️ おゆで あたためる
              <span className="text-[10px] opacity-80">ながおし</span>
            </button>
          </div>
          <div className="flex justify-center">
            <Btn gold onClick={check}>
              ✋ てくびの うちがわで チェック
            </Btn>
          </div>
          {checkMsg && (
            <div key={checkMsg} className="shake text-center text-sm">
              {checkMsg}
            </div>
          )}
        </div>
      )}

      {phase === "battle" && (
        <div className="fade-in flex flex-col gap-3">
          <Win className="text-center text-sm" style={{ color: "var(--gold)", padding: "10px 14px" }}>
            ✨ ミルクの れんせいに せいこう！ …しかし？
          </Win>
          <Battle
            key={round}
            encounters={[{ question: LEFTOVER_QUIZ, monster: GERM }]}
            api={api}
            xpPerWin={10}
            onClear={() => {
              api.award(perfect ? "milk-perfect" : "milk-clear", perfect ? 70 : 50);
              setPhase("done");
            }}
          />
        </div>
      )}

      {phase === "done" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 64, lineHeight: 1.1 }}>
            {perfect ? "👨‍🍳" : "🍼"}
          </div>
          <Message
            speaker="れんきんじゅつし"
            lines={[
              perfect ? "ノーミスとは おそれいった！\n👨‍🍳 ミルクしょくにんの あかしを さずけよう。" : `みごと！ （しっぱい ${mistakes}かい）`,
              "🍼 ほにゅうびんソード を てにいれた！",
              "おぼえておけ。\n70℃いじょうの おゆで とかすのは\nこなミルクの きんを ころすためだ（WHOの ガイドライン）。",
              "ぶんりょうや つくりかたは かんの ひょうじに したがうのが いちばん。\nえきたいミルクなら そのまま つかえて よなかに べんりだぞ。",
            ]}
          />
          <Recipe placed={placed} />
          <div className="flex justify-center gap-3">
            <Btn onClick={restart}>もういちど</Btn>
            <Btn gold onClick={onBack}>
              マップへ
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function Recipe({ placed }: { placed: typeof MILK_STEPS }) {
  if (placed.length === 0) return null;
  return (
    <Win style={{ padding: "10px 14px" }}>
      <div className="text-xs mb-1" style={{ color: "var(--gold)" }}>
        📜 レシピ
      </div>
      <ol className="flex flex-col gap-1">
        {placed.map((s, i) => (
          <li key={s.id} className="pop-in flex gap-2 text-xs">
            <span className="tabular-nums" style={{ color: "var(--gold)" }}>
              {i + 1}.
            </span>
            <span>
              {s.emoji} {s.text}
            </span>
          </li>
        ))}
      </ol>
    </Win>
  );
}
