"use client";

import { useEffect, useRef, useState } from "react";
import { MILK_STEPS, type QuizQuestion } from "@/lib/papa/data";
import type { ProgressApi } from "@/lib/papa/useProgress";
import QuizRunner from "./QuizRunner";
import { BackBar, Card, PrimaryButton } from "./ui";

type Phase = "order" | "cool" | "quiz" | "done";
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MilkGame({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("order");
  const [pool, setPool] = useState(() => shuffle(MILK_STEPS));
  const [placed, setPlaced] = useState<typeof MILK_STEPS>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);

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
      const nextPlaced = [...placed, expected];
      setPlaced(nextPlaced);
      setPool((p) => p.filter((s) => s.id !== id));
      // 「冷ます」の手前まで並べたら、温度調整ミニゲームへ
      if (expected.id === "fill") {
        tempRef.current = 70;
        setTemp(70);
        setCheckMsg(null);
        setPhase("cool");
      }
    } else {
      setMistakes((m) => m + 1);
      setShakeId(id);
      setTimeout(() => setShakeId(null), 400);
    }
  }

  function check() {
    const t = Math.round(tempRef.current);
    if (t > 40) {
      setCheckMsg(`🔥 ${t}℃ あちっ！まだ熱すぎる。もう少し冷まそう`);
    } else if (t < 36) {
      setCheckMsg(`🧊 ${t}℃ ぬるすぎ…お湯につけて少し温めよう`);
    } else {
      setCheckMsg(null);
      setHold(null);
      const rest = MILK_STEPS.slice(placed.length);
      setPlaced((p) => [...p, ...rest]);
      setPool([]);
      setPhase("quiz");
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
  const tempColor = t > 40 ? "var(--bad)" : t < 36 ? "var(--papa)" : "var(--good)";

  return (
    <div>
      <BackBar title="🍼 ミルク職人への道" onBack={onBack} />

      {phase === "order" && (
        <div className="fade-in">
          <Card className="mb-3">
            <p className="text-sm leading-relaxed">
              <b>STAGE 1：</b>ミルク作りの手順を<b>正しい順番</b>にタップしよう！
            </p>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              ミス：{mistakes}回
            </div>
          </Card>
          <Steps placed={placed} />
          <div className="flex flex-col gap-2">
            {pool.map((s) => (
              <button
                key={s.id}
                onClick={() => tapStep(s.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${shakeId === s.id ? "shake" : ""}`}
                style={{
                  background: shakeId === s.id ? "var(--bad-bg)" : "var(--surface)",
                  border: `2px solid ${shakeId === s.id ? "var(--bad)" : "var(--border)"}`,
                  cursor: "pointer",
                }}
              >
                <span className="text-xl">{s.emoji}</span>
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "cool" && (
        <div className="fade-in">
          <Card className="mb-3">
            <p className="text-sm leading-relaxed">
              <b>STAGE 2：</b>ミルクを<b>人肌（36〜40℃）</b>に冷まそう。ボタンを長押しで冷やす／温める。
            </p>
          </Card>
          <Card className="mb-3">
            <div className="flex items-end justify-center gap-6">
              <div className="text-7xl">🍼</div>
              <div className="relative rounded-full overflow-hidden" style={{ width: 28, height: 200, background: "var(--surface-2)" }}>
                {/* 目標帯 36〜40℃（表示範囲 15〜75℃） */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    bottom: `${((36 - 15) / 60) * 100}%`,
                    height: `${(4 / 60) * 100}%`,
                    background: "var(--good-bg)",
                    borderTop: "2px dashed var(--good)",
                    borderBottom: "2px dashed var(--good)",
                    zIndex: 1,
                  }}
                />
                <div
                  className="absolute left-1 right-1 bottom-0 rounded-full"
                  style={{ height: `${((temp - 15) / 60) * 100}%`, background: tempColor }}
                />
              </div>
              <div className="text-4xl font-bold tabular-nums" style={{ color: tempColor, minWidth: 90 }}>
                {t}℃
              </div>
            </div>
            {hold === "cool" && <div className="text-center text-sm mt-2">🚰 じゃ〜〜</div>}
            {hold === "warm" && <div className="text-center text-sm mt-2">♨️ ぽかぽか</div>}
          </Card>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              {...holdProps("cool")}
              className="rounded-2xl py-4 text-sm font-bold select-none touch-none"
              style={{ background: hold === "cool" ? "var(--papa)" : "var(--papa-bg)", color: hold === "cool" ? "#fff" : "var(--papa)", cursor: "pointer" }}
            >
              🚰 流水で冷やす
              <div className="text-[10px] font-normal opacity-80">長押し</div>
            </button>
            <button
              {...holdProps("warm")}
              className="rounded-2xl py-4 text-sm font-bold select-none touch-none"
              style={{ background: hold === "warm" ? "var(--accent)" : "var(--surface-2)", color: hold === "warm" ? "#fff" : "var(--accent)", cursor: "pointer" }}
            >
              ♨️ お湯で温める
              <div className="text-[10px] font-normal opacity-80">長押し</div>
            </button>
          </div>
          <div className="text-center">
            <PrimaryButton onClick={check} color="var(--good)">
              ✋ 手首の内側でチェック！
            </PrimaryButton>
          </div>
          {checkMsg && (
            <div key={checkMsg} className="shake text-center text-sm font-bold mt-3">
              {checkMsg}
            </div>
          )}
        </div>
      )}

      {phase === "quiz" && (
        <div className="fade-in">
          <Card className="mb-3 text-center" style={{ background: "var(--good-bg)" }}>
            <div className="font-bold">✨ ちょうどいい温度！ミルク完成 🍼</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              STAGE 3：最後にミルクの衛生クイズ
            </div>
          </Card>
          <QuizRunner
            questions={[LEFTOVER_QUIZ]}
            xpPerCorrect={10}
            onAward={api.award}
            finishLabel="完成！"
            onFinish={() => {
              api.award(mistakes === 0 ? "milk-perfect" : "milk-clear", mistakes === 0 ? 70 : 50);
              setPhase("done");
            }}
          />
        </div>
      )}

      {phase === "done" && (
        <Card className="pop-in">
          <div className="text-center text-6xl mb-2">{mistakes === 0 ? "👨‍🍳" : "🍼"}</div>
          <div className="text-center font-bold mb-1">
            {mistakes === 0 ? "ノーミスクリア！ミルク職人の称号を授与！" : `ミルク完成！（手順ミス ${mistakes}回）`}
          </div>
          <Steps placed={placed} />
          <ul className="text-xs leading-relaxed list-disc pl-5" style={{ color: "var(--text-muted)" }}>
            <li>70℃以上のお湯で溶かすのは、粉ミルクに混入しうる菌を殺菌するため（WHOガイドライン）</li>
            <li>分量や作り方は缶の表示に従うのが一番。メーカーによって違います</li>
            <li>液体ミルクなら常温のまま使えて、夜中や外出時にとても便利</li>
          </ul>
          <div className="text-center mt-3">
            <PrimaryButton onClick={restart}>もう一度つくる</PrimaryButton>
          </div>
        </Card>
      )}
    </div>
  );
}

function Steps({ placed }: { placed: typeof MILK_STEPS }) {
  if (placed.length === 0) return null;
  return (
    <ol className="flex flex-col gap-1 mb-3">
      {placed.map((s, i) => (
        <li
          key={s.id}
          className="pop-in flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
          style={{ background: "var(--good-bg)" }}
        >
          <span className="font-bold" style={{ color: "var(--good)" }}>
            {i + 1}
          </span>
          <span>{s.emoji}</span>
          <span>{s.text}</span>
        </li>
      ))}
    </ol>
  );
}
