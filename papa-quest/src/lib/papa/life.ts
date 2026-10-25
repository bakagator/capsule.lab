import type { QuizQuestion } from "./data";
import type { Monster } from "./rpg";

// ─────────────────────────────────────────
// やくしょ：出生前・出生後の手続き（一般的な目安。詳細は自治体・勤務先で確認）
// ─────────────────────────────────────────
export type Procedure = {
  id: string;
  when: "before" | "after";
  title: string;
  where: string;
  deadline: string;
  memo: string;
};

export const PROCEDURES: Procedure[] = [
  {
    id: "proc-boshi",
    when: "before",
    title: "妊娠届を出して 母子健康手帳を受け取る",
    where: "市区町村の窓口",
    deadline: "妊娠がわかったら早めに",
    memo: "妊婦健診の補助券も一緒にもらえることが多い。",
  },
  {
    id: "proc-ikukyu",
    when: "before",
    title: "育休（産後パパ育休）の取得を職場に申し出る",
    where: "勤務先",
    deadline: "産後パパ育休は原則 休業の2週間前まで／育休は1ヶ月前まで",
    memo: "産後パパ育休は出生後8週間以内に最大4週間、2回まで分けて取れる。",
  },
  {
    id: "proc-ichiji",
    when: "before",
    title: "出産育児一時金の「直接支払制度」の書類を産院と交わす",
    where: "出産する産院",
    deadline: "入院・出産まで",
    memo: "健康保険から産院へ直接支払われ、窓口での立て替えが少なくなる。",
  },
  {
    id: "proc-route",
    when: "before",
    title: "里帰り出産や産院までのルート、陣痛タクシーを確認",
    where: "家族で相談",
    deadline: "妊娠後期まで",
    memo: "夜間・休日の連絡先も スマホと紙の両方にメモしておくと安心。",
  },
  {
    id: "proc-shussei",
    when: "after",
    title: "出生届を提出する",
    where: "市区町村の窓口",
    deadline: "生まれた日を含めて14日以内",
    memo: "出生証明書（産院が記入）と一体の用紙。名前を決めておこう。",
  },
  {
    id: "proc-jidou",
    when: "after",
    title: "児童手当の認定請求をする",
    where: "住んでいる市区町村",
    deadline: "出生日の翌日から15日以内が目安",
    memo: "申請が遅れると、その分の手当がもらえなくなることがある。",
  },
  {
    id: "proc-hoken",
    when: "after",
    title: "赤ちゃんを健康保険に加入させる",
    where: "勤務先（会社の健康保険）または市区町村（国民健康保険）",
    deadline: "1ヶ月健診までには",
    memo: "共働きなら、原則 収入の多いほうの扶養に入る。",
  },
  {
    id: "proc-iryou",
    when: "after",
    title: "子どもの医療費助成を申請する",
    where: "市区町村の窓口",
    deadline: "健康保険の加入後すぐ",
    memo: "通院・入院の自己負担が軽くなる。内容は自治体ごとに違う。",
  },
  {
    id: "proc-kyufu",
    when: "after",
    title: "育児休業給付金・出産手当金の申請を確認",
    where: "勤務先（ハローワーク・健康保険へ）",
    deadline: "勤務先の案内に従う",
    memo: "ママが会社員なら出産手当金も対象。帝王切開などは高額療養費も確認。",
  },
];

// ─────────────────────────────────────────
// しんりょうじょ：予防接種（定期接種の標準的な目安）
// ─────────────────────────────────────────
export type VaccineStep = { id: string; age: string; shots: string[] };

export const VACCINES: VaccineStep[] = [
  { id: "vac-2m", age: "生後2ヶ月", shots: ["五種混合 1回目", "小児用肺炎球菌 1回目", "B型肝炎 1回目", "ロタウイルス 1回目"] },
  { id: "vac-3m", age: "生後3ヶ月", shots: ["五種混合 2回目", "小児用肺炎球菌 2回目", "B型肝炎 2回目", "ロタウイルス 2回目"] },
  { id: "vac-4m", age: "生後4ヶ月", shots: ["五種混合 3回目", "小児用肺炎球菌 3回目", "（ロタウイルス 3回目：ワクチンの種類による）"] },
  { id: "vac-5m", age: "生後5〜8ヶ月", shots: ["BCG（1歳になるまで）", "B型肝炎 3回目（7〜8ヶ月ごろ）"] },
  { id: "vac-1y", age: "1歳〜", shots: ["MR（麻しん風しん）1期", "水痘 1回目", "小児用肺炎球菌 追加", "五種混合 追加（1歳〜1歳半ごろ）"] },
];

export const CLINIC_QUIZ: QuizQuestion[] = [
  {
    id: "vac-q1",
    emoji: "💉",
    title: "予防接種デビュー",
    scene: "赤ちゃんの定期予防接種、スタートの目安はいつ？",
    choices: [
      { text: "生後2ヶ月", correct: true, feedback: "正解！生後2ヶ月から一気に始まる。早めに予約しておこう。" },
      { text: "生後6ヶ月", correct: false, feedback: "遅すぎ！ 赤ちゃんを守るため、受けられる時期になったらすぐ受けるのが基本。" },
      { text: "1歳の誕生日", correct: false, feedback: "1歳で受けるワクチンもあるけど、スタートはもっと早い。" },
    ],
    tip: "自治体から届く予診票と、母子手帳を忘れずに。",
  },
  {
    id: "vac-q2",
    emoji: "🩹",
    title: "同時接種",
    scene: "小児科で「今日は4本同時に打ちましょう」と言われた。どうする？",
    choices: [
      { text: "多すぎて心配なので1本ずつに分けてもらう", correct: false, feedback: "分けることもできるけど、通院回数が増えて予防が遅れることがある。" },
      { text: "同時接種は一般的と知っておき、不安な点は医師に聞く", correct: true, feedback: "正解！同時接種は日本でも一般的。気になることは遠慮なく質問しよう。" },
      { text: "ネットの噂を信じて受けない", correct: false, feedback: "根拠のない情報に注意。かかりつけ医に相談するのが一番。" },
    ],
    tip: "接種のあとは院内で30分ほど様子を見るのが目安。",
  },
  {
    id: "vac-q3",
    emoji: "🌡️",
    title: "接種のあと",
    scene: "予防接種の夜、赤ちゃんが少し熱っぽい。パパの対応は？",
    choices: [
      { text: "様子を見て、高熱やぐったりしていたら すぐ医療機関へ相談", correct: true, feedback: "正解！軽い発熱は起こりうる。迷ったら #8000（子ども医療電話相談）も使える。" },
      { text: "熱いお風呂で汗をかかせる", correct: false, feedback: "当日の入浴は問題ないことが多いけど、熱いお風呂はNG。" },
      { text: "大人用の解熱剤を少し飲ませる", correct: false, feedback: "絶対にダメ！ 薬は必ず医師の指示どおりに。" },
    ],
    tip: "#8000 は夜間や休日に小児科の相談ができる電話窓口。",
  },
];

export const CLINIC_MONSTERS: Record<string, Monster> = {
  "vac-q1": { name: "うっかりわすれウイルス", sprite: "🦠", hp: 35, atk: 14 },
  "vac-q2": { name: "うわさのモヤモヤ", sprite: "🌫️", hp: 40, atk: 16 },
  "vac-q3": { name: "ねつネズミ", sprite: "🐀", hp: 40, atk: 16 },
};

// ─────────────────────────────────────────
// どうぐや：陣痛バッグ
// ─────────────────────────────────────────
export type BagItem = { id: string; sprite: string; name: string; need: boolean; reason: string };

export const BAG_ITEMS: BagItem[] = [
  { id: "boshi", sprite: "📕", name: "母子手帳・保険証・診察券", need: true, reason: "これがないと はじまらない！ ひとつのポーチにまとめておこう。" },
  { id: "phone", sprite: "🔌", name: "スマホと長めの充電ケーブル", need: true, reason: "陣痛の記録や連絡に。ベッドからコンセントが遠いことも。" },
  { id: "straw", sprite: "🥤", name: "ペットボトル用ストローキャップ", need: true, reason: "寝たままでも水分がとれる。陣痛中のママの必需品。" },
  { id: "jelly", sprite: "🧃", name: "飲み物・ゼリー飲料", need: true, reason: "長丁場の陣痛には エネルギー補給が大事。" },
  { id: "ball", sprite: "🎾", name: "テニスボール", need: true, reason: "お尻の少し上を押すと痛みがやわらぐことがある。パパの武器！" },
  { id: "lip", sprite: "💄", name: "リップクリーム", need: true, reason: "呼吸法で口がカラカラになりやすい。" },
  { id: "towel", sprite: "🧻", name: "タオル・汗ふきシート", need: true, reason: "陣痛中は汗だくに。パパがこまめに拭いてあげよう。" },
  { id: "sock", sprite: "🧦", name: "靴下・羽織るもの", need: true, reason: "体温調節に。足元の冷えは意外とつらい。" },
  { id: "hair", sprite: "🎀", name: "ヘアゴム・ヘアクリップ", need: true, reason: "髪が顔にかからないように。" },
  { id: "coin", sprite: "🪙", name: "小銭・ICカード", need: true, reason: "自販機や駐車場、パパの買い出しに。" },
  { id: "perfume", sprite: "🌸", name: "香水", need: false, reason: "においに敏感になっていることも。病院では控えよう。" },
  { id: "pc", sprite: "💻", name: "仕事用のノートパソコン", need: false, reason: "今日はママに全集中！ 仕事は置いていこう。" },
  { id: "game", sprite: "🎮", name: "ひまつぶし用のゲーム機", need: false, reason: "パパがゲームしていたら…信頼度が大ピンチ。" },
  { id: "stroller", sprite: "🛒", name: "ベビーカー", need: false, reason: "陣痛バッグには入らない！ 退院の日は抱っこかチャイルドシートで。" },
  { id: "cake", sprite: "🎂", name: "お祝いのホールケーキ", need: false, reason: "気持ちはうれしいけど、お祝いは落ち着いてから。" },
];

export const BAG_MONSTER: Monster = { name: "わすれものゴブリン", sprite: "👺", hp: 50, atk: 0 };

// ─────────────────────────────────────────
// きずなの泉：感謝・行動の日記とママの信頼度
// ─────────────────────────────────────────
export type LogCategory = { id: string; sprite: string; label: string; hint: string };

export const LOG_CATEGORIES: LogCategory[] = [
  { id: "thanks", sprite: "💐", label: "ありがとうを つたえた", hint: "例：毎晩の授乳ありがとう、と伝えた" },
  { id: "listen", sprite: "👂", label: "はなしを きいた", hint: "例：今日のつらかったことを最後まで聞いた" },
  { id: "chore", sprite: "🧺", label: "かじを した", hint: "例：夕飯を作って、皿洗いもした" },
  { id: "care", sprite: "👶", label: "いくじを した", hint: "例：お風呂と寝かしつけを担当した" },
  { id: "rest", sprite: "☕", label: "やすむ じかんを つくった", hint: "例：2時間ひとりでカフェに行ってもらった" },
];

export type LogEntry = { id: string; date: string; cat: string; text: string };
export type Wish = { id: string; text: string; done: boolean; doneAt?: string };

export const WISH_PRESETS = [
  "はじめての かぞくしゃしんを とる",
  "お食い初めを する",
  "こうえんデビュー",
  "かぞくで おんせん旅行",
  "ママと ふたりで デート（あずけて）",
  "あかちゃんに てがみを かく",
  "ハーフバースデーの おいわい",
  "パパと あかちゃんで おでかけ",
];

export const LOG_XP_PER_DAY = 3; // 1日に経験値がもらえる日記の数

export function today() {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const TRUST_RANKS = [
  { min: 0, name: "しりあい" },
  { min: 20, name: "なかま" },
  { min: 50, name: "あいぼう" },
  { min: 100, name: "しんらいの きずな" },
  { min: 180, name: "さいこうの パートナー" },
];

// 信頼度は日記（1日3件まで）・やりたいこと達成・ママの城クリアから計算
export function trustPoints(logs: LogEntry[], wishes: Wish[], careCleared: boolean) {
  const perDay: Record<string, number> = {};
  for (const l of logs) perDay[l.date] = Math.min(LOG_XP_PER_DAY, (perDay[l.date] ?? 0) + 1);
  const logPts = Object.values(perDay).reduce((a, b) => a + b, 0) * 5;
  const wishPts = wishes.filter((w) => w.done).length * 8;
  return logPts + wishPts + (careCleared ? 10 : 0);
}

export function trustRank(points: number) {
  let idx = 0;
  TRUST_RANKS.forEach((r, i) => {
    if (points >= r.min) idx = i;
  });
  const next = TRUST_RANKS[idx + 1];
  return {
    rank: idx,
    name: TRUST_RANKS[idx].name,
    min: TRUST_RANKS[idx].min,
    next: next?.min ?? null,
    hpBonus: idx * 5,
  };
}

// 日付の連続記録
export function streak(logs: LogEntry[]) {
  const days = new Set(logs.map((l) => l.date));
  let n = 0;
  const d = new Date();
  for (;;) {
    const key = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
    if (!days.has(key)) break;
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
