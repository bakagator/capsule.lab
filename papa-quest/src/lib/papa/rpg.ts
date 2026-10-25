import { LESSONS, MONTHS } from "./data";

export type Monster = {
  name: string;
  sprite: string;
  hp: number;
  atk: number;
  boss?: boolean;
};

// ママの城：気遣いクイズの各問題に対応するまもの
export const CARE_MONSTERS: Record<string, Monster> = {
  "care-1": { name: "ちらかりスライム", sprite: "🫠", hp: 30, atk: 12 },
  "care-2": { name: "つわりゴースト", sprite: "👻", hp: 35, atk: 14 },
  "care-3": { name: "よなきバット", sprite: "🦇", hp: 40, atk: 16 },
  "care-4": { name: "なみだしずく", sprite: "💧", hp: 40, atk: 16 },
  "care-5": { name: "なやみゴーレム", sprite: "🗿", hp: 50, atk: 18 },
  "care-6": { name: "ワンオペデビル", sprite: "😈", hp: 55, atk: 20 },
  "care-7": { name: "てつだおうかミミック", sprite: "📦", hp: 60, atk: 22 },
  "care-8": { name: "ありがとうを わすれたドラゴン", sprite: "🐉", hp: 90, atk: 26, boss: true },
};

// 学びの神殿：各レッスンの試練のまもの
export const LESSON_MONSTERS: Record<string, Monster> = {
  "lesson-bath-q": { name: "のぼせクラゲ", sprite: "🪼", hp: 30, atk: 14 },
  "lesson-diaper-q": { name: "モレモレ大王", sprite: "👑", hp: 35, atk: 15 },
  "lesson-hold-q": { name: "ゆさぶりトロル", sprite: "👹", hp: 40, atk: 18 },
  "lesson-sleep-q": { name: "うつぶせシャドウ", sprite: "🌑", hp: 40, atk: 18 },
  "lesson-labor-q": { name: "じんつうタイフーン", sprite: "🌀", hp: 45, atk: 20 },
  "lesson-preg-q": { name: "こむらがえりクラブ", sprite: "🦀", hp: 35, atk: 15 },
};

export type Place = {
  id: "castle" | "temple" | "road" | "cave" | "workshop" | "home";
  name: string;
  sprite: string;
  x: number; // マップ上の位置（%）
  y: number;
  desc: string;
};

export const PLACES: Place[] = [
  { id: "home", name: "はじまりの家", sprite: "🏠", x: 18, y: 80, desc: "つよさを見る・やすむ" },
  { id: "castle", name: "ママの城", sprite: "🏰", x: 72, y: 16, desc: "気遣いの まものたちに いどもう" },
  { id: "temple", name: "学びの神殿", sprite: "🏛️", x: 22, y: 30, desc: "けんじゃに 育児の わざを まなぶ" },
  { id: "road", name: "時の街道", sprite: "🛤️", x: 50, y: 52, desc: "妊娠初期から1歳までの 旅" },
  { id: "cave", name: "ゲップの洞窟", sprite: "🕳️", x: 80, y: 64, desc: "ガスゴーストを しずめろ" },
  { id: "workshop", name: "ミルク錬金工房", sprite: "⚗️", x: 46, y: 86, desc: "かんぺきな ミルクを れんせいせよ" },
];

export type Item = { slot: string; name: string; sprite: string; got: boolean; hint: string };

type Earned = Record<string, number>;
const has = (e: Earned, id: string) => e[id] !== undefined;

export function monthsCleared(e: Earned) {
  return MONTHS.filter((m) => has(e, `${m.id}-clear`)).length;
}

export function lessonsCleared(e: Earned) {
  return LESSONS.filter((l) => has(e, `${l.id}-clear`)).length;
}

export function equipment(e: Earned): Item[] {
  return [
    { slot: "ぶき", name: "ほにゅうびんソード", sprite: "🍼", got: has(e, "milk-clear") || has(e, "milk-perfect"), hint: "ミルク錬金工房で てにいれる" },
    { slot: "たて", name: "ガーゼのたて", sprite: "🛡️", got: has(e, "burp-clear") || has(e, "burp-gentle"), hint: "ゲップの洞窟で てにいれる" },
    { slot: "よろい", name: "だっこひもアーマー", sprite: "🎽", got: lessonsCleared(e) === LESSONS.length, hint: "学びの神殿を すべて しゅうりょう" },
    { slot: "かぶと", name: "ちちおや手帳のかぶと", sprite: "⛑️", got: monthsCleared(e) >= 3, hint: "時の街道で 3つの まちを すくう" },
    { slot: "アクセ", name: "ママへのてがみ", sprite: "💌", got: has(e, "care-clear"), hint: "ママの城の ドラゴンを たおす" },
  ];
}

export function treasures(e: Earned): Item[] {
  return [
    { slot: "", name: "やさしいて", sprite: "🤲", got: has(e, "burp-gentle"), hint: "一度も つよくたたかずに ゲップ" },
    { slot: "", name: "ミルクしょくにんの あかし", sprite: "👨‍🍳", got: has(e, "milk-perfect"), hint: "ノーミスで ミルクを つくる" },
    { slot: "", name: "1さいの バースデーケーキ", sprite: "🎂", got: monthsCleared(e) === MONTHS.length, hint: "時の街道を さいごまで" },
  ];
}

export function stats(e: Earned, missions: Record<string, boolean>) {
  const careWins = Object.keys(CARE_MONSTERS).filter((id) => has(e, id)).length;
  const lessonPts = LESSONS.reduce(
    (n, l) => n + (has(e, `${l.id}-read`) ? 1 : 0) + (has(e, l.quiz.id) ? 1 : 0),
    0
  );
  const missionCount = Object.values(missions).filter(Boolean).length;
  const skill =
    (has(e, "burp-clear") || has(e, "burp-gentle") ? 1 : 0) +
    (has(e, "milk-clear") || has(e, "milk-perfect") ? 1 : 0);
  return [
    { label: "やさしさ", value: 5 + careWins * 6 },
    { label: "ちしき", value: 5 + lessonPts * 4 },
    { label: "じゅんび", value: 5 + missionCount * 2 },
    { label: "わざ", value: 5 + skill * 20 },
  ];
}
