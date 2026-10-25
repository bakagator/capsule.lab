"use client";

import { useState } from "react";
import { LESSONS, type Lesson } from "@/lib/papa/data";
import type { ProgressApi } from "@/lib/papa/useProgress";
import QuizRunner from "./QuizRunner";
import { BackBar, Card, PrimaryButton } from "./ui";

export default function ClassQuest({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [step, setStep] = useState<"read" | "quiz" | "done">("read");
  const earned = api.progress.earned;

  function open(l: Lesson) {
    setLesson(l);
    setStep("read");
  }

  if (!lesson) {
    const cleared = LESSONS.filter((l) => earned[`${l.id}-clear`] !== undefined).length;
    return (
      <div>
        <BackBar title="🎓 両親学級オンライン" onBack={onBack} />
        <Card className="mb-3" style={{ background: "var(--papa-bg)" }}>
          <p className="text-sm leading-relaxed">
            自宅で受けられるパパ向け両親学級。レッスンを読んで、確認テストに合格すると修了スタンプがもらえます。
          </p>
          <div className="text-xs font-bold mt-2" style={{ color: "var(--papa)" }}>
            修了 {cleared} / {LESSONS.length}
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {LESSONS.map((l, i) => {
            const done = earned[`${l.id}-clear`] !== undefined;
            return (
              <button
                key={l.id}
                onClick={() => open(l)}
                className="relative rounded-2xl p-4 text-left transition-transform active:scale-95"
                style={{
                  background: "var(--surface)",
                  border: `2px solid ${done ? "var(--good)" : "var(--border)"}`,
                  cursor: "pointer",
                }}
              >
                <div className="text-3xl mb-1">{l.emoji}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  第{i + 1}回
                </div>
                <div className="text-sm font-bold">{l.title}</div>
                {done && (
                  <span
                    className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{ background: "var(--good)", color: "#fff", transform: "rotate(8deg)" }}
                  >
                    修了
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackBar title={`${lesson.emoji} ${lesson.title}`} onBack={() => setLesson(null)} />
      {step === "read" && (
        <div className="fade-in">
          <Card className="mb-3">
            <div className="text-xs font-bold mb-2" style={{ color: "var(--papa)" }}>
              📖 レッスン
            </div>
            <ol className="flex flex-col gap-2">
              {lesson.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span
                    className="shrink-0 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--papa-bg)", color: "var(--papa)" }}
                  >
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </Card>
          <div className="text-center">
            <PrimaryButton
              onClick={() => {
                api.award(`${lesson.id}-read`, 10);
                setStep("quiz");
              }}
            >
              確認テストへ ✏️
            </PrimaryButton>
          </div>
        </div>
      )}
      {step === "quiz" && (
        <QuizRunner
          questions={[lesson.quiz]}
          xpPerCorrect={20}
          onAward={api.award}
          finishLabel="修了する 🎓"
          onFinish={() => {
            api.award(`${lesson.id}-clear`, 0);
            setStep("done");
          }}
        />
      )}
      {step === "done" && (
        <Card className="pop-in text-center">
          <div className="text-6xl mb-2">🎓</div>
          <div className="font-bold mb-1">「{lesson.title}」修了！</div>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            実際にやるときは、ママや助産師さんと一緒に練習するとさらに安心です。
          </p>
          <PrimaryButton onClick={() => setLesson(null)}>レッスン一覧へ</PrimaryButton>
        </Card>
      )}
    </div>
  );
}
