"use client";

import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/papa/sfx";
import type { ProgressApi } from "@/lib/papa/useProgress";
import { Btn, Cmd, Gauge, Message, TopBar, Win } from "./ui";

const POSES = [
  {
    text: "たてだっこで、あかちゃんの あごを かたに のせる",
    ok: true,
    feedback: "ていばんの「かただっこ」。かたに ガーゼを 1まい かけておくと はきもどしても あんしん。",
  },
  {
    text: "あおむけに ねかせたまま、おなかを トントンする",
    ok: false,
    feedback: "ねたままだと くうきが うえに ぬけにくい。じょうたいを おこしてあげよう。",
  },
  {
    text: "ひざに すわらせ、てで あごと むねを ささえて すこし まえかがみ",
    ok: true,
    feedback: "くびが すわるまえでも できる「すわらせだっこ」。あごを ささえる ては くびを おさえないように。",
  },
  {
    text: "わきの したを もって たかく もちあげ、うえしたに ゆらす",
    ok: false,
    feedback: "くびが ふあんていで きけん！ ゆさぶるのも ぜったいに ダメ。",
  },
];

type Phase = "intro" | "pose" | "poseResult" | "pat" | "success" | "fail";
type Hit = { label: string; color: string; key: number };

export default function BurpGame({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [pose, setPose] = useState<number | null>(null);
  const [poseTries, setPoseTries] = useState(0);

  const [cursor, setCursor] = useState(0);
  const [air, setAir] = useState(100);
  const [fuss, setFuss] = useState(0);
  const [hit, setHit] = useState<Hit | null>(null);
  const [tooStrong, setTooStrong] = useState(0);
  const dir = useRef(1);
  const pos = useRef(0);
  const hero = api.progress.name || "パパ";

  useEffect(() => {
    if (phase !== "pat") return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const speed = 90 + (100 - air) * 0.9;
      pos.current += dir.current * speed * dt;
      if (pos.current >= 100) {
        pos.current = 100;
        dir.current = -1;
      } else if (pos.current <= 0) {
        pos.current = 0;
        dir.current = 1;
      }
      setCursor(pos.current);
      setFuss((f) => Math.max(0, f - 10 * dt));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, air]);

  function choosePose(i: number) {
    setPose(i);
    setPoseTries((n) => n + 1);
    play(POSES[i].ok ? "hit" : "miss");
    setPhase("poseResult");
  }

  function startPat() {
    setAir(100);
    setFuss(0);
    setTooStrong(0);
    setHit(null);
    pos.current = 0;
    dir.current = 1;
    setPhase("pat");
  }

  function pat() {
    if (phase !== "pat") return;
    const c = pos.current;
    const key = Date.now();
    if (c >= 70) {
      play("damage");
      setHit({ label: "つよすぎ！ あかちゃんが びっくり！", color: "var(--danger)", key });
      setTooStrong((n) => n + 1);
      const nf = Math.min(100, fuss + 38);
      setFuss(nf);
      if (nf >= 100) {
        play("lose");
        setPhase("fail");
      }
      return;
    }
    let gain = 4;
    let label = "やさしすぎて きかない…";
    let color = "var(--text-muted)";
    if (c >= 45 && c <= 55) {
      gain = 22;
      label = "かいしんの いちげき！";
      color = "var(--gold)";
    } else if (c >= 30) {
      gain = 13;
      label = "ガスゴーストに きいた！";
      color = "var(--hp)";
    }
    play(gain >= 13 ? "hit" : "miss");
    setHit({ label, color, key });
    const na = Math.max(0, air - gain);
    setAir(na);
    if (na === 0) {
      setPhase("success");
      setTimeout(() => play("win"), 300);
      api.award(tooStrong === 0 ? "burp-gentle" : "burp-clear", tooStrong === 0 ? 70 : 50);
    }
  }

  const baby =
    phase === "success" ? "😊" : phase === "fail" ? "😭" : fuss > 60 ? "😣" : fuss > 25 ? "😕" : "😌";
  const selected = pose !== null ? POSES[pose] : null;

  return (
    <div>
      <TopBar title="🕳️ ゲップの洞窟" onBack={onBack} />

      {phase === "intro" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 64, lineHeight: 1.1 }}>
            🍼👶
          </div>
          <Message
            lines={[
              "ミルクを のみおわった あかちゃん。\nおなかの なかに ガスゴーストが すみついた！",
              `${hero}の やさしい トントンで\nガスゴーストを おいだそう！`,
            ]}
            onDone={() => setPhase("pose")}
          />
        </div>
      )}

      {(phase === "pose" || phase === "poseResult") && (
        <div className="fade-in flex flex-col gap-3">
          <Win style={{ padding: "8px 10px" }}>
            <div className="text-xs px-1.5 mb-1" style={{ color: "var(--gold)" }}>
              STEP1：どう かまえる？
            </div>
            {POSES.map((p, i) => (
              <Cmd key={i} onClick={() => choosePose(i)} disabled={phase === "poseResult"}>
                <span className="text-sm">{p.text}</span>
              </Cmd>
            ))}
          </Win>
          {phase === "poseResult" && selected && (
            <>
              <Message
                key={`${pose}-${poseTries}`}
                lines={[selected.ok ? `○ ただしい かまえだ！\n${selected.feedback}` : `× それは あぶない！\n${selected.feedback}`]}
              />
              <div className="pop-in flex justify-center">
                {selected.ok ? (
                  <Btn gold onClick={startPat}>
                    STEP2：トントンへ ▶
                  </Btn>
                ) : (
                  <Btn onClick={() => setPhase("pose")}>えらびなおす</Btn>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {(phase === "pat" || phase === "success" || phase === "fail") && (
        <div className="fade-in flex flex-col gap-3">
          <div
            className="relative flex flex-col items-center rounded-lg"
            style={{
              padding: "14px 16px",
              background: "radial-gradient(ellipse at 50% 85%, #2A3570 0%, #0B1022 70%)",
              border: "3px solid var(--frame)",
            }}
          >
            <div className="w-full grid grid-cols-2 gap-3 text-xs mb-2">
              <div>
                <div className="mb-1">👻 ガスゴースト</div>
                <Gauge value={air} max={100} color="var(--danger)" height={8} />
              </div>
              <div>
                <div className="mb-1">😤 ごきげんナナメど</div>
                <Gauge value={fuss} max={100} color="var(--mp)" height={8} />
              </div>
            </div>
            <button
              onClick={pat}
              className={`select-none ${phase === "pat" ? "wobble" : ""}`}
              style={{ fontSize: 88, lineHeight: 1.1, cursor: phase === "pat" ? "pointer" : "default" }}
              aria-label="せなかを トントン"
            >
              {baby}
            </button>
            <div style={{ minHeight: 28 }} className="text-sm text-center">
              {phase === "pat" && hit && (
                <span key={hit.key} className="pop-in inline-block" style={{ color: hit.color }}>
                  {hit.label}
                </span>
              )}
              {phase === "success" && (
                <span className="pop-in inline-block text-2xl" style={{ color: "var(--gold)" }}>
                  ゲフッ💨
                </span>
              )}
            </div>
          </div>

          {phase === "pat" && (
            <Win style={{ padding: "10px 14px" }}>
              <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                ちからゲージ：きんいろで トントン！
              </div>
              <div className="relative overflow-hidden" style={{ height: 26, border: "2px solid var(--frame)", borderRadius: 3 }}>
                <div className="absolute inset-0 flex">
                  <div style={{ width: "30%", background: "#1B2552" }} />
                  <div style={{ width: "15%", background: "#2F6B4A" }} />
                  <div style={{ width: "10%", background: "var(--gold)" }} />
                  <div style={{ width: "15%", background: "#2F6B4A" }} />
                  <div style={{ width: "30%", background: "#6B2430" }} />
                </div>
                <div
                  className="absolute top-0 bottom-0"
                  style={{ left: `calc(${cursor}% - 3px)`, width: 6, background: "var(--frame)" }}
                />
              </div>
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                <span>よわい</span>
                <span>ちょうどいい</span>
                <span>つよすぎ</span>
              </div>
              <div className="flex justify-center mt-3">
                <button onClick={pat} className="btn gold" style={{ padding: "14px 40px", fontSize: 16 }}>
                  ✋ トントン
                </button>
              </div>
            </Win>
          )}

          {phase === "success" && (
            <Message
              lines={[
                `ガスゴーストを おいだした！${tooStrong === 0 ? "\n🤲 やさしいて の しょうごうを えた！" : ""}`,
                "🛡️ ガーゼのたて を てにいれた！",
                "ワンポイント：\n・せなかを したから うえへ さするのも こうか あり\n・トントンは てのひらを まるめて かるく",
                "すうふん やっても でないときは むりしなくて OK。\nしばらく たてだっこで ようすを みよう。\nねかせたあとの はきもどしにも ちゅうい。",
              ]}
            />
          )}
          {phase === "fail" && (
            <Message
              lines={[
                "あかちゃんが ないてしまった……",
                "あかちゃんの からだは とても デリケート。\nつよく たたく ひつようは ないんだ。\nてのひらを まるめて やさしく リズミカルに。",
              ]}
            />
          )}
          {(phase === "success" || phase === "fail") && (
            <div className="flex justify-center gap-3">
              <Btn onClick={startPat}>もういちど</Btn>
              <Btn gold onClick={onBack}>
                マップへ
              </Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
