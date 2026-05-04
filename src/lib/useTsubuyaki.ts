"use client";
import { useState, useEffect } from "react";
import type { Tsubuyaki, Author } from "./types";

const STORAGE_KEY = "matsuda_tsubuyaki";

const SEED: Tsubuyaki[] = [
  {
    id: "seed-1",
    author: "妻",
    text: "今日のご飯なに食べたい？🍳",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reactions: { "🍚": ["夫"], "😋": ["夫"] },
  },
  {
    id: "seed-2",
    author: "夫",
    text: "カレーたべたいなあ〜🍛",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    reactions: { "🎉": ["妻"], "❤️": ["妻"] },
  },
];

export function useTsubuyaki() {
  const [items, setItems] = useState<Tsubuyaki[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        setItems(SEED);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      }
    } else {
      setItems(SEED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    }
    setLoaded(true);
  }, []);

  function save(next: Tsubuyaki[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addPost(author: Author, text: string) {
    const next: Tsubuyaki = {
      id: Date.now().toString(),
      author,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
    };
    save([next, ...items]);
  }

  function toggleReaction(id: string, emoji: string, reactor: Author) {
    const next = items.map((item) => {
      if (item.id !== id) return item;
      const current = item.reactions[emoji] ?? [];
      const updated = current.includes(reactor)
        ? current.filter((a) => a !== reactor)
        : [...current, reactor];
      const newReactions = { ...item.reactions, [emoji]: updated };
      if (newReactions[emoji].length === 0) delete newReactions[emoji];
      return { ...item, reactions: newReactions };
    });
    save(next);
  }

  function deletePost(id: string) {
    save(items.filter((item) => item.id !== id));
  }

  return { items, loaded, addPost, toggleReaction, deletePost };
}
