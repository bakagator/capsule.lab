"use client";

import { useState } from "react";
import { CODEX } from "@/lib/rpg/data/codex";
import { ITEMS, SKILLS } from "@/lib/rpg/data/skills";
import { SPEAKERS } from "@/lib/rpg/data/story";
import { levelFromExp } from "@/lib/rpg/engine";
import type { Line, SaveData } from "@/lib/rpg/types";
import { fillName, GameButton, GameWindow } from "./ui";

export function ChapterCard({
  label,
  title,
  subtitle,
  onNext,
}: {
  label: string;
  title: string;
  subtitle: string;
  onNext: () => void;
}) {
  return (
    <GameWindow className="fade-in py-12 text-center">
      <p className="text-sm tracking-[0.3em]" style={{ color: "var(--rpg-gold)" }}>
        {label}
      </p>
      <h2 className="mt-3 font-bold" style={{ fontSize: "28px" }}>
        {title}
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--rpg-on-window-muted)" }}>
        ── {subtitle} ──
      </p>
      <GameButton variant="primary" className="mt-8 text-center" autoFocus onClick={onNext}>
        はじめる
      </GameButton>
    </GameWindow>
  );
}

export function DialogueScene({
  lines,
  playerName,
  onNext,
}: {
  lines: Line[];
  playerName: string;
  onNext: () => void;
}) {
  const [index, setIndex] = useState(0);
  const line = lines[index];
  const speaker = SPEAKERS[line.speaker];
  const isLast = index === lines.length - 1;

  function advance() {
    if (isLast) onNext();
    else setIndex(index + 1);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 既読のセリフ */}
      <div className="flex flex-col gap-1.5 px-1">
        {lines.slice(Math.max(0, index - 3), index).map((l, i) => (
          <p key={`${index}-${i}`} className="text-sm" style={{ color: "var(--text-muted)" }}>
            {SPEAKERS[l.speaker].icon} {fillName(l.text, playerName)}
          </p>
        ))}
      </div>
      <div onClick={advance} className="cursor-pointer select-none">
        <GameWindow className="min-h-[9rem]">
          {speaker.name && (
            <p className="mb-2 font-bold" style={{ color: "var(--rpg-gold)" }}>
              {speaker.icon} {fillName(speaker.name, playerName)}
            </p>
          )}
          <p
            key={index}
            className="fade-in leading-relaxed"
            style={{ fontSize: "16px", fontStyle: line.speaker === "narration" ? "italic" : undefined }}
          >
            {fillName(line.text, playerName)}
          </p>
          <div className="mt-3 flex items-center justify-end gap-3 text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
            <span>
              {index + 1} / {lines.length}
            </span>
            <button
              autoFocus
              onClick={(e) => {
                e.stopPropagation();
                advance();
              }}
              className="rounded px-2 py-1 font-bold"
              style={{ color: "var(--rpg-gold)" }}
            >
              {isLast ? "▶ つぎへ" : "▼ すすむ"}
            </button>
          </div>
        </GameWindow>
      </div>
    </div>
  );
}

export function LearnScene({
  skills = [],
  codex = [],
  items = {},
  onNext,
}: {
  skills?: string[];
  codex?: string[];
  items?: Record<string, number>;
  onNext: () => void;
}) {
  return (
    <GameWindow className="fade-in">
      {skills.length > 0 && (
        <>
          <p className="font-bold" style={{ color: "var(--rpg-gold)", fontSize: "17px" }}>
            ✨ スキルを習得した！
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {skills.map((id) => (
              <div key={id} className="rounded-lg px-3 py-2" style={{ background: "var(--rpg-window-2)" }}>
                <p className="font-bold">
                  {SKILLS[id].name}
                  <span className="ml-2 text-xs font-normal" style={{ color: "var(--rpg-mp)" }}>
                    MP {SKILLS[id].mpCost}
                  </span>
                </p>
                <p className="mt-0.5 text-sm" style={{ color: "var(--rpg-on-window-muted)" }}>
                  {SKILLS[id].description}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      {codex.length > 0 && (
        <>
          <p className="mt-4 font-bold" style={{ color: "var(--rpg-gold)" }}>
            📖 経営学図鑑に登録
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {codex.map((id) => (
              <div key={id} className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--rpg-window-2)" }}>
                <p className="font-bold">{CODEX[id].term}</p>
                <p className="mt-0.5 leading-relaxed" style={{ color: "var(--rpg-on-window-muted)" }}>
                  {CODEX[id].body}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      {Object.keys(items).length > 0 && (
        <p className="mt-4 text-sm">
          🎒{" "}
          {Object.entries(items)
            .map(([id, n]) => `${ITEMS[id].name}×${n}`)
            .join("、")}
          を手に入れた！
        </p>
      )}
      <GameButton variant="primary" className="mt-4 w-full text-center" autoFocus onClick={onNext}>
        つぎへ
      </GameButton>
    </GameWindow>
  );
}

export function EndScene({
  save,
  onCodex,
  onTitle,
}: {
  save: SaveData;
  onCodex: () => void;
  onTitle: () => void;
}) {
  const { company } = save;
  return (
    <GameWindow className="fade-in">
      <p className="text-center text-sm tracking-[0.3em]" style={{ color: "var(--rpg-gold)" }}>
        第1章 クリア
      </p>
      <h2 className="mt-2 text-center font-bold" style={{ fontSize: "22px" }}>
        つむぎ堂、再出発
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
        {[
          ["経営者レベル", `Lv.${levelFromExp(save.exp)}`],
          ["資金", `${company.cash}万円`],
          ["ブランド", company.brand],
          ["従業員満足", company.employeeSatisfaction],
          ["地域評価", company.communityReputation],
          ["習得スキル", `${save.skills.length}個`],
          ["図鑑", `${save.codex.length} / ${Object.keys(CODEX).length}`],
          ["罠コマンド使用", `${save.trapsUsed}回`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg px-3 py-2" style={{ background: "var(--rpg-window-2)" }}>
            <p className="text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
              {k}
            </p>
            <p className="font-bold">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed">
        🦉 {save.trapsUsed === 0
          ? "罠に一度もかからずに乗り切るとは、見事な判断力じゃ。"
          : "目先の手に頼った場面もあったのう。罠の教訓は、きっと次に生きるはずじゃ。"}
      </p>
      <p className="mt-4 text-center text-sm" style={{ color: "var(--rpg-on-window-muted)" }}>
        第2章「お客様は誰だ」— マーケティングの基礎 — は次のアップデートで公開予定
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <GameButton className="text-center" onClick={onCodex}>
          📖 図鑑を見る
        </GameButton>
        <GameButton className="text-center" onClick={onTitle}>
          タイトルへ
        </GameButton>
      </div>
    </GameWindow>
  );
}
