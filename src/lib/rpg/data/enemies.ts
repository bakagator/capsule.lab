import type { Enemy } from "../types";

export const ENEMIES: Record<string, Enemy> = {
  "doubt-shadow": {
    id: "doubt-shadow",
    name: "迷いの影",
    emoji: "👤",
    discipline: "general",
    hp: 60,
    attack: 8,
    attackText: "「本当に店を続ける意味なんてあるの？」迷いが判断を鈍らせる",
    weaknesses: ["mission-flag"],
    traps: [],
    revealQuizzes: ["mission-role"],
    intro: "店を継ぐ不安が形になって現れた！",
    debrief: [
      "見事じゃ。迷いの正体は「何のために店をやるのか」が決まっていなかったことじゃ。",
      "経営理念は、苦しいときほど力を発揮する。千代さんの「町の人の毎日に、ひと口の幸せを」という言葉を忘れぬようにな。",
    ],
    exp: 40,
  },
  "cash-goblin": {
    id: "cash-goblin",
    name: "資金繰りの小鬼",
    emoji: "👺",
    discipline: "accounting",
    hp: 90,
    attack: 14,
    attackText: "支払い期日が迫る！ 手元の資金がみるみる減っていく",
    weaknesses: ["cash-guard"],
    traps: [
      {
        id: "skip-payment",
        name: "仕入れ先への支払いを延ばす",
        description: "農家さんへの支払いを勝手に先延ばしにして、資金を守る。",
        damage: 30,
        cashDelta: 10,
        brandDelta: -15,
        enemyAttackDelta: 0,
        lesson:
          "支払いを一方的に遅らせると、目先の資金は守れても取引先の信頼を失う。良い小豆を回してもらえなくなれば、商品力そのものが落ちてしまうぞ。",
      },
    ],
    revealQuizzes: ["kuroji-tousan"],
    intro: "売上は伸びているのに、なぜか現金が足りない……。資金繰りの小鬼が現れた！",
    debrief: [
      "小鬼の正体は「売上が現金になるまでの時間差」じゃった。",
      "PL（損益計算書）が黒字でも、現金がなければ支払いはできん。利益とキャッシュは別物として、両方を見張るのじゃ。",
    ],
    exp: 60,
  },
  "red-fog": {
    id: "red-fog",
    name: "赤字の霧",
    emoji: "🌫️",
    discipline: "accounting",
    hp: 170,
    attack: 18,
    attackText: "固定費の重圧がのしかかる！ 今月も赤字だ",
    weaknesses: ["break-even"],
    traps: [
      {
        id: "discount-sale",
        name: "全品2割引セール",
        description: "とにかく安くしてお客を呼び込む。",
        damage: 35,
        cashDelta: -30,
        brandDelta: -10,
        enemyAttackDelta: 4,
        lesson:
          "値下げは販売数を増やすが、1個あたりの貢献利益が 200−80=120円 から 160−80=80円 に減る。損益分岐点は 45万÷80＝5,625個 に跳ね上がり、霧はかえって濃くなってしまうのじゃ。",
      },
      {
        id: "borrow-cover",
        name: "借入で赤字を穴埋め",
        description: "銀行から借りて、とりあえず今月の赤字を埋める。",
        damage: 0,
        cashDelta: 40,
        brandDelta: 0,
        enemyAttackDelta: 6,
        lesson:
          "借入で資金は一時的に増えるが、赤字の原因は何も解決しておらん。しかも利息という新たな固定費が増える。借入は「問題の先送り」ではなく「成長のための投資」に使うものじゃ。",
      },
    ],
    revealQuizzes: ["fixed-costs", "break-even-calc"],
    intro: "帳簿の向こうから、正体の見えない赤字の霧が立ちこめる！",
    debrief: [
      "霧が晴れたのう。赤字の正体は「販売数が損益分岐点の3,750個に届いていない」ことじゃった。",
      "利益を出す道は4つしかない。「もっと売る」「値段を上げる」「変動費を下げる」「固定費を下げる」。",
      "どの道を選ぶかは、お主の経営判断じゃ。",
    ],
    exp: 100,
  },
};
