// べびりん — 夫婦専用LINE AI秘書 のドメインモデル
//
// 「頭脳」はまず定型文ベース。将来 Claude 化しても壊れないよう、
// データ構造は口調(persona)から独立させている。

/** 夫婦の役割。共有タスクは "共有"。 */
export type Role = "妻" | "夫";

/** タスク・チャレンジの担当。"共有" は二人の共同作業。 */
export type Owner = Role | "共有";

/** LINEユーザーの登録情報。userId は LINE の messaging API userId。 */
export type LineUser = {
  userId: string;
  role: Role;
  registeredAt: string; // ISO
};

/** 一回きりの「やること」。 */
export type Task = {
  id: string;
  title: string;
  owner: Owner;
  createdBy: Role;
  createdAt: string; // ISO
  /** 期限(任意)。YYYY-MM-DD。無ければ「いつか」。 */
  due?: string;
  done: boolean;
  doneAt?: string; // ISO
  /** これまで何回お尻を叩いたか。叩きすぎ防止と口調エスカレーションに使う。 */
  nudgeCount: number;
  /** 最後にお尻を叩いた日 YYYY-MM-DD。1日1回までに制限するため。 */
  lastNudgedDate?: string;
};

/** 習慣化したい「チャレンジ」。続くようにお尻を叩く主役。 */
export type Challenge = {
  id: string;
  title: string;
  owner: Owner;
  createdBy: Role;
  createdAt: string; // ISO
  /** 頻度。daily=毎日 / weekdays=指定曜日(days) / weekly=週◯回(ゆるめ判定) */
  cadence: Cadence;
  active: boolean;
  /** 実施した日の記録 YYYY-MM-DD の集合(新しい順の配列)。 */
  history: string[];
  /** 現在の連続日数(ストリーク)。 */
  streak: number;
  /** 過去最高の連続日数。 */
  longestStreak: number;
  /** 最後に実施した日 YYYY-MM-DD。 */
  lastDoneDate?: string;
  /** 到達済みのマイルストーン(3,7,14,30…)。二重にお祝いしないため。 */
  celebrated: number[];
  /** 最後にお尻を叩いた日 YYYY-MM-DD。1日1回まで。 */
  lastNudgedDate?: string;
};

export type Cadence =
  | { type: "daily" }
  | { type: "weekdays"; days: Weekday[] } // 0=日 .. 6=土
  | { type: "weekly"; times: number }; // 週に times 回できればOK

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** べびりん全体の設定。 */
export type Settings = {
  /** 通知を控える時間帯(この時間帯はお尻を叩かない)。 */
  quietHours: { start: number; end: number }; // 例 {start:22, end:7}
  /** タスクを何日放置したら催促を始めるか。 */
  taskStaleDays: number;
};

export const DEFAULT_SETTINGS: Settings = {
  quietHours: { start: 22, end: 7 },
  taskStaleDays: 2,
};

/** ストアに保存する全状態のスナップショット。 */
export type BabyrinState = {
  users: LineUser[];
  tasks: Task[];
  challenges: Challenge[];
  settings: Settings;
};

export function emptyState(): BabyrinState {
  return { users: [], tasks: [], challenges: [], settings: DEFAULT_SETTINGS };
}
