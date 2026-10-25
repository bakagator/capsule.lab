"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/rpg/types";
import { GameButton } from "./ui";

const MAX_ATTEMPTS = 3;

type Phase = "answering" | "correct" | "revealed";

export default function QuizCard({
  quiz,
  onDone,
}: {
  quiz: Quiz;
  onDone: (firstTry: boolean) => void;
}) {
  const multi = quiz.answer.length > 1;
  const [selected, setSelected] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [shake, setShake] = useState(false);

  function toggle(i: number) {
    if (phase !== "answering") return;
    if (multi) {
      setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
    } else {
      setSelected([i]);
    }
  }

  function submit() {
    const correct =
      selected.length === quiz.answer.length && quiz.answer.every((a) => selected.includes(a));
    if (correct) {
      setPhase("correct");
      return;
    }
    const nextMisses = misses + 1;
    setMisses(nextMisses);
    setSelected([]);
    setShake(true);
    setTimeout(() => setShake(false), 300);
    if (nextMisses >= MAX_ATTEMPTS) setPhase("revealed");
  }

  const hint = phase === "answering" && misses > 0 ? quiz.hints[misses - 1] : null;

  return (
    <div className={`fade-in ${shake ? "rpg-shake" : ""}`}>
      <p className="font-bold leading-relaxed" style={{ fontSize: "16px" }}>
        {quiz.question}
      </p>
      {multi && (
        <p className="mt-1 text-xs" style={{ color: "var(--rpg-gold)" }}>
          ※ 当てはまるものをすべて選んでください
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {quiz.choices.map((choice, i) => {
          const isAnswer = quiz.answer.includes(i);
          const showResult = phase !== "answering";
          const isSelected = selected.includes(i);
          let border = isSelected ? "var(--rpg-gold)" : "var(--rpg-on-window-muted)";
          if (showResult && isAnswer) border = "var(--rpg-correct)";
          return (
            <button
              key={choice}
              onClick={() => toggle(i)}
              disabled={showResult}
              className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors"
              style={{
                background: isSelected || (showResult && isAnswer) ? "rgba(232,184,74,0.12)" : "var(--rpg-window-2)",
                border: `2px solid ${border}`,
                color: "var(--rpg-on-window)",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "var(--rpg-gold)", minWidth: "1.2em" }}>
                {multi ? (isSelected ? "☑" : "☐") : isSelected ? "▶" : "・"}
              </span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {hint && (
        <p
          className="fade-in mt-3 rounded-lg px-3 py-2 text-sm"
          style={{ background: "rgba(224,103,95,0.15)", border: "1px solid var(--rpg-wrong)" }}
        >
          🦉 ヒント{misses}：{hint}
        </p>
      )}

      {phase === "answering" ? (
        <GameButton
          variant="primary"
          className="mt-4 w-full text-center"
          disabled={selected.length === 0}
          onClick={submit}
        >
          こたえる
        </GameButton>
      ) : (
        <div className="fade-in mt-4">
          <p className="font-bold" style={{ color: phase === "correct" ? "var(--rpg-correct)" : "var(--rpg-wrong)" }}>
            {phase === "correct" ? (misses === 0 ? "◎ 正解！" : "○ 正解！") : "× 残念……正解は緑の枠の選択肢じゃ"}
          </p>
          <p
            className="mt-2 rounded-lg px-3 py-2 text-sm leading-relaxed"
            style={{ background: "var(--rpg-window-2)" }}
          >
            🦉 {quiz.explanation}
          </p>
          <GameButton
            variant="primary"
            className="mt-3 w-full text-center"
            autoFocus
            onClick={() => onDone(phase === "correct" && misses === 0)}
          >
            つづける
          </GameButton>
        </div>
      )}
    </div>
  );
}
