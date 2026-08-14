// お尻叩き(nudge)ロジック。
// cron から定期実行され、「今つつくべき相手とメッセージ」を組み立てる。
// 状態(lastNudgedDate / nudgeCount)を更新する副作用あり。

import { BabyrinState, Owner, Role } from "./types";
import {
  isDoneToday,
  isDueToday,
  streakBrokenSince,
  taskAge,
} from "./domain";
import { jstDateStr, jstHour } from "./time";
import * as p from "./persona";

export type NudgeDelivery = { userId: string; messages: string[] };

/** その役割のユーザーIDを引く。 */
function userIdsForOwner(state: BabyrinState, owner: Owner): string[] {
  if (owner === "共有") return state.users.map((u) => u.userId);
  const u = state.users.find((x) => x.role === (owner as Role));
  return u ? [u.userId] : state.users.map((x) => x.userId); // 未登録なら全員に届ける
}

/** 今は通知を控える時間帯か(quiet hours)。 */
export function isQuietNow(state: BabyrinState, now = new Date()): boolean {
  const h = jstHour(now);
  const { start, end } = state.settings.quietHours;
  // 例 22-7 のように日跨ぎに対応。
  return start <= end ? h >= start && h < end : h >= start || h < end;
}

/**
 * つつくべきメッセージを計算し、state を更新する。
 * 戻り値: ユーザーごとにまとめた配信物。空なら送るものなし。
 * force=true で quiet hours を無視(手動テスト用)。
 */
export function computeNudges(
  state: BabyrinState,
  opts: { now?: Date; force?: boolean } = {},
): NudgeDelivery[] {
  const now = opts.now ?? new Date();
  const today = jstDateStr(now);
  const buckets = new Map<string, string[]>();

  if (!opts.force && isQuietNow(state, now)) return [];

  const addFor = (owner: Owner, message: string) => {
    for (const uid of userIdsForOwner(state, owner)) {
      const list = buckets.get(uid) ?? [];
      list.push(message);
      buckets.set(uid, list);
    }
  };

  // ── チャレンジ ──
  for (const c of state.challenges) {
    if (!c.active) continue;
    if (c.lastNudgedDate === today) continue; // 1日1回まで

    const broken = streakBrokenSince(c, today);
    if (broken !== null) {
      // 途切れかけ → 責めずに再開さそい
      addFor(c.owner, p.recovery(c, broken));
      c.lastNudgedDate = today;
      continue;
    }
    if (isDueToday(c, today) && !isDoneToday(c, today)) {
      addFor(c.owner, p.nudgeChallenge(c));
      c.lastNudgedDate = today;
    }
  }

  // ── タスク ──
  for (const t of state.tasks) {
    if (t.done) continue;
    if (t.lastNudgedDate === today) continue;

    const age = taskAge(t, today);
    const overdue = t.due ? t.due <= today : false;
    if (overdue || age >= state.settings.taskStaleDays) {
      addFor(t.owner, p.nudgeTask(t, age));
      t.lastNudgedDate = today;
      t.nudgeCount += 1;
    }
  }

  return Array.from(buckets.entries()).map(([userId, messages]) => ({
    userId,
    messages,
  }));
}
