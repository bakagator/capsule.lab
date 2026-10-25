export type Discipline = "general" | "accounting";

export type Skill = {
  id: string;
  name: string;
  discipline: Discipline;
  description: string;
  mpCost: number;
  power: number;
  // 使ったターンの敵の攻撃（資金へのダメージ）を半減する
  guard?: boolean;
};

// 一見効きそうだが長期的に悪影響を与える「罠コマンド」
export type Trap = {
  id: string;
  name: string;
  description: string;
  damage: number;
  cashDelta: number;
  brandDelta: number;
  enemyAttackDelta: number;
  lesson: string;
};

export type Quiz = {
  id: string;
  question: string;
  choices: string[];
  // 複数正解のときは複数選択式になる
  answer: number[];
  hints: [string, string];
  explanation: string;
};

export type Enemy = {
  id: string;
  name: string;
  emoji: string;
  discipline: Discipline;
  hp: number;
  attack: number;
  attackText: string;
  weaknesses: string[];
  traps: Trap[];
  revealQuizzes: string[];
  intro: string;
  debrief: string[];
  exp: number;
};

export type CompanyStats = {
  cash: number; // 万円
  brand: number;
  employeeSatisfaction: number;
  communityReputation: number;
};

export type UnitEconomics = {
  price: number; // 円
  variableCost: number; // 円
  volume: number; // 個/月
  fixedCost: number; // 円/月
};

export type CaseOption = {
  id: string;
  label: string;
  detail: string;
  economics: UnitEconomics;
  effects: Partial<Omit<CompanyStats, "cash">>;
  outcome: string;
  tradeoff: string;
  reasons: string[];
  consistentReason: number;
  reasonFeedback: string;
};

export type CaseDecision = {
  id: string;
  title: string;
  situation: string[];
  current: UnitEconomics;
  // 意思決定の結果が反映される期間（か月）
  months: number;
  options: CaseOption[];
  exp: number;
};

export type CodexEntry = {
  id: string;
  term: string;
  category: string;
  body: string;
};

export type Speaker = "owl" | "chiyo" | "soroban" | "gen" | "player" | "narration";

export type Line = {
  speaker: Speaker;
  text: string;
};

export type StoryNode =
  | { type: "chapter"; label: string; title: string; subtitle: string }
  | { type: "dialogue"; lines: Line[] }
  | { type: "learn"; skills?: string[]; codex?: string[]; items?: Record<string, number> }
  | { type: "quiz"; quizId: string; intro: string; exp: number }
  | { type: "battle"; enemyId: string }
  | { type: "case"; caseId: string }
  | { type: "end" };

export type SaveData = {
  version: 1;
  playerName: string;
  step: number;
  exp: number;
  company: CompanyStats;
  skills: string[];
  codex: string[];
  defeated: string[];
  decisions: Record<string, { optionId: string; reasoningCorrect: boolean }>;
  items: Record<string, number>;
  trapsUsed: number;
};
