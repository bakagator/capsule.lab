"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/papa/data";
import { Card, PrimaryButton } from "./ui";

export default function QuizRunner({
  questions,
  xpPerCorrect,
  onAward,
  onFinish,
  finishLabel = "結果を見る",
}: {
  questions: QuizQuestion[];
  xpPerCorrect: number;
  onAward: (id: string, amount: number) => void;
  onFinish: (score: number) => void;
  finishLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const lastPick = wrongPicks[wrongPicks.length - 1];

  function pick(i: number) {
    if (solved || wrongPicks.includes(i)) return;
    if (q.choices[i].correct) {
      setSolved(true);
      if (wrongPicks.length === 0) {
        setScore((s) => s + 1);
        onAward(q.id, xpPerCorrect);
      }
    } else {
      setWrongPicks((w) => [...w, i]);
    }
  }

  function next() {
    if (isLast) {
      onFinish(score);
      return;
    }
    setIndex(index + 1);
    setWrongPicks([]);
    setSolved(false);
  }

  const correctIndex = q.choices.findIndex((c) => c.correct);
  const feedback = solved
    ? q.choices[correctIndex].feedback
    : lastPick !== undefined
      ? q.choices[lastPick].feedback
      : null;

  return (
    <div className="fade-in" key={q.id}>
      <div className="flex gap-1.5 mb-3">
        {questions.map((qq, i) => (
          <div
            key={qq.id}
            className="flex-1 rounded-full"
            style={{
              height: 6,
              background: i < index || (i === index && solved) ? "var(--papa)" : "var(--border)",
            }}
          />
        ))}
      </div>

      <Card className="mb-3">
        <div className="text-center text-5xl mb-2">{q.emoji}</div>
        <div className="text-xs font-bold mb-1" style={{ color: "var(--papa)" }}>
          Q{index + 1}. {q.title}
        </div>
        <p className="text-sm leading-relaxed">{q.scene}</p>
      </Card>

      <div className="flex flex-col gap-2 mb-3">
        {q.choices.map((c, i) => {
          const isWrong = wrongPicks.includes(i);
          const isRight = solved && c.correct;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={`text-left rounded-xl px-4 py-3 text-sm transition-all ${isWrong && lastPick === i ? "shake" : ""}`}
              style={{
                background: isRight ? "var(--good-bg)" : isWrong ? "var(--bad-bg)" : "var(--surface)",
                border: `2px solid ${isRight ? "var(--good)" : isWrong ? "var(--bad)" : "var(--border)"}`,
                color: isWrong ? "var(--text-muted)" : "var(--text)",
                cursor: solved || isWrong ? "default" : "pointer",
              }}
            >
              <span className="mr-2">{isRight ? "⭕" : isWrong ? "❌" : "▶︎"}</span>
              {c.text}
            </button>
          );
        })}
      </div>

      {feedback && (
        <Card
          className="pop-in mb-3"
          style={{
            background: solved ? "var(--good-bg)" : "var(--bad-bg)",
            borderColor: solved ? "var(--good)" : "var(--bad)",
          }}
        >
          <div className="font-bold text-sm mb-1">
            {solved ? (wrongPicks.length === 0 ? "🎯 一発正解！" : "⭕ 正解！") : "🤔 おしい…もう一度！"}
          </div>
          <p className="text-sm leading-relaxed">{feedback}</p>
          {solved && (
            <p className="text-xs leading-relaxed mt-2" style={{ color: "var(--text-muted)" }}>
              💡 {q.tip}
            </p>
          )}
        </Card>
      )}

      {solved && (
        <div className="text-center">
          <PrimaryButton onClick={next}>{isLast ? finishLabel : "つぎへ →"}</PrimaryButton>
        </div>
      )}
    </div>
  );
}
