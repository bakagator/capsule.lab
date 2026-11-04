"use client";
import { useState, useEffect, useCallback } from "react";
import type { Hitorigoto, Scene } from "./types";

const STORAGE_KEY = "matsuda_honne_tatemae";

const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();

const SEED: Hitorigoto[] = [
  {
    id: "seed-3",
    tatemae: "いえいえ、全然大丈夫ですよ！",
    honne: "全然大丈夫じゃない。定時5分前に頼むのやめて。",
    scene: "仕事",
    gap: 5,
    timestamp: ago(30),
  },
  {
    id: "seed-2",
    tatemae: "今度ぜひ行きましょう〜！",
    honne: "たぶん行かない。でも誘ってくれたのはうれしい。",
    scene: "友達",
    gap: 3,
    timestamp: ago(60 * 5),
  },
  {
    id: "seed-1",
    tatemae: "ちょっと考えておきます",
    honne: "もう答えは出てる。",
    scene: "その他",
    gap: 4,
    timestamp: ago(60 * 26),
  },
];

function read(): Hitorigoto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return SEED;
}

function write(items: Hitorigoto[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function useHitorigoto() {
  const [items, setItems] = useState<Hitorigoto[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // localStorage はクライアントでのみ読めるため、マウント後に同期する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(read());
    setLoaded(true);
  }, []);

  const update = useCallback((fn: (prev: Hitorigoto[]) => Hitorigoto[]) => {
    setItems((prev) => {
      const next = fn(prev);
      write(next);
      return next;
    });
  }, []);

  const add = useCallback(
    (input: { tatemae: string; honne: string; scene: Scene; gap: number }) =>
      update((prev) => [
        {
          id: `${Date.now()}`,
          tatemae: input.tatemae.trim(),
          honne: input.honne.trim(),
          scene: input.scene,
          gap: input.gap,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]),
    [update]
  );

  const remove = useCallback(
    (id: string) => update((prev) => prev.filter((i) => i.id !== id)),
    [update]
  );

  return { items, loaded, add, remove };
}
