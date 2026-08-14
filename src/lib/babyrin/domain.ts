// ドメインロジック(純関数)。ストアや LINE に依存しないので単体で追いやすい。

import { Challenge, Cadence, Task, Weekday } from "./types";
import { addDays, daysBetween, jstDateStr, jstWeekday } from "./time";

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

/** そのチャレンジは「今日」やる日か?(頻度に応じて判定) */
export function isDueToday(c: Challenge, today = jstDateStr()): boolean {
  const wd = jstWeekday(new Date(`${today}T12:00:00+09:00`)) as Weekday;
  switch (c.cadence.type) {
    case "daily":
      return true;
    case "weekdays":
      return c.cadence.days.includes(wd);
    case "weekly":
      // 週◯回はゆるめ。今週まだ規定回数に達していなければ「やる日候補」。
      return countThisWeek(c, today) < c.cadence.times;
  }
}

/** 今週(月曜起点)の実施回数。 */
export function countThisWeek(c: Challenge, today = jstDateStr()): number {
  const wd = jstWeekday(new Date(`${today}T12:00:00+09:00`));
  const mondayOffset = wd === 0 ? 6 : wd - 1; // 月曜=週初め
  const weekStart = addDays(today, -mondayOffset);
  return c.history.filter((d) => d >= weekStart && d <= today).length;
}

/** 既に今日やったか。 */
export function isDoneToday(c: Challenge, today = jstDateStr()): boolean {
  return c.lastDoneDate === today || c.history.includes(today);
}

/**
 * チャレンジを「今日やった」と記録し、ストリークを更新する。
 * 既に今日記録済みなら何もしない(冪等)。
 * 戻り値: 新しく到達したマイルストーン(無ければ undefined)。
 */
export function recordDone(
  c: Challenge,
  today = jstDateStr(),
): number | undefined {
  if (isDoneToday(c, today)) return undefined;

  c.history = [today, ...c.history].slice(0, 400); // 直近~1年強を保持
  const prev = c.lastDoneDate;
  c.lastDoneDate = today;

  // ストリーク: 前回が「連続」とみなせるなら +1、そうでなければ 1 にリセット。
  c.streak = prev && isConsecutive(c, prev, today) ? c.streak + 1 : 1;
  if (c.streak > c.longestStreak) c.longestStreak = c.streak;

  const milestone = MILESTONES.find(
    (m) => c.streak >= m && !c.celebrated.includes(m),
  );
  if (milestone) c.celebrated.push(milestone);
  return milestone;
}

export const MILESTONES = [3, 7, 14, 21, 30, 50, 66, 100];

/**
 * 前回実施日 prev から今日 today までが「連続」か。
 * 頻度によって「連続」の許容間隔が変わる:
 *  - daily: 前日ならOK
 *  - weekdays: 前回の予定日以降に別の予定日を挟んでいなければOK
 *  - weekly: 8日以内ならOK(週跨ぎのゆるさ)
 */
function isConsecutive(c: Challenge, prev: string, today: string): boolean {
  const gap = daysBetween(today, prev);
  switch (c.cadence.type) {
    case "daily":
      return gap <= 1;
    case "weekdays": {
      // prev の翌日から today の前日までに、予定曜日が無ければ連続扱い。
      for (let i = 1; i < gap; i++) {
        const d = addDays(prev, i);
        const wd = jstWeekday(new Date(`${d}T12:00:00+09:00`)) as Weekday;
        if (c.cadence.days.includes(wd)) return false;
      }
      return gap >= 1;
    }
    case "weekly":
      return gap <= 8;
  }
}

/**
 * 「途切れ」判定: 予定していた実施日を1回以上すっぽかしているか。
 * 途切れていれば最後に実施してからの経過日数(gap)を返す。頻度を考慮するので、
 * 曜日指定で「金→月」のような正常な間隔は途切れ扱いしない。
 */
export function streakBrokenSince(
  c: Challenge,
  today = jstDateStr(),
): number | null {
  if (!c.lastDoneDate) return null;
  const gap = daysBetween(today, c.lastDoneDate);
  if (gap <= 0) return null;

  switch (c.cadence.type) {
    case "daily":
      // 昨日以前が最後 = 今日より前に1日以上空いている。
      return gap >= 2 ? gap : null;
    case "weekly":
      // 週◯回はゆるいので、1週間以上まるごと空いたら途切れ扱い。
      return gap >= 9 ? gap : null;
    case "weekdays": {
      // 最後の実施日の翌日〜昨日までに、予定曜日が1回でもあれば「すっぽかし」。
      const days = c.cadence.days;
      for (let i = 1; i < gap; i++) {
        const d = addDays(c.lastDoneDate, i);
        const wd = jstWeekday(new Date(`${d}T12:00:00+09:00`)) as Weekday;
        if (days.includes(wd)) return gap;
      }
      return null;
    }
  }
}

/** タスクが催促対象になる「放置日数」。 */
export function taskAge(t: Task, today = jstDateStr()): number {
  return daysBetween(today, t.createdAt.slice(0, 10));
}

export function cadenceLabel(cadence: Cadence): string {
  switch (cadence.type) {
    case "daily":
      return "毎日";
    case "weekdays": {
      const names = ["日", "月", "火", "水", "木", "金", "土"];
      return cadence.days
        .slice()
        .sort()
        .map((d) => names[d])
        .join("・");
    }
    case "weekly":
      return `週${cadence.times}回`;
  }
}
