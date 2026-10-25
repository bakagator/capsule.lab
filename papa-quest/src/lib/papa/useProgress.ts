"use client";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { LEVEL_TITLES, XP_PER_LEVEL } from "./data";
import { LOG_XP_PER_DAY, today, trustPoints, trustRank, type LogEntry, type Wish } from "./life";

const STORAGE_KEY = "papa_quest";

export type Progress = {
  xp: number;
  // XPを一度だけ付与するための獲得済みID
  earned: Record<string, number>;
  // 月ごとミッションのチェック状態
  missions: Record<string, boolean>;
  // 主人公の名前（空なら未開始）
  name: string;
  // 現在のHP（null は満タン）
  hp: number | null;
  // きずなの泉の日記
  logs: LogEntry[];
  // やりたいことリスト
  wishes: Wish[];
};

const EMPTY: Progress = { xp: 0, earned: {}, missions: {}, name: "", hp: null, logs: [], wishes: [] };

export function levelInfo(xp: number) {
  const maxLevel = LEVEL_TITLES.length;
  const level = Math.min(maxLevel, Math.floor(xp / XP_PER_LEVEL) + 1);
  const isMax = level === maxLevel;
  const into = isMax ? XP_PER_LEVEL : xp - (level - 1) * XP_PER_LEVEL;
  return { level, title: LEVEL_TITLES[level - 1], into, isMax };
}

export function maxHp(level: number) {
  return 40 + level * 10;
}

export function trustOf(p: Progress) {
  const points = trustPoints(p.logs, p.wishes, p.earned["care-clear"] !== undefined);
  return { points, ...trustRank(points) };
}

// 最大HPはレベル＋ママの信頼度ボーナス
export function hpMax(p: Progress) {
  return maxHp(levelInfo(p.xp).level) + trustOf(p).hpBonus;
}

export function currentHp(p: Progress) {
  const max = hpMax(p);
  return p.hp === null ? max : Math.min(p.hp, max);
}

// localStorage を外部ストアとして扱う（使えない環境ではメモリに保持）
const listeners = new Set<() => void>();
let memoryRaw: string | null = null;
let cachedRaw: string | null | undefined;
let cached: Progress = EMPTY;

function loadRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

function read(): Progress {
  const raw = loadRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    } catch {
      cached = EMPTY;
    }
  }
  return cached;
}

function write(next: Progress) {
  memoryRaw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, memoryRaw);
  } catch {
    // プライベートモードなどで保存できない場合はメモリのみ
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export type Toast = { text: string; levelUp: boolean; level: number };

export function useProgress() {
  const snapshot = useSyncExternalStore<Progress | null>(subscribe, read, () => null);
  const progress = snapshot ?? EMPTY;
  const loaded = snapshot !== null;
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast || toast.levelUp) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const save = useCallback((updater: (p: Progress) => Progress) => {
    write(updater(read()));
  }, []);

  const award = useCallback((id: string, amount: number) => {
    const current = read();
    if (current.earned[id] !== undefined) return false;
    const before = levelInfo(current.xp).level;
    const after = levelInfo(current.xp + amount).level;
    write({
      ...current,
      xp: current.xp + amount,
      earned: { ...current.earned, [id]: amount },
      // レベルが上がったらHP全回復
      hp: after > before ? null : current.hp,
    });
    if (amount === 0) return true;
    setToast({
      text: after > before ? `レベルが あがった！` : `けいけんち ${amount} かくとく！`,
      levelUp: after > before,
      level: after,
    });
    return true;
  }, []);

  const damage = useCallback((amount: number) => {
    const current = read();
    const hp = Math.max(0, currentHp(current) - amount);
    write({ ...current, hp });
    return hp;
  }, []);

  const heal = useCallback(() => save((p) => ({ ...p, hp: null })), [save]);

  const setName = useCallback(
    (name: string) => save((p) => ({ ...p, name })),
    [save]
  );

  const toggleMission = useCallback(
    (key: string) => {
      save((p) => ({ ...p, missions: { ...p.missions, [key]: !p.missions[key] } }));
    },
    [save]
  );

  const reset = useCallback(() => {
    save(() => EMPTY);
  }, [save]);

  const dismissToast = useCallback(() => setToast(null), []);

  const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  const addLog = useCallback(
    (cat: string, text: string) => {
      const date = today();
      const n = read().logs.filter((l) => l.date === date).length;
      save((p) => ({ ...p, logs: [{ id: newId(), date, cat, text: text.trim() }, ...p.logs] }));
      // 1日 LOG_XP_PER_DAY 件までは経験値も入る
      if (n < LOG_XP_PER_DAY) award(`log-${date}-${n}`, 10);
      return n < LOG_XP_PER_DAY;
    },
    [save, award]
  );

  const deleteLog = useCallback(
    (id: string) => save((p) => ({ ...p, logs: p.logs.filter((l) => l.id !== id) })),
    [save]
  );

  const addWish = useCallback(
    (text: string) => save((p) => ({ ...p, wishes: [...p.wishes, { id: newId(), text: text.trim(), done: false }] })),
    [save]
  );

  const toggleWish = useCallback(
    (id: string) => {
      const w = read().wishes.find((x) => x.id === id);
      if (!w) return;
      save((p) => ({
        ...p,
        wishes: p.wishes.map((x) => (x.id === id ? { ...x, done: !x.done, doneAt: !x.done ? today() : undefined } : x)),
      }));
      if (!w.done) award(`wish-${id}`, 15);
    },
    [save, award]
  );

  const deleteWish = useCallback(
    (id: string) => save((p) => ({ ...p, wishes: p.wishes.filter((w) => w.id !== id) })),
    [save]
  );

  return {
    progress,
    loaded,
    toast,
    dismissToast,
    award,
    damage,
    heal,
    setName,
    toggleMission,
    reset,
    addLog,
    deleteLog,
    addWish,
    toggleWish,
    deleteWish,
  };
}

export type ProgressApi = ReturnType<typeof useProgress>;
