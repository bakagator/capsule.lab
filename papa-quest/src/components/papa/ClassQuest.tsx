"use client";

import { useState } from "react";
import { LESSONS, type Lesson } from "@/lib/papa/data";
import { LESSON_MONSTERS } from "@/lib/papa/rpg";
import type { ProgressApi } from "@/lib/papa/useProgress";
import Battle from "./Battle";
import { Btn, Cmd, Message, TopBar, Win } from "./ui";

type Phase = "lecture" | "ready" | "battle" | "done";

export default function ClassQuest({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [phase, setPhase] = useState<Phase>("lecture");
  const [round, setRound] = useState(0);
  const earned = api.progress.earned;
  const hero = api.progress.name || "パパ";

  if (!lesson) {
    const cleared = LESSONS.filter((l) => earned[`${l.id}-clear`] !== undefined).length;
    return (
      <div>
        <TopBar title="🏛️ 学びの神殿" onBack={onBack} />
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 64, lineHeight: 1.1 }}>
            🧙
          </div>
          <Message
            speaker="けんじゃ"
            lines={[
              `ほっほっ。${hero}よ、よく きたな。\nここは パパの ための りょうしん学級じゃ。`,
              "6つの へやで わざを まなび、\nしれんの まものを たおせば\nしゅうりょうの あかしを さずけよう。",
            ]}
          />
          <Win style={{ padding: "8px 10px" }}>
            <div className="flex justify-between text-xs px-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
              <span>どの へやに はいる？</span>
              <span>
                あかし {cleared}/{LESSONS.length}
              </span>
            </div>
            {LESSONS.map((l, i) => {
              const done = earned[`${l.id}-clear`] !== undefined;
              return (
                <Cmd
                  key={l.id}
                  onClick={() => {
                    setLesson(l);
                    setPhase("lecture");
                  }}
                >
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span>
                      {l.emoji} だい{i + 1}のへや：{l.title}
                    </span>
                    {done && <span style={{ color: "var(--gold)" }}>★</span>}
                  </span>
                </Cmd>
              );
            })}
          </Win>
        </div>
      </div>
    );
  }

  const monster = LESSON_MONSTERS[lesson.quiz.id];

  return (
    <div>
      <TopBar title={`${lesson.emoji} ${lesson.title}のへや`} onBack={() => setLesson(null)} backLabel="神殿へ" />

      {(phase === "lecture" || phase === "ready") && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 56, lineHeight: 1.1 }}>
            🧙
          </div>
          <Message
            speaker="けんじゃ"
            lines={[
              `では「${lesson.title}」の わざを さずけよう。`,
              ...lesson.points.map((p, i) => `その${i + 1}。\n${p}`),
              `わかったかの？\nでは しれんじゃ！ ${monster.name}を たおしてみよ！`,
            ]}
            onDone={() => {
              api.award(`${lesson.id}-read`, 10);
              setPhase("ready");
            }}
          />
          {phase === "ready" && (
            <>
              <Win style={{ padding: "10px 14px" }}>
                <div className="text-xs mb-1" style={{ color: "var(--gold)" }}>
                  📜 まなんだ わざ
                </div>
                <ul className="text-xs leading-relaxed flex flex-col gap-1">
                  {lesson.points.map((p, i) => (
                    <li key={i}>・{p}</li>
                  ))}
                </ul>
              </Win>
              <div className="pop-in flex justify-center">
                <Btn
                  gold
                  onClick={() => {
                    setRound((r) => r + 1);
                    setPhase("battle");
                  }}
                >
                  ⚔ しれんに いどむ
                </Btn>
              </div>
            </>
          )}
        </div>
      )}

      {phase === "battle" && (
        <Battle
          key={round}
          encounters={[{ question: lesson.quiz, monster }]}
          api={api}
          xpPerWin={20}
          onClear={() => {
            api.award(`${lesson.id}-clear`, 0);
            setPhase("done");
          }}
        />
      )}

      {phase === "done" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 64, lineHeight: 1.1 }}>
            📜
          </div>
          <Message
            speaker="けんじゃ"
            lines={[
              `みごとじゃ！\n「${lesson.title}」の しゅうりょうの あかしを さずけよう。`,
              "ほんばんの まえには ママや じょさんしさんと\nいっしょに れんしゅうすると あんしんじゃぞ。",
            ]}
          />
          <div className="flex justify-center">
            <Btn gold onClick={() => setLesson(null)}>
              神殿へ もどる
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
