"use client";
import { useSyncExternalStore } from "react";

// 8bit風の効果音。赤ちゃんが寝ている時のため、初期設定はOFF
const KEY = "papa_quest_sound";
const listeners = new Set<() => void>();
let enabled = false;
let loadedPref = false;
let ctx: AudioContext | null = null;

function loadPref() {
  if (loadedPref) return;
  loadedPref = true;
  try {
    enabled = localStorage.getItem(KEY) === "on";
  } catch {
    enabled = false;
  }
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // 保存できなくても動作は継続
  }
  listeners.forEach((l) => l());
  if (on) play("select");
}

export function useSound() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      loadPref();
      return enabled;
    },
    () => false
  );
}

type Note = [freq: number, start: number, dur: number];

const SOUNDS: Record<string, { wave: OscillatorType; notes: Note[]; vol?: number }> = {
  blip: { wave: "square", notes: [[1200, 0, 0.02]], vol: 0.02 },
  select: { wave: "square", notes: [[660, 0, 0.05], [990, 0.05, 0.07]] },
  hit: { wave: "square", notes: [[440, 0, 0.05], [330, 0.05, 0.05], [220, 0.1, 0.08]] },
  damage: { wave: "sawtooth", notes: [[140, 0, 0.12], [90, 0.12, 0.18]] },
  miss: { wave: "triangle", notes: [[300, 0, 0.1], [200, 0.1, 0.15]] },
  win: { wave: "square", notes: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.1], [1047, 0.3, 0.25]] },
  levelup: {
    wave: "square",
    notes: [[784, 0, 0.12], [784, 0.14, 0.12], [784, 0.28, 0.12], [1047, 0.42, 0.45], [988, 0.42, 0.45]],
  },
  lose: { wave: "triangle", notes: [[392, 0, 0.25], [330, 0.25, 0.25], [262, 0.5, 0.5]] },
};

export function play(name: keyof typeof SOUNDS) {
  loadPref();
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    const s = SOUNDS[name];
    const now = ctx.currentTime;
    for (const [freq, start, dur] of s.notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = s.wave;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(s.vol ?? 0.05, now + start);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    }
  } catch {
    // 音が鳴らせない環境では無視
  }
}
