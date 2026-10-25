import type { CompanyStats, Enemy, SaveData, Skill, Trap, UnitEconomics } from "./types";

// ── 成長 ──

const EXP_PER_LEVEL = 80;

export function levelFromExp(exp: number): number {
  return 1 + Math.floor(exp / EXP_PER_LEVEL);
}

export function maxMpForLevel(level: number): number {
  return 18 + level * 4;
}

export function createSave(playerName: string): SaveData {
  return {
    version: 1,
    playerName,
    step: 0,
    exp: 0,
    company: { cash: 200, brand: 50, employeeSatisfaction: 50, communityReputation: 50 },
    skills: [],
    codex: [],
    defeated: [],
    decisions: {},
    items: {},
    trapsUsed: 0,
  };
}

export function applyEffects(
  company: CompanyStats,
  effects: Partial<CompanyStats>,
): CompanyStats {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    cash: company.cash + (effects.cash ?? 0),
    brand: clamp(company.brand + (effects.brand ?? 0)),
    employeeSatisfaction: clamp(company.employeeSatisfaction + (effects.employeeSatisfaction ?? 0)),
    communityReputation: clamp(company.communityReputation + (effects.communityReputation ?? 0)),
  };
}

// ── 会計 ──

export function contributionMargin(e: UnitEconomics): number {
  return e.price - e.variableCost;
}

export function monthlyProfit(e: UnitEconomics): number {
  return contributionMargin(e) * e.volume - e.fixedCost;
}

export function breakEvenVolume(e: UnitEconomics): number {
  return Math.ceil(e.fixedCost / contributionMargin(e));
}

// ── 経営バトル ──

// MPが尽きても詰まないよう、MPを使わない基本行動を用意する
export const BASIC_ACTION = { name: "地道な改善", power: 8 };
const FIRST_TRY_BONUS = 10;

export type BattleState = {
  enemyHp: number;
  enemyAttack: number;
  cash: number;
  brand: number;
  mp: number;
  maxMp: number;
  items: Record<string, number>;
  solved: number;
  log: string[];
  trapsUsed: number;
  lessons: string[];
  status: "ongoing" | "victory" | "defeat";
};

export type BattleAction =
  | { type: "skill"; skill: Skill }
  | { type: "basic" }
  | { type: "trap"; trap: Trap }
  | { type: "item"; itemId: string; name: string; mp: number }
  | { type: "analyze"; firstTry: boolean };

export function createBattle(enemy: Enemy, save: SaveData): BattleState {
  const maxMp = maxMpForLevel(levelFromExp(save.exp));
  return {
    enemyHp: enemy.hp,
    enemyAttack: enemy.attack,
    cash: save.company.cash,
    brand: save.company.brand,
    mp: maxMp,
    maxMp,
    items: { ...save.items },
    solved: 0,
    log: [enemy.intro],
    trapsUsed: 0,
    lessons: [],
    status: "ongoing",
  };
}

export function isWeaknessRevealed(enemy: Enemy, state: BattleState): boolean {
  return state.solved >= enemy.revealQuizzes.length;
}

export type DamageKind = "critical" | "partial" | "normal" | "weak";

export function skillDamage(
  skill: Skill,
  enemy: Enemy,
  revealed: boolean,
  level: number,
): { damage: number; kind: DamageKind } {
  const base = skill.power + level * 2;
  if (enemy.weaknesses.includes(skill.id)) {
    return revealed
      ? { damage: base * 3, kind: "critical" }
      : { damage: Math.round(base * 1.5), kind: "partial" };
  }
  if (skill.discipline === enemy.discipline) return { damage: base, kind: "normal" };
  return { damage: Math.round(base * 0.4), kind: "weak" };
}

const DAMAGE_MESSAGES: Record<DamageKind, string> = {
  critical: "会心の一撃！ 弱点を突いた！",
  partial: "手応えはある。だが分析が足りず、決め手に欠ける……",
  normal: "",
  weak: "効果はいまひとつのようだ。課題の種類に合ったスキルを選ぼう。",
};

export function resolveTurn(
  state: BattleState,
  action: BattleAction,
  enemy: Enemy,
  level: number,
): BattleState {
  if (state.status !== "ongoing") return state;

  const next: BattleState = {
    ...state,
    items: { ...state.items },
    log: [...state.log],
    lessons: [...state.lessons],
  };
  let damage = 0;
  let guard = false;

  switch (action.type) {
    case "skill": {
      const { skill } = action;
      next.mp -= skill.mpCost;
      const result = skillDamage(skill, enemy, isWeaknessRevealed(enemy, state), level);
      damage = result.damage;
      guard = !!skill.guard;
      next.log.push(`「${skill.name}」！ ${enemy.name}に${damage}のダメージ。`);
      if (DAMAGE_MESSAGES[result.kind]) next.log.push(DAMAGE_MESSAGES[result.kind]);
      if (guard) next.log.push("資金の守りを固めた。");
      break;
    }
    case "basic": {
      damage = BASIC_ACTION.power + level;
      next.log.push(`「${BASIC_ACTION.name}」。${enemy.name}に${damage}のダメージ。`);
      break;
    }
    case "trap": {
      const { trap } = action;
      damage = trap.damage;
      next.cash += trap.cashDelta;
      next.brand = Math.max(0, next.brand + trap.brandDelta);
      next.enemyAttack += trap.enemyAttackDelta;
      next.trapsUsed += 1;
      next.lessons.push(trap.lesson);
      next.log.push(
        damage > 0
          ? `「${trap.name}」！ ${enemy.name}に${damage}のダメージ。`
          : `「${trap.name}」。資金が${trap.cashDelta}万円増えた。`,
      );
      if (trap.cashDelta < 0) next.log.push(`資金が${-trap.cashDelta}万円減った……`);
      if (trap.brandDelta < 0) next.log.push(`ブランドが${-trap.brandDelta}下がった……`);
      if (trap.enemyAttackDelta > 0) next.log.push(`${enemy.name}の勢いが増した気がする……`);
      break;
    }
    case "item": {
      next.items[action.itemId] = (next.items[action.itemId] ?? 0) - 1;
      const before = next.mp;
      next.mp = Math.min(next.maxMp, next.mp + action.mp);
      next.log.push(`${action.name}を食べた。体力（MP）が${next.mp - before}回復した。`);
      break;
    }
    case "analyze": {
      next.solved += 1;
      if (action.firstTry) {
        damage = FIRST_TRY_BONUS;
        next.log.push(`一発正解！ 理解の一撃で${enemy.name}に${damage}のダメージ。`);
      } else {
        next.log.push("分析が進んだ。");
      }
      if (isWeaknessRevealed(enemy, next)) next.log.push(`${enemy.name}の弱点が判明した！`);
      break;
    }
  }

  next.enemyHp = Math.max(0, next.enemyHp - damage);
  if (next.enemyHp === 0) {
    next.status = "victory";
    next.log.push(`${enemy.name}を倒した！`);
    return next;
  }

  const taken = guard ? Math.ceil(next.enemyAttack / 2) : next.enemyAttack;
  next.cash -= taken;
  next.log.push(`${enemy.attackText}。資金が${taken}万円減った。`);
  if (next.cash <= 0) {
    next.cash = 0;
    next.status = "defeat";
    next.log.push("資金が尽きてしまった……");
  }
  return next;
}
