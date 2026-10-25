"use client";

import { useEffect, useRef, useState } from "react";
import type { ProgressApi } from "@/lib/papa/useProgress";
import { Bar, BackBar, Card, PrimaryButton } from "./ui";

const POSES = [
  {
    text: "縦抱きにして、赤ちゃんのあごをパパの肩にのせる",
    ok: true,
    feedback: "定番の「肩抱き」。肩にガーゼを1枚かけておくと吐き戻しても安心。",
  },
  {
    text: "仰向けに寝かせたまま、お腹をトントンする",
    ok: false,
    feedback: "寝たままだと空気が上に抜けにくいです。上体を起こしてあげよう。",
  },
  {
    text: "膝に座らせ、手であごと胸を支えて少し前かがみにする",
    ok: true,
    feedback: "首がすわる前でもできる「座らせ抱き」。あごを支える手は首を圧迫しないように。",
  },
  {
    text: "脇の下を持って高く持ち上げ、上下にゆらす",
    ok: false,
    feedback: "首が不安定で危険です！揺さぶるのも絶対にNG。",
  },
];

type Phase = "pose" | "pat" | "success" | "fail";
type Hit = { label: string; color: string; key: number };

export default function BurpGame({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("pose");
  const [poseWrong, setPoseWrong] = useState<number[]>([]);
  const [poseOk, setPoseOk] = useState<number | null>(null);

  const [cursor, setCursor] = useState(0);
  const [air, setAir] = useState(100);
  const [fuss, setFuss] = useState(0);
  const [hit, setHit] = useState<Hit | null>(null);
  const [tooStrong, setTooStrong] = useState(0);
  const dir = useRef(1);
  const pos = useRef(0);

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
    if (poseOk !== null) return;
    if (POSES[i].ok) setPoseOk(i);
    else setPoseWrong((w) => (w.includes(i) ? w : [...w, i]));
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
      setHit({ label: "強すぎ！😣", color: "var(--bad)", key });
      setTooStrong((n) => n + 1);
      const nf = Math.min(100, fuss + 38);
      setFuss(nf);
      if (nf >= 100) setPhase("fail");
      return;
    }
    let gain = 4;
    let label = "やさしすぎ…";
    let color = "var(--text-muted)";
    if (c >= 45 && c <= 55) {
      gain = 22;
      label = "パーフェクト！✨";
      color = "var(--good)";
    } else if (c >= 30) {
      gain = 13;
      label = "いい感じ！";
      color = "var(--papa)";
    }
    setHit({ label, color, key });
    const na = Math.max(0, air - gain);
    setAir(na);
    if (na === 0) {
      setPhase("success");
      api.award(tooStrong === 0 ? "burp-gentle" : "burp-clear", tooStrong === 0 ? 70 : 50);
    }
  }

  const baby =
    phase === "success" ? "😊" : phase === "fail" ? "😭" : fuss > 60 ? "😣" : fuss > 25 ? "😕" : "😌";

  return (
    <div>
      <BackBar title="💨 ゲップ名人チャレンジ" onBack={onBack} />

      {phase === "pose" && (
        <div className="fade-in">
          <Card className="mb-3 text-center">
            <div className="text-5xl mb-2">🍼👶</div>
            <p className="text-sm leading-relaxed">
              ミルクを飲み終わった赤ちゃん。お腹に空気がたまっています。
              <br />
              <b>STEP 1：</b>どう抱っこする？
            </p>
          </Card>
          <div className="flex flex-col gap-2 mb-3">
            {POSES.map((p, i) => {
              const wrong = poseWrong.includes(i);
              const right = poseOk === i;
              return (
                <button
                  key={i}
                  onClick={() => choosePose(i)}
                  className={`text-left rounded-xl px-4 py-3 text-sm ${wrong && poseWrong[poseWrong.length - 1] === i ? "shake" : ""}`}
                  style={{
                    background: right ? "var(--good-bg)" : wrong ? "var(--bad-bg)" : "var(--surface)",
                    border: `2px solid ${right ? "var(--good)" : wrong ? "var(--bad)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >
                  <span className="mr-2">{right ? "⭕" : wrong ? "❌" : "▶︎"}</span>
                  {p.text}
                  {(wrong || right) && (
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {p.feedback}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {poseOk !== null && (
            <div className="text-center">
              <PrimaryButton onClick={startPat}>STEP 2：トントンへ →</PrimaryButton>
            </div>
          )}
        </div>
      )}

      {phase !== "pose" && (
        <div className="fade-in">
          <Card className="mb-3 text-center relative overflow-hidden">
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              <span>🫧 お腹の空気</span>
              <span>😤 ごきげんナナメ度</span>
            </div>
            <div className="flex gap-3 mb-3">
              <Bar value={air} color="var(--papa)" />
              <Bar value={fuss} color="var(--bad)" />
            </div>

            <button
              onClick={pat}
              className={`text-8xl my-2 select-none ${phase === "pat" ? "wobble" : ""}`}
              style={{ background: "transparent", cursor: phase === "pat" ? "pointer" : "default", lineHeight: 1.1 }}
              aria-label="背中をトントン"
            >
              {baby}
            </button>

            {phase === "pat" && hit && (
              <div key={hit.key} className="pop-in font-bold text-sm" style={{ color: hit.color }}>
                {hit.label}
              </div>
            )}
            {phase === "success" && (
              <div className="pop-in text-3xl font-bold" style={{ color: "var(--papa)" }}>
                ゲフッ💨
              </div>
            )}
            {phase === "fail" && (
              <div className="pop-in text-lg font-bold" style={{ color: "var(--bad)" }}>
                びえ〜ん！強すぎたみたい…
              </div>
            )}
          </Card>

          {phase === "pat" && (
            <>
              <div className="relative mb-2 rounded-full overflow-hidden" style={{ height: 28 }}>
                <div className="absolute inset-0 flex">
                  <div style={{ width: "30%", background: "var(--surface-2)" }} />
                  <div style={{ width: "15%", background: "var(--papa-bg)" }} />
                  <div style={{ width: "10%", background: "var(--good)" }} />
                  <div style={{ width: "15%", background: "var(--papa-bg)" }} />
                  <div style={{ width: "30%", background: "var(--bad-bg)" }} />
                </div>
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: `calc(${cursor}% - 3px)`,
                    width: 6,
                    background: "var(--text)",
                    borderRadius: 3,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                <span>弱い</span>
                <span>ちょうどいい</span>
                <span>強すぎ</span>
              </div>
              <div className="text-center mb-3">
                <PrimaryButton onClick={pat} className="text-base px-10 py-4">
                  ✋ トントン
                </PrimaryButton>
              </div>
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                バーが緑のところでタップ！（赤ちゃんをタップしてもOK）
              </p>
            </>
          )}

          {phase === "success" && (
            <Card className="pop-in">
              <div className="font-bold mb-1">🏆 ゲップ成功！{tooStrong === 0 && "（やさしさボーナス）"}</div>
              <ul className="text-sm leading-relaxed list-disc pl-5">
                <li>背中を下から上へ、やさしくさするのも効果的</li>
                <li>トントンは手のひらを少し丸めて、ポンポンと軽く</li>
                <li>数分やっても出ないときは無理しなくてOK。しばらく縦抱きで様子を見よう</li>
                <li>寝かせた後の吐き戻しに注意して、近くで見守ろう</li>
              </ul>
            </Card>
          )}
          {phase === "fail" && (
            <Card className="pop-in">
              <p className="text-sm leading-relaxed">
                赤ちゃんの体はとってもデリケート。<b>強くたたく必要はありません。</b>
                手のひらを丸めて、やさしくリズミカルにトントンしよう。
              </p>
            </Card>
          )}
          {(phase === "success" || phase === "fail") && (
            <div className="text-center mt-3">
              <PrimaryButton onClick={startPat}>もう一回</PrimaryButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
