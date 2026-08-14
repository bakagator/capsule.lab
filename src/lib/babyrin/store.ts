// ストア層。
//
// べびりんの状態は単一の JSON スナップショットとして保存する(夫婦2人・低頻度なので十分)。
// バックエンドは差し替え可能:
//   - Upstash Redis (REST) …… 本番。Vercel などのサーバーレスで永続化。fetch のみで依存なし。
//   - Memory …… 環境変数が無いときのフォールバック。ローカル開発/デモ用(再起動で消える)。
//
// 使い方: await loadState() で取得し、変更後 await saveState(state) で保存。

import { BabyrinState, emptyState } from "./types";

const KEY = "babyrin:state:v1";

interface KV {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

/** プロセス内メモリ。開発・デモ用。サーバーレスでは永続しない点に注意。 */
class MemoryKV implements KV {
  private map = new Map<string, string>();
  async get(key: string) {
    return this.map.get(key) ?? null;
  }
  async set(key: string, value: string) {
    this.map.set(key, value);
  }
}

/** Upstash Redis の REST API を fetch で叩く薄いクライアント。 */
class UpstashKV implements KV {
  constructor(
    private url: string,
    private token: string,
  ) {}

  private async cmd(...args: (string | number)[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Upstash error ${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as { result?: unknown; error?: string };
    if (data.error) throw new Error(`Upstash error: ${data.error}`);
    return data.result ?? null;
  }

  async get(key: string) {
    return (await this.cmd("GET", key)) as string | null;
  }
  async set(key: string, value: string) {
    await this.cmd("SET", key, value);
  }
}

let kvSingleton: KV | null = null;

function kv(): KV {
  if (kvSingleton) return kvSingleton;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  kvSingleton = url && token ? new UpstashKV(url, token) : new MemoryKV();
  return kvSingleton;
}

/** 永続ストアが設定されているか(Memory フォールバックでないか)。 */
export function hasPersistentStore(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export async function loadState(): Promise<BabyrinState> {
  const raw = await kv().get(KEY);
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as Partial<BabyrinState>;
    // 後方互換: 欠けたフィールドを空で埋める。
    const base = emptyState();
    return {
      users: parsed.users ?? base.users,
      tasks: parsed.tasks ?? base.tasks,
      challenges: parsed.challenges ?? base.challenges,
      settings: parsed.settings ?? base.settings,
    };
  } catch {
    return emptyState();
  }
}

export async function saveState(state: BabyrinState): Promise<void> {
  await kv().set(KEY, JSON.stringify(state));
}

/** 読み込み→変更→保存 をまとめる小さなヘルパー。 */
export async function mutateState<T>(
  fn: (state: BabyrinState) => T | Promise<T>,
): Promise<T> {
  const state = await loadState();
  const result = await fn(state);
  await saveState(state);
  return result;
}
