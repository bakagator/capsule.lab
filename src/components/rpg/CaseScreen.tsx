"use client";

import { useState } from "react";
import { breakEvenVolume, contributionMargin, monthlyProfit } from "@/lib/rpg/engine";
import type { CaseDecision, CaseOption, UnitEconomics } from "@/lib/rpg/types";
import { GameButton, GameWindow } from "./ui";

type Phase = "situation" | "choose" | "reasoning" | "outcome";

const yen = (v: number) => `${v < 0 ? "−" : ""}${Math.abs(v).toLocaleString()}円`;

const EFFECT_LABELS: Record<string, string> = {
  brand: "ブランド",
  employeeSatisfaction: "従業員満足",
  communityReputation: "地域評価",
};

export function cashDeltaFor(caseData: CaseDecision, option: CaseOption) {
  return Math.round((monthlyProfit(option.economics) * caseData.months) / 10000);
}

function PlTable({ columns }: { columns: { label: string; e: UnitEconomics; highlight?: boolean }[] }) {
  const rows: { label: string; value: (e: UnitEconomics) => string; strong?: boolean }[] = [
    { label: "価格", value: (e) => yen(e.price) },
    { label: "変動費（1個）", value: (e) => yen(e.variableCost) },
    { label: "貢献利益（1個）", value: (e) => yen(contributionMargin(e)) },
    { label: "販売数（月）", value: (e) => `${e.volume.toLocaleString()}個` },
    { label: "固定費（月）", value: (e) => yen(e.fixedCost) },
    { label: "損益分岐点", value: (e) => `${breakEvenVolume(e).toLocaleString()}個` },
    { label: "月の利益", value: (e) => yen(monthlyProfit(e)), strong: true },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th />
            {columns.map((c) => (
              <th
                key={c.label}
                className="px-2 py-1.5 text-right text-xs"
                style={{ color: c.highlight ? "var(--rpg-gold)" : "var(--rpg-on-window-muted)" }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <td className="whitespace-nowrap py-1.5 pr-2 text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
                {r.label}
              </td>
              {columns.map((c) => {
                const profit = monthlyProfit(c.e);
                return (
                  <td
                    key={c.label}
                    className="whitespace-nowrap px-2 py-1.5 text-right"
                    style={{
                      fontWeight: r.strong ? 700 : 400,
                      color: r.strong ? (profit >= 0 ? "var(--rpg-correct)" : "var(--rpg-wrong)") : undefined,
                    }}
                  >
                    {r.value(c.e)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CaseScreen({
  caseData,
  onDone,
}: {
  caseData: CaseDecision;
  onDone: (option: CaseOption, reasoningCorrect: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("situation");
  const [option, setOption] = useState<CaseOption | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const reasoningCorrect = option !== null && reason === option.consistentReason;

  return (
    <GameWindow className="fade-in">
      <p className="text-xs font-bold tracking-widest" style={{ color: "var(--rpg-gold)" }}>
        CASE DECISION
      </p>
      <h2 className="mt-1 font-bold" style={{ fontSize: "19px" }}>
        {caseData.title}
      </h2>

      {phase === "situation" && (
        <div className="fade-in mt-3">
          <div className="flex flex-col gap-2 text-sm leading-relaxed">
            {caseData.situation.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-3" style={{ background: "var(--rpg-window-2)" }}>
            <PlTable columns={[{ label: "現在", e: caseData.current }]} />
          </div>
          <GameButton variant="primary" className="mt-4 w-full text-center" autoFocus onClick={() => setPhase("choose")}>
            打ち手を選ぶ
          </GameButton>
        </div>
      )}

      {phase === "choose" && (
        <div className="fade-in mt-3 flex flex-col gap-2">
          <p className="text-sm" style={{ color: "var(--rpg-on-window-muted)" }}>
            正解はひとつではありません。数字と、お店に関わる人たちへの影響の両方を考えて選びましょう。
          </p>
          {caseData.options.map((o) => (
            <GameButton
              key={o.id}
              onClick={() => {
                setOption(o);
                setPhase("reasoning");
              }}
            >
              {o.label}
              <span className="mt-0.5 block text-xs font-normal" style={{ color: "var(--rpg-on-window-muted)" }}>
                {o.detail}
              </span>
            </GameButton>
          ))}
        </div>
      )}

      {phase === "reasoning" && option && (
        <div className="fade-in mt-3">
          <p className="text-sm">
            選んだ打ち手：<span className="font-bold" style={{ color: "var(--rpg-gold)" }}>{option.label}</span>
          </p>
          <p className="mt-3 font-bold">🦉 その判断の根拠として、最も筋が通っているのはどれじゃ？</p>
          <div className="mt-3 flex flex-col gap-2">
            {option.reasons.map((r, i) => (
              <GameButton key={r} onClick={() => setReason(i)} style={reason === i ? { borderColor: "var(--rpg-gold)" } : undefined}>
                {reason === i ? "▶ " : "・"}
                {r}
              </GameButton>
            ))}
          </div>
          <GameButton
            variant="primary"
            className="mt-4 w-full text-center"
            disabled={reason === null}
            onClick={() => setPhase("outcome")}
          >
            決断する
          </GameButton>
        </div>
      )}

      {phase === "outcome" && option && (
        <div className="fade-in mt-3">
          <p className="text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
            ── {caseData.months}か月後 ──
          </p>
          <p className="mt-2 text-sm leading-relaxed">{option.outcome}</p>

          <div className="mt-4 rounded-lg p-3" style={{ background: "var(--rpg-window-2)" }}>
            <PlTable
              columns={[
                { label: "以前", e: caseData.current },
                { label: "決断後", e: option.economics, highlight: true },
              ]}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>
              資金：
              <b style={{ color: cashDeltaFor(caseData, option) >= 0 ? "var(--rpg-correct)" : "var(--rpg-wrong)" }}>
                {cashDeltaFor(caseData, option) >= 0 ? "+" : ""}
                {cashDeltaFor(caseData, option)}万円
              </b>
              （{caseData.months}か月分）
            </span>
            {Object.entries(option.effects).map(([k, v]) => (
              <span key={k}>
                {EFFECT_LABELS[k]}：
                <b style={{ color: v >= 0 ? "var(--rpg-correct)" : "var(--rpg-wrong)" }}>
                  {v >= 0 ? "+" : ""}
                  {v}
                </b>
              </span>
            ))}
          </div>

          <p className="mt-3 rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(232,184,74,0.12)" }}>
            ⚖️ トレードオフ：{option.tradeoff}
          </p>

          <div className="mt-3 rounded-lg px-3 py-2 text-sm leading-relaxed" style={{ background: "var(--rpg-window-2)" }}>
            <p className="font-bold" style={{ color: reasoningCorrect ? "var(--rpg-correct)" : "var(--rpg-wrong)" }}>
              {reasoningCorrect ? "◎ 判断の筋道が一貫しておる！" : "△ 打ち手と根拠がかみ合っておらんようじゃ"}
            </p>
            {!reasoningCorrect && <p className="mt-1">筋の通った根拠：「{option.reasons[option.consistentReason]}」</p>}
            <p className="mt-1">🦉 {option.reasonFeedback}</p>
          </div>

          <button
            className="mt-3 text-sm underline"
            style={{ color: "var(--rpg-on-window-muted)" }}
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "▲ 閉じる" : "▼ もしも、ほかの打ち手を選んでいたら？"}
          </button>
          {showAll && (
            <div className="fade-in mt-2 rounded-lg p-3" style={{ background: "var(--rpg-window-2)" }}>
              <PlTable
                columns={caseData.options.map((o) => ({
                  label: o.label.replace(/（.*）/, ""),
                  e: o.economics,
                  highlight: o.id === option.id,
                }))}
              />
              <p className="mt-2 text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
                利益だけで見れば差は小さい。どの打ち手にも、数字に表れない影響（ブランド・従業員・地域）がある。
              </p>
            </div>
          )}

          <GameButton
            variant="primary"
            className="mt-4 w-full text-center"
            onClick={() => onDone(option, reasoningCorrect)}
          >
            つぎへ
          </GameButton>
        </div>
      )}
    </GameWindow>
  );
}
