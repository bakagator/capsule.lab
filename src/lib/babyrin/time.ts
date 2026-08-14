// 日本在住の夫婦向けなので、日付・時刻はすべて JST(Asia/Tokyo) で扱う。
// サーバーの TZ に依存しないよう、Intl でオフセットを固定する。

const JST_OFFSET_MIN = 9 * 60;

/** 指定時刻(なければ今)を JST の Date として得る。 */
export function jstNow(base: Date = new Date()): Date {
  const utc = base.getTime() + base.getTimezoneOffset() * 60_000;
  return new Date(utc + JST_OFFSET_MIN * 60_000);
}

/** JST の "YYYY-MM-DD"。 */
export function jstDateStr(base: Date = new Date()): string {
  const d = jstNow(base);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** JST の時(0-23)。 */
export function jstHour(base: Date = new Date()): number {
  return jstNow(base).getHours();
}

/** JST の曜日 0=日..6=土。 */
export function jstWeekday(base: Date = new Date()): number {
  return jstNow(base).getDay();
}

/** "YYYY-MM-DD" の差分(日数)。a - b。 */
export function daysBetween(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00Z`);
  const db = Date.parse(`${b}T00:00:00Z`);
  return Math.round((da - db) / 86_400_000);
}

/** "YYYY-MM-DD" に days を足す。 */
export function addDays(dateStr: string, days: number): string {
  const t = Date.parse(`${dateStr}T00:00:00Z`) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}
