// 受信テキスト → 意図解析 → 状態更新 → 返信文。
// これが定型文ベースの「頭脳」。将来 Claude に置き換えるならこの関数の中身だけ差し替える。

import { BabyrinState, Cadence, Challenge, Owner, Role, Task, Weekday } from "./types";
import { newId, recordDone } from "./domain";
import { jstDateStr, jstNow } from "./time";
import * as p from "./persona";

export type Sender = { userId: string; role?: Role };

/** 返信メッセージ(1つ以上)。副作用として state を書き換える。 */
export function handleMessage(
  state: BabyrinState,
  sender: Sender,
  rawText: string,
): string[] {
  const text = rawText.trim();

  // 役割セット(登録)は未登録でも通す。
  const role = detectRoleAssignment(text);
  if (role) {
    upsertUser(state, sender.userId, role);
    return [p.registered(role)];
  }

  // 未登録なら、まず自己紹介を促す。
  if (!sender.role) {
    if (isHelp(text)) return [p.HELP_TEXT];
    return [p.welcome()];
  }
  const me = sender.role;

  if (isHelp(text)) return [p.HELP_TEXT];

  // できた報告
  const doneTarget = matchPrefix(text, ["できた", "でき", "完了", "おわった", "終わった", "done", "やった"]);
  if (doneTarget !== null) return handleDone(state, doneTarget);

  // 一覧
  if (/^(リスト|一覧|やること一覧|todo)$/i.test(text)) {
    return [p.taskList(state.tasks)];
  }

  // 状況・ストリーク
  if (/^(状況|ステータス|status|ストリーク|進捗)$/i.test(text)) {
    return [p.statusReport(state.challenges, state.tasks)];
  }

  // チャレンジ追加
  const chBody = matchPrefix(text, ["チャレンジ", "ちゃれんじ", "習慣", "challenge"]);
  if (chBody !== null && chBody !== "") {
    const c = addChallenge(state, me, chBody);
    return [p.challengeAdded(c)];
  }

  // タスク追加
  const taskBody = matchPrefix(text, ["やること", "タスク", "todo", "やる", "task"]);
  if (taskBody !== null && taskBody !== "") {
    const t = addTask(state, me, taskBody);
    return [p.taskAdded(t)];
  }

  return [p.unknown()];
}

// ── 登録 ────────────────────────────────────────────────────

function detectRoleAssignment(text: string): Role | null {
  if (/(わたし|私|俺|僕|自分|わたしは|me).{0,3}(妻|嫁|奥さん|女房)/.test(text)) return "妻";
  if (/(わたし|私|俺|僕|自分|わたしは|me).{0,3}(夫|旦那|主人)/.test(text)) return "夫";
  if (/^(妻|嫁)$/.test(text)) return "妻";
  if (/^(夫|旦那)$/.test(text)) return "夫";
  return null;
}

function upsertUser(state: BabyrinState, userId: string, role: Role) {
  const existing = state.users.find((u) => u.userId === userId);
  if (existing) {
    existing.role = role;
  } else {
    state.users.push({ userId, role, registeredAt: jstNow().toISOString() });
  }
  // 同じ役割が別 userId に付いていたら付け替える(2人しかいない想定)。
  for (const u of state.users) {
    if (u.userId !== userId && u.role === role) {
      // 役割はユニークにしたいが、消すと相手が消えるので警告的に何もしない。
    }
  }
}

// ── 追加 ────────────────────────────────────────────────────

function addTask(state: BabyrinState, me: Role, body: string): Task {
  const { owner, rest: afterOwner } = extractOwner(body, me);
  const { due, rest: title } = extractDue(afterOwner);
  const t: Task = {
    id: newId("task"),
    title: title || body,
    owner,
    createdBy: me,
    createdAt: jstNow().toISOString(),
    due,
    done: false,
    nudgeCount: 0,
  };
  state.tasks.unshift(t);
  return t;
}

function addChallenge(state: BabyrinState, me: Role, body: string): Challenge {
  const { owner, rest: afterOwner } = extractOwner(body, me);
  const { cadence, rest: title } = extractCadence(afterOwner);
  const c: Challenge = {
    id: newId("chal"),
    title: title || afterOwner,
    owner,
    createdBy: me,
    createdAt: jstNow().toISOString(),
    cadence,
    active: true,
    history: [],
    streak: 0,
    longestStreak: 0,
    celebrated: [],
  };
  state.challenges.unshift(c);
  return c;
}

// ── できた報告 ──────────────────────────────────────────────

function handleDone(state: BabyrinState, target: string): string[] {
  const today = jstDateStr();
  const q = target.trim();

  // まずチャレンジを優先(習慣化が主目的なので)。
  const ch = findByTitle(
    state.challenges.filter((c) => c.active),
    q,
  );
  if (ch) {
    const reached = recordDone(ch, today);
    const out = [p.challengeDone(ch)];
    if (reached) out.push(p.milestone(ch, reached));
    return out;
  }

  const task = findByTitle(
    state.tasks.filter((t) => !t.done),
    q,
  );
  if (task) {
    task.done = true;
    task.doneAt = jstNow().toISOString();
    return [p.taskDone(task)];
  }

  // ターゲット未指定で、未完了チャレンジがちょうど1つなら、それを完了扱いにする。
  if (q === "") {
    const openCh = state.challenges.filter(
      (c) => c.active && c.lastDoneDate !== today,
    );
    if (openCh.length === 1) {
      const reached = recordDone(openCh[0], today);
      const out = [p.challengeDone(openCh[0])];
      if (reached) out.push(p.milestone(openCh[0], reached));
      return out;
    }
  }
  return [p.notDone(q || "それ")];
}

/** タイトル一致: 完全一致 > 含む > 含まれる の順で最良を返す。 */
function findByTitle<T extends { title: string }>(items: T[], q: string): T | null {
  if (!q) return null;
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  const nq = norm(q);
  const exact = items.find((i) => norm(i.title) === nq);
  if (exact) return exact;
  const contains = items.find((i) => norm(i.title).includes(nq));
  if (contains) return contains;
  const within = items.find((i) => nq.includes(norm(i.title)));
  return within ?? null;
}

// ── パーサ部品 ──────────────────────────────────────────────

/**
 * 先頭がキーワードのどれかなら、それ以降(コロン/スペース区切り)を返す。
 * キーワードだけ(残り空文字)のときは "" を返す。該当しなければ null。
 */
function matchPrefix(text: string, keywords: string[]): string | null {
  for (const kw of keywords) {
    if (text === kw) return "";
    const re = new RegExp(`^${escapeRe(kw)}[\\s:：、　]+(.*)$`, "i");
    const m = text.match(re);
    if (m) return m[1].trim();
    // 「毎日ストレッチ」のように区切り無しで続くケース(チャレンジ登録の別表現)
    if (text.toLowerCase().startsWith(kw.toLowerCase()) && kw.length >= 3) {
      return text.slice(kw.length).trim();
    }
  }
  return null;
}

function extractOwner(body: string, me: Role): { owner: Owner; rest: string } {
  if (/共有|ふたり|二人|一緒|夫婦/.test(body)) {
    return { owner: "共有", rest: body.replace(/(共有|ふたりで?|二人で?|一緒に|夫婦で?)/g, "").trim() };
  }
  return { owner: me, rest: body };
}

/** 期限抽出: 「8/20まで」「8月20日まで」「今日/明日/明後日まで」。 */
function extractDue(body: string): { due?: string; rest: string } {
  const now = jstNow();
  const y = now.getFullYear();

  const rel = body.match(/(今日|明日|明後日|あさって)(まで)?/);
  if (rel) {
    const add = rel[1] === "今日" ? 0 : rel[1] === "明日" ? 1 : 2;
    const d = new Date(now.getTime() + add * 86_400_000);
    const due = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return { due, rest: body.replace(rel[0], "").trim() };
  }

  const md = body.match(/(\d{1,2})[\/月](\d{1,2})日?(まで)?/);
  if (md) {
    const mo = Number(md[1]);
    const da = Number(md[2]);
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      // 過ぎた月なら来年扱い。
      const thisYear = `${y}-${pad(mo)}-${pad(da)}`;
      const due = thisYear < jstDateStr() ? `${y + 1}-${pad(mo)}-${pad(da)}` : thisYear;
      return { due, rest: body.replace(md[0], "").trim() };
    }
  }
  return { rest: body };
}

const WD_MAP: Record<string, Weekday> = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };

/** 頻度抽出。曜日指定 / 週N回 / 毎日 を判定し、残りをタイトルとする。 */
function extractCadence(body: string): { cadence: Cadence; rest: string } {
  // 週N回(例「週3」「週３回」)
  const weekly = body.match(/週\s*([0-9０-９]+)\s*回?/);
  if (weekly) {
    const times = Number(toHalf(weekly[1]));
    return {
      cadence: { type: "weekly", times: Math.min(Math.max(times, 1), 7) },
      rest: body.replace(weekly[0], "").trim(),
    };
  }

  // 曜日指定。「月水金」「月・水・金」「火曜」など、末尾にまとまった曜日表現があるとき。
  // 誤検出を避けるため、2文字以上連続 or 「◯曜(日)」形式のときだけ曜日扱いにする。
  const wdBlock = body.match(/([日月火水木金土](曜日?)?[・,、]?)+\s*$/);
  const looksLikeWeekdays =
    wdBlock && (/曜/.test(wdBlock[0]) || /[日月火水木金土][・,、日月火水木金土]/.test(wdBlock[0]));
  if (wdBlock && looksLikeWeekdays) {
    const chars = wdBlock[0].match(/[日月火水木金土]/g) ?? [];
    const days = Array.from(new Set(chars.map((c) => WD_MAP[c]))).sort() as Weekday[];
    if (days.length > 0) {
      const rest = body.slice(0, body.length - wdBlock[0].length).trim();
      return { cadence: { type: "weekdays", days }, rest };
    }
  }

  // 毎日(どこにあっても daily。タイトルからは除去)。
  if (/毎日|まいにち|everyday|daily/i.test(body)) {
    return {
      cadence: { type: "daily" },
      rest: body.replace(/毎日|まいにち|everyday|daily/gi, "").trim(),
    };
  }

  // デフォルトは毎日。
  return { cadence: { type: "daily" }, rest: body };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function toHalf(s: string): string {
  return s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function isHelp(text: string): boolean {
  return /^(ヘルプ|へるぷ|help|使い方|つかいかた|\?|？)$/i.test(text);
}
