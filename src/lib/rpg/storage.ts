"use client";
import { useSyncExternalStore } from "react";
import type { SaveData } from "./types";

const STORAGE_KEY = "tsumugi_rpg_save_v1";
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function loadSave(): SaveData | null {
  const raw = readRaw();
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as SaveData;
    return data.version === 1 ? data : null;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 保存できない環境（プライベートモードなど）でも遊べるようにする
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useHasSave(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => loadSave() !== null,
    () => false,
  );
}
