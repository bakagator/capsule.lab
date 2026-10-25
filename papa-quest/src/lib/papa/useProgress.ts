"use client";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { LEVEL_TITLES, XP_PER_LEVEL } from "./data";

const STORAGE_KEY = "papa_quest";

export type Progress = {
  xp: number;
  // XPを一度だけ付与するための獲得済みID
  earned: Record<string, number>;
  // 月ごとミッションのチェック状態
  missions: Record<string, boolean>;
};

const EMPTY: Progress = { xp: 0, earned: {}, missions: {} };

export function levelInfo(xp: number) {
  const maxLevel = LEVEL_TITLES.length;
  const level = Math.min(maxLevel, Math.floor(xp / XP_PER_LEVEL) + 1);
  const isMax = level === maxLevel;
  const into = isMax ? XP_PER_LEVEL : xp - (level - 1) * XP_PER_LEVEL;
  return { level, title: LEVEL_TITLES[level - 1], into, isMax };
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

export function useProgress() {
  const snapshot = useSyncExternalStore<Progress | null>(subscribe, read, () => null);
  const progress = snapshot ?? EMPTY;
  const loaded = snapshot !== null;
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const save = useCallback((updater: (p: Progress) => Progress) => {
    write(updater(read()));
  }, []);

  const award = useCallback(
    (id: string, amount: number) => {
      const current = read();
      if (current.earned[id] !== undefined) return false;
      const before = levelInfo(current.xp).level;
      const after = levelInfo(current.xp + amount).level;
      write({ ...current, xp: current.xp + amount, earned: { ...current.earned, [id]: amount } });
      if (amount === 0) return true;
      setToast(
        after > before
          ? `🎉 レベルアップ！ Lv.${after} ${LEVEL_TITLES[after - 1]}`
          : `+${amount} XP`
      );
      return true;
    },
    []
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

  return { progress, loaded, toast, award, toggleMission, reset };
}

export type ProgressApi = ReturnType<typeof useProgress>;
