"use client";

import { CODEX } from "@/lib/rpg/data/codex";
import { SKILLS } from "@/lib/rpg/data/skills";
import { ENEMIES } from "@/lib/rpg/data/enemies";
import type { SaveData } from "@/lib/rpg/types";
import { GameButton, GameWindow } from "./ui";

export default function CodexPanel({ save, onClose }: { save: SaveData; onClose: () => void }) {
  const entries = Object.values(CODEX);
  return (
    <div
      className="rpg-overlay fixed inset-0 z-[60] overflow-y-auto px-4 py-20"
      style={{ background: "rgba(15,17,35,0.6)" }}
      onClick={onClose}
    >
      <div className="mx-auto max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <GameWindow className="pop-in">
          <div className="flex items-center justify-between">
            <h2 className="font-bold" style={{ fontSize: "19px" }}>
              📖 経営学図鑑
            </h2>
            <span className="text-sm" style={{ color: "var(--rpg-gold)" }}>
              {save.codex.length} / {entries.length}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {entries.map((entry) => {
              const known = save.codex.includes(entry.id);
              return (
                <div key={entry.id} className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--rpg-window-2)" }}>
                  <p className="text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
                    {entry.category}
                  </p>
                  <p className="font-bold">{known ? entry.term : "？？？"}</p>
                  {known && (
                    <p className="mt-0.5 leading-relaxed" style={{ color: "var(--rpg-on-window-muted)" }}>
                      {entry.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="mt-5 font-bold">⚔️ 習得スキル</h3>
          <div className="mt-2 flex flex-col gap-2">
            {save.skills.length === 0 && (
              <p className="text-sm" style={{ color: "var(--rpg-on-window-muted)" }}>
                まだありません
              </p>
            )}
            {save.skills.map((id) => (
              <div key={id} className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--rpg-window-2)" }}>
                <p className="font-bold">{SKILLS[id].name}</p>
                <p className="mt-0.5" style={{ color: "var(--rpg-on-window-muted)" }}>
                  {SKILLS[id].description}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mt-5 font-bold">👹 乗り越えた課題</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {save.defeated.length === 0 && <p style={{ color: "var(--rpg-on-window-muted)" }}>まだありません</p>}
            {save.defeated.map((id) => (
              <span key={id} className="rounded-full px-3 py-1" style={{ background: "var(--rpg-window-2)" }}>
                {ENEMIES[id].emoji} {ENEMIES[id].name}
              </span>
            ))}
          </div>

          <GameButton variant="primary" className="mt-5 w-full text-center" onClick={onClose}>
            とじる
          </GameButton>
        </GameWindow>
      </div>
    </div>
  );
}
