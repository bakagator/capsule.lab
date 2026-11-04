// 記録はこの端末（ブラウザ）の中だけに保存する
export type Post = {
  id: string;
  text: string;
  ts: number;
  cleared: boolean;
};

export type Meta = {
  released: number; // 「消す」で手放した回数（文章は保存しない）
  lastVent: number; // 最後に吐き出した時刻
};

const POSTS_KEY = "matsuda_honne_posts";
const META_KEY = "matsuda_honne_meta";
const DRAFT_KEY = "matsuda_honne_draft";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch {
    /* 保存できない環境（プライベートブラウズなど） */
  }
}

export function loadPosts(): Post[] {
  const raw = read<Array<Partial<Post> & { honne?: string; tatemae?: string }>>(POSTS_KEY, []);
  return raw
    .map((r) => ({
      id: String(r.id ?? `${r.ts}`),
      text: r.text ?? r.honne ?? r.tatemae ?? "",
      ts: Number(r.ts) || Date.now(),
      cleared: !!r.cleared,
    }))
    .filter((p) => p.text)
    .sort((a, b) => b.ts - a.ts);
}

export const savePosts = (posts: Post[]) => write(POSTS_KEY, posts);

export function loadMeta(): Meta {
  return { released: 0, lastVent: 0, ...read<Partial<Meta>>(META_KEY, {}) };
}

export const saveMeta = (meta: Meta) => write(META_KEY, meta);

export function loadDraft(): string {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}

export const saveDraft = (text: string) => write(DRAFT_KEY, text);
