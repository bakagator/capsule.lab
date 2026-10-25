"use client";

import { useState } from "react";
import { SKILLS, ITEMS } from "@/lib/rpg/data/skills";
import { QUIZZES } from "@/lib/rpg/data/quizzes";
import {
  BASIC_ACTION,
  createBattle,
  isWeaknessRevealed,
  levelFromExp,
  resolveTurn,
  type BattleAction,
  type BattleState,
} from "@/lib/rpg/engine";
import type { Enemy, SaveData } from "@/lib/rpg/types";
import QuizCard from "./QuizCard";
import { GameButton, GameWindow, StatBar } from "./ui";

export type BattleResult = {
  cash: number;
  brand: number;
  items: Record<string, number>;
  trapsUsed: number;
  exp: number;
};

type Menu = "command" | "skills" | "items" | "analyze";

export default function BattleScreen({
  enemy,
  save,
  onVictory,
}: {
  enemy: Enemy;
  save: SaveData;
  onVictory: (result: BattleResult) => void;
}) {
  const [state, setState] = useState<BattleState>(() => createBattle(enemy, save));
  const [menu, setMenu] = useState<Menu>("command");
  const [hit, setHit] = useState(false);

  const level = levelFromExp(save.exp);
  const revealed = isWeaknessRevealed(enemy, state);
  const maxCash = Math.max(save.company.cash, state.cash);
  const nextQuizId = enemy.revealQuizzes[state.solved];
  const skills = save.skills.map((id) => SKILLS[id]);
  const items = Object.entries(state.items).filter(([, n]) => n > 0);

  function act(action: BattleAction) {
    const next = resolveTurn(state, action, enemy, level);
    if (next.enemyHp < state.enemyHp) {
      setHit(true);
      setTimeout(() => setHit(false), 300);
    }
    setState(next);
    setMenu("command");
  }

  function retry() {
    setState(createBattle(enemy, save));
    setMenu("command");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 敵 */}
      <GameWindow>
        <div className="flex items-center gap-4">
          <div
            className={`select-none ${state.status === "victory" ? "opacity-20" : "rpg-float"} ${hit ? "rpg-shake" : ""}`}
            style={{ fontSize: "56px", lineHeight: 1 }}
            aria-hidden
          >
            {enemy.emoji}
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ fontSize: "18px" }}>
              {enemy.name}
            </p>
            <div className="mt-2">
              <StatBar label="課題の深刻度" value={state.enemyHp} max={enemy.hp} color="var(--rpg-enemy)" />
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
              弱点：
              <span style={{ color: revealed ? "var(--rpg-gold)" : undefined }}>
                {revealed ? enemy.weaknesses.map((id) => SKILLS[id].name).join("・") : "???（分析で判明）"}
              </span>
            </p>
          </div>
        </div>
      </GameWindow>

      {/* ログ */}
      <GameWindow className="min-h-[7.5rem]">
        <div className="flex flex-col gap-1 text-sm leading-relaxed">
          {state.log.slice(-4).map((line, i, arr) => (
            <p key={state.log.length - arr.length + i} className="fade-in" style={{ opacity: i === arr.length - 1 ? 1 : 0.65 }}>
              {line}
            </p>
          ))}
        </div>
      </GameWindow>

      {/* 自分 */}
      <GameWindow>
        <div className="grid grid-cols-2 gap-4">
          <StatBar label="資金（HP）" value={state.cash} max={maxCash} color="var(--rpg-cash)" unit="万" />
          <StatBar label="体力（MP）" value={state.mp} max={state.maxMp} color="var(--rpg-mp)" />
        </div>
      </GameWindow>

      {/* コマンド */}
      <GameWindow>
        {state.status === "victory" && (
          <div className="fade-in">
            <p className="font-bold" style={{ color: "var(--rpg-gold)", fontSize: "17px" }}>
              🎉 {enemy.name}を乗り越えた！
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
              {enemy.debrief.map((line) => (
                <p key={line}>🦉 {line}</p>
              ))}
              {state.lessons.map((lesson) => (
                <p key={lesson} className="rounded-lg px-3 py-2" style={{ background: "rgba(224,103,95,0.15)" }}>
                  ⚠️ {lesson}
                </p>
              ))}
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--rpg-gold)" }}>
              経験値 +{enemy.exp}
              {levelFromExp(save.exp + enemy.exp) > level && `　レベルアップ！ Lv.${levelFromExp(save.exp + enemy.exp)}`}
            </p>
            <GameButton
              variant="primary"
              className="mt-4 w-full text-center"
              autoFocus
              onClick={() =>
                onVictory({
                  cash: state.cash,
                  brand: state.brand,
                  items: state.items,
                  trapsUsed: state.trapsUsed,
                  exp: enemy.exp,
                })
              }
            >
              つぎへ
            </GameButton>
          </div>
        )}

        {state.status === "defeat" && (
          <div className="fade-in">
            <p className="font-bold" style={{ color: "var(--rpg-wrong)", fontSize: "17px" }}>
              💸 資金ショート……
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              🦉 どれだけ売上や利益があっても、支払うお金が尽きれば店は続けられん。まずは分析で敵の正体を見抜き、弱点を突くのじゃ。
            </p>
            {state.lessons.map((lesson) => (
              <p key={lesson} className="mt-2 rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(224,103,95,0.15)" }}>
                ⚠️ {lesson}
              </p>
            ))}
            <GameButton variant="primary" className="mt-4 w-full text-center" autoFocus onClick={retry}>
              もう一度挑む
            </GameButton>
          </div>
        )}

        {state.status === "ongoing" && menu === "command" && (
          <div className="grid grid-cols-2 gap-2">
            <GameButton onClick={() => setMenu("skills")}>⚔️ スキル</GameButton>
            <GameButton onClick={() => setMenu("analyze")} disabled={!nextQuizId}>
              🔍 分析{nextQuizId ? "" : "（完了）"}
            </GameButton>
            <GameButton onClick={() => act({ type: "basic" })}>🧹 {BASIC_ACTION.name}</GameButton>
            <GameButton onClick={() => setMenu("items")} disabled={items.length === 0}>
              🎒 アイテム
            </GameButton>
          </div>
        )}

        {state.status === "ongoing" && menu === "skills" && (
          <div className="flex flex-col gap-2">
            {skills.map((skill) => (
              <GameButton
                key={skill.id}
                disabled={state.mp < skill.mpCost}
                onClick={() => act({ type: "skill", skill })}
              >
                <span className="flex justify-between gap-2">
                  <span>{skill.name}</span>
                  <span style={{ color: "var(--rpg-mp)" }}>MP {skill.mpCost}</span>
                </span>
                <span className="mt-0.5 block text-xs font-normal" style={{ color: "var(--rpg-on-window-muted)" }}>
                  {skill.description}
                </span>
              </GameButton>
            ))}
            {enemy.traps.length > 0 && (
              <>
                <p className="mt-1 text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
                  ── 思いついた手段 ──
                </p>
                {enemy.traps.map((trap) => (
                  <GameButton key={trap.id} onClick={() => act({ type: "trap", trap })}>
                    {trap.name}
                    <span className="mt-0.5 block text-xs font-normal" style={{ color: "var(--rpg-on-window-muted)" }}>
                      {trap.description}
                    </span>
                  </GameButton>
                ))}
              </>
            )}
            <GameButton variant="ghost" onClick={() => setMenu("command")}>
              ← もどる
            </GameButton>
          </div>
        )}

        {state.status === "ongoing" && menu === "items" && (
          <div className="flex flex-col gap-2">
            {items.map(([id, count]) => (
              <GameButton
                key={id}
                disabled={state.mp >= state.maxMp}
                onClick={() => act({ type: "item", itemId: id, name: ITEMS[id].name, mp: ITEMS[id].mp })}
              >
                {ITEMS[id].name} ×{count}
                <span className="mt-0.5 block text-xs font-normal" style={{ color: "var(--rpg-on-window-muted)" }}>
                  {ITEMS[id].description}
                </span>
              </GameButton>
            ))}
            <GameButton variant="ghost" onClick={() => setMenu("command")}>
              ← もどる
            </GameButton>
          </div>
        )}

        {state.status === "ongoing" && menu === "analyze" && nextQuizId && (
          <div>
            <p className="mb-3 text-xs" style={{ color: "var(--rpg-gold)" }}>
              🔍 分析 {state.solved + 1} / {enemy.revealQuizzes.length}　一発正解でボーナスダメージ！
            </p>
            <QuizCard
              key={nextQuizId}
              quiz={QUIZZES[nextQuizId]}
              onDone={(firstTry) => act({ type: "analyze", firstTry })}
            />
          </div>
        )}
      </GameWindow>
    </div>
  );
}
