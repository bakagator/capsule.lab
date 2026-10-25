"use client";

import { useState } from "react";
import { CARE_QUESTIONS } from "@/lib/papa/data";
import { CARE_MONSTERS } from "@/lib/papa/rpg";
import type { ProgressApi } from "@/lib/papa/useProgress";
import Battle from "./Battle";
import { Btn, Message, TopBar, Win } from "./ui";

const ENCOUNTERS = CARE_QUESTIONS.map((q) => ({ question: q, monster: CARE_MONSTERS[q.id] }));

type Phase = "gate" | "battle" | "clear";

export default function CareQuest({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("gate");
  const [round, setRound] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [talked, setTalked] = useState(false);
  const cleared = api.progress.earned["care-clear"] !== undefined;
  const hero = api.progress.name || "パパ";

  return (
    <div>
      <TopBar title="🏰 ママの城" onBack={onBack} />

      {phase === "gate" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 72, lineHeight: 1.1 }}>
            🏰
          </div>
          <Message
            speaker="もんばん"
            lines={[
              `よくぞ きた、${hero}よ。`,
              "この城では ママが まいにち\nたくさんの まものと たたかっている。",
              `ぜんぶで ${ENCOUNTERS.length}たいの まものが いるぞ。\nママの きもちに よりそう ことばで\nまものを しずめるのだ！`,
            ]}
            onDone={() => setTalked(true)}
          />
          {talked && (
            <div className="pop-in flex justify-center gap-3">
              <Btn
                gold
                onClick={() => {
                  setRound((r) => r + 1);
                  setPhase("battle");
                }}
              >
                ⚔ いどむ
              </Btn>
              <Btn onClick={onBack}>にげる</Btn>
            </div>
          )}
          {cleared && (
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              ★ この城は すでに すくった。なんどでも ちょうせんできる。
            </p>
          )}
        </div>
      )}

      {phase === "battle" && (
        <Battle
          key={round}
          encounters={ENCOUNTERS}
          api={api}
          xpPerWin={20}
          onClear={(p) => {
            setPerfect(p);
            api.award("care-clear", 30);
            setPhase("clear");
          }}
        />
      )}

      {phase === "clear" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 72, lineHeight: 1.1 }}>
            👸
          </div>
          <Message
            speaker="ママ"
            lines={[
              `${hero}、ありがとう。\nまものは みんな いなくなったわ。`,
              `いっぱつで たおせたのは ${perfect} / ${ENCOUNTERS.length}たい。`,
              "おぼえておいてね。\n1. まず「おつかれさま」「ありがとう」\n2. かいけつより きもちに きょうかん\n3.「てつだう」じゃなく じぶんごと",
              "💌 ママへのてがみ を てにいれた！",
            ]}
          />
          <Win className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
            ほんものの ママにも、きょう ひとこと「ありがとう」を つたえてみよう。
          </Win>
          <div className="flex justify-center gap-3">
            <Btn onClick={() => setPhase("gate")}>もういちど</Btn>
            <Btn gold onClick={onBack}>
              マップへ
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
