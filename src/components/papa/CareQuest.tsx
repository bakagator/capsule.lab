"use client";

import { useState } from "react";
import { CARE_QUESTIONS } from "@/lib/papa/data";
import type { ProgressApi } from "@/lib/papa/useProgress";
import QuizRunner from "./QuizRunner";
import { BackBar, Card, PrimaryButton } from "./ui";

export default function CareQuest({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const total = CARE_QUESTIONS.length;

  function finish(score: number) {
    setResult(score);
    api.award("care-clear", 30);
  }

  const rank =
    result === null
      ? null
      : result === total
        ? { emoji: "👑", text: "ママの心を完全に理解した気遣いマスター！" }
        : result >= total - 2
          ? { emoji: "😊", text: "かなりの気遣い上手！あと一歩でマスター" }
          : { emoji: "💪", text: "伸びしろたっぷり！もう一度挑戦してみよう" };

  return (
    <div>
      <BackBar title="💐 ママへの気遣いクエスト" onBack={onBack} />
      {result === null ? (
        <QuizRunner
          key={round}
          questions={CARE_QUESTIONS}
          xpPerCorrect={20}
          onAward={api.award}
          onFinish={finish}
        />
      ) : (
        <Card className="pop-in text-center">
          <div className="text-6xl mb-2">{rank!.emoji}</div>
          <div className="text-2xl font-bold mb-1">
            {result} / {total} 問 一発正解
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {rank!.text}
          </p>
          <div
            className="rounded-xl p-3 text-left text-sm leading-relaxed mb-4"
            style={{ background: "var(--surface-2)" }}
          >
            <div className="font-bold mb-1">🗝️ 気遣いの3原則</div>
            <div>1. まず「おつかれさま」「ありがとう」を言葉にする</div>
            <div>2. 解決より先に、気持ちに共感して話を聴く</div>
            <div>3. 「手伝う」ではなく、自分ごととして動く</div>
          </div>
          <PrimaryButton
            onClick={() => {
              setResult(null);
              setRound((r) => r + 1);
            }}
          >
            もう一度あそぶ
          </PrimaryButton>
        </Card>
      )}
    </div>
  );
}
