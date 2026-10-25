"use client";

import { useState } from "react";
import { CASES } from "@/lib/rpg/data/cases";
import { ENEMIES } from "@/lib/rpg/data/enemies";
import { QUIZZES } from "@/lib/rpg/data/quizzes";
import { STORY } from "@/lib/rpg/data/story";
import { applyEffects, createSave, levelFromExp } from "@/lib/rpg/engine";
import { loadSave, useHasSave, writeSave } from "@/lib/rpg/storage";
import type { SaveData } from "@/lib/rpg/types";
import BattleScreen from "./BattleScreen";
import CaseScreen, { cashDeltaFor } from "./CaseScreen";
import CodexPanel from "./CodexPanel";
import QuizCard from "./QuizCard";
import { ChapterCard, DialogueScene, EndScene, LearnScene } from "./Scenes";
import { GameButton, GameWindow } from "./ui";

const union = (a: string[], b: string[] = []) => [...new Set([...a, ...b])];

function TitleScreen({ onStart }: { onStart: (save: SaveData) => void }) {
  const hasSave = useHasSave();
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");

  return (
    <GameWindow className="fade-in py-10 text-center">
      <p className="rpg-float select-none" style={{ fontSize: "56px" }} aria-hidden>
        🍡
      </p>
      <p className="mt-2 text-xs tracking-[0.3em]" style={{ color: "var(--rpg-gold)" }}>
        経営学RPG
      </p>
      <h1 className="mt-2 font-bold" style={{ fontSize: "28px" }}>
        つむぎ堂クロニクル
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--rpg-on-window-muted)" }}>
        小さな和菓子店から、経営を学ぶ物語
      </p>

      {!naming ? (
        <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2">
          {hasSave && (
            <GameButton
              variant="primary"
              className="text-center"
              onClick={() => {
                const save = loadSave();
                if (save) onStart(save);
              }}
            >
              つづきから
            </GameButton>
          )}
          <GameButton variant={hasSave ? "default" : "primary"} className="text-center" onClick={() => setNaming(true)}>
            はじめから
          </GameButton>
          <p className="mt-2 text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
            収録：序章「のれんを継ぐ日」・第1章「赤字の霧」
          </p>
        </div>
      ) : (
        <form
          className="mx-auto mt-8 flex max-w-xs flex-col gap-2 text-left"
          onSubmit={(e) => {
            e.preventDefault();
            onStart(createSave(name.trim() || "あなた"));
          }}
        >
          <label htmlFor="player-name" className="text-sm">
            主人公の名前
          </label>
          <input
            id="player-name"
            autoFocus
            maxLength={10}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="あなた"
            className="rounded-lg px-3 py-2.5 outline-none"
            style={{ background: "var(--rpg-window-2)", border: "2px solid var(--rpg-on-window-muted)", color: "var(--rpg-on-window)" }}
          />
          {hasSave && (
            <p className="text-xs" style={{ color: "var(--rpg-wrong)" }}>
              ※ 今のセーブデータは上書きされます
            </p>
          )}
          <GameButton type="submit" variant="primary" className="mt-2 text-center">
            店を継ぐ
          </GameButton>
          <GameButton type="button" variant="ghost" className="text-center" onClick={() => setNaming(false)}>
            もどる
          </GameButton>
        </form>
      )}
    </GameWindow>
  );
}

function StatusBar({
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
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-sm"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-bold">
          {save.playerName} <span style={{ color: "var(--primary)" }}>Lv.{levelFromExp(save.exp)}</span>
        </span>
        <span>💰 {company.cash}万円</span>
        <span title="ブランド">✨ {company.brand}</span>
        <span title="従業員満足">🤝 {company.employeeSatisfaction}</span>
        <span title="地域評価">🏘️ {company.communityReputation}</span>
      </div>
      <div className="flex gap-1">
        <button onClick={onCodex} className="rounded-lg px-2.5 py-1 font-bold" style={{ background: "var(--surface-2)" }}>
          📖 図鑑
        </button>
        <button onClick={onTitle} className="rounded-lg px-2.5 py-1" style={{ background: "var(--surface-2)" }}>
          タイトルへ
        </button>
      </div>
    </div>
  );
}

export default function RpgGame() {
  const [save, setSave] = useState<SaveData | null>(null);
  const [showCodex, setShowCodex] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function commit(next: SaveData) {
    if (save && levelFromExp(next.exp) > levelFromExp(save.exp)) {
      setToast(`レベルアップ！ Lv.${levelFromExp(next.exp)}`);
      setTimeout(() => setToast(null), 2500);
    }
    setSave(next);
    writeSave(next);
    window.scrollTo({ top: 0 });
  }

  if (!save) {
    return (
      <div className="rpg rpg-shell mx-auto max-w-2xl px-4 py-6">
        <TitleScreen onStart={setSave} />
      </div>
    );
  }

  const node = STORY[save.step];
  const advance = (patch: Partial<SaveData> = {}) => commit({ ...save, ...patch, step: save.step + 1 });

  let scene: React.ReactNode;
  switch (node.type) {
    case "chapter":
      scene = <ChapterCard {...node} onNext={() => advance()} />;
      break;
    case "dialogue":
      scene = <DialogueScene lines={node.lines} playerName={save.playerName} onNext={() => advance()} />;
      break;
    case "learn":
      scene = (
        <LearnScene
          {...node}
          onNext={() => {
            const items = { ...save.items };
            for (const [id, n] of Object.entries(node.items ?? {})) items[id] = (items[id] ?? 0) + n;
            advance({ skills: union(save.skills, node.skills), codex: union(save.codex, node.codex), items });
          }}
        />
      );
      break;
    case "quiz":
      scene = (
        <GameWindow className="fade-in">
          <p className="mb-3 font-bold" style={{ color: "var(--rpg-gold)" }}>
            🦉 {node.intro}
          </p>
          <QuizCard
            quiz={QUIZZES[node.quizId]}
            onDone={(firstTry) => advance({ exp: save.exp + (firstTry ? node.exp : Math.floor(node.exp / 2)) })}
          />
        </GameWindow>
      );
      break;
    case "battle":
      scene = (
        <BattleScreen
          enemy={ENEMIES[node.enemyId]}
          save={save}
          onVictory={(r) =>
            advance({
              exp: save.exp + r.exp,
              items: r.items,
              trapsUsed: save.trapsUsed + r.trapsUsed,
              company: { ...save.company, cash: r.cash, brand: r.brand },
              defeated: union(save.defeated, [node.enemyId]),
            })
          }
        />
      );
      break;
    case "case": {
      const caseData = CASES[node.caseId];
      scene = (
        <CaseScreen
          caseData={caseData}
          onDone={(option, reasoningCorrect) =>
            advance({
              exp: save.exp + caseData.exp + (reasoningCorrect ? 20 : 0),
              company: applyEffects(save.company, { ...option.effects, cash: cashDeltaFor(caseData, option) }),
              decisions: { ...save.decisions, [caseData.id]: { optionId: option.id, reasoningCorrect } },
            })
          }
        />
      );
      break;
    }
    case "end":
      scene = (
        <EndScene
          save={save}
          onCodex={() => setShowCodex(true)}
          onTitle={() => setSave(null)}
        />
      );
      break;
  }

  return (
    <div className="rpg rpg-shell mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
      <StatusBar save={save} onCodex={() => setShowCodex(true)} onTitle={() => setSave(null)} />
      <div key={save.step}>{scene}</div>
      {showCodex && <CodexPanel save={save} onClose={() => setShowCodex(false)} />}
      {toast && (
        <div
          className="rpg-toast pop-in fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold shadow-lg"
          style={{ background: "var(--rpg-gold)", color: "#1f2442" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
