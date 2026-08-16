import type { Platform } from "./types";

export type PlatformMeta = {
  id: Platform;
  label: string;
  // 目安の文字数上限（生成の指示にも使用）
  charLimit: number;
  // 長文型か短文型か
  kind: "short" | "long";
  // 公式APIで自動投稿できるか
  autoPost: boolean;
  note: string;
};

export const PLATFORMS: Record<Platform, PlatformMeta> = {
  x: {
    id: "x",
    label: "X (Twitter)",
    charLimit: 140,
    kind: "short",
    autoPost: true,
    note: "公式API。無料枠は月500投稿まで。",
  },
  threads: {
    id: "threads",
    label: "Threads",
    charLimit: 500,
    kind: "short",
    autoPost: true,
    note: "Meta公式APIで無料投稿可能。",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    charLimit: 2200,
    kind: "long",
    autoPost: true,
    note: "ビジネス垢＋Graph API。画像が必須。",
  },
  note: {
    id: "note",
    label: "note",
    charLimit: 2000,
    kind: "long",
    autoPost: false,
    note: "公式投稿APIなし。本文をコピーして手動投稿（半自動）。",
  },
};

export const ALL_PLATFORMS: Platform[] = ["x", "note", "threads", "instagram"];
