import type { Skill } from "../types";

export const SKILLS: Record<string, Skill> = {
  "mission-flag": {
    id: "mission-flag",
    name: "理念の旗",
    discipline: "general",
    description: "「何のために経営するのか」を掲げ、迷いを打ち払う。判断の拠り所をつくるスキル。",
    mpCost: 4,
    power: 22,
  },
  "resource-scan": {
    id: "resource-scan",
    name: "資源スキャン",
    discipline: "general",
    description: "ヒト・モノ・カネ・情報の4つの経営資源を点検する。消費の少ない基本攻撃。",
    mpCost: 2,
    power: 14,
  },
  "pl-reading": {
    id: "pl-reading",
    name: "PLリーディング",
    discipline: "accounting",
    description: "損益計算書を読み解き、売上・費用・利益の流れを見抜く。",
    mpCost: 4,
    power: 20,
  },
  "cash-guard": {
    id: "cash-guard",
    name: "キャッシュ・ガード",
    discipline: "accounting",
    description: "入金と支払いのタイミングを管理し、資金を守る。このターンに受ける資金ダメージを半減する。",
    mpCost: 3,
    power: 12,
    guard: true,
  },
  "break-even": {
    id: "break-even",
    name: "損益分岐点",
    discipline: "accounting",
    description: "固定費 ÷（価格 − 変動費）で、利益がゼロになる販売数を割り出す。赤字の正体を暴く一撃。",
    mpCost: 6,
    power: 30,
  },
};

export const ITEMS: Record<string, { name: string; description: string; mp: number }> = {
  yokan: {
    name: "祖母の羊羹",
    description: "千代さん直伝の羊羹。経営者の体力（MP）を15回復する。",
    mp: 15,
  },
};
