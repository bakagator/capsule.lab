// 投稿先プラットフォーム
export type Platform = "x" | "note" | "threads" | "instagram";

// ニュース記事（インプット）
export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  summary: string;
  publishedAt: string;
};

// 各プラットフォーム向けに生成した本文
export type Variant = {
  platform: Platform;
  text: string;
  charCount: number;
  overLimit: boolean;
};

// 下書きの状態
export type DraftStatus = "pending" | "approved" | "rejected" | "published";

// 生成された下書き（承認フローの主役）
export type Draft = {
  id: string;
  status: DraftStatus;
  source: {
    title: string;
    link: string;
    source: string;
  } | null;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  // 生成がモック（APIキー無し）だったか
  mock: boolean;
  // 投稿結果（フェーズ2）
  publishResults?: Record<string, { ok: boolean; message: string }>;
};
