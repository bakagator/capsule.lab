// べびりんの「口調」= 定型文テンプレ。
//
// ここだけがキャラクター表現の責務。ロジック(commands / nudge)からは
// 「どんな場面か」を関数で呼ぶだけにして、後で Claude 生成に差し替えても
// 呼び出し側を壊さないようにする。
//
// べびりん像: 夫婦をやさしく応援する秘書。責めない・比べない・絵文字多め。
// 続けることを何より褒める。サボっても「また一緒にやろ」と再開に誘う。

import { Challenge, Owner, Role, Task } from "./types";
import { cadenceLabel } from "./domain";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 呼びかけ。役割があれば「妻さん/夫さん」ではなく親しみを込めて。 */
function callName(role?: Role): string {
  if (role === "妻") return "おくさん";
  if (role === "夫") return "だんなさん";
  return "ふたりとも";
}

function ownerTag(owner: Owner): string {
  return owner === "共有" ? "👫共有" : owner === "妻" ? "🌸妻" : "🌿夫";
}

// ── 登録・あいさつ ────────────────────────────────────────────

export const HELP_TEXT = [
  "べびりんの使い方だよ📝",
  "",
  "▶ やること追加：「やること 牛乳かう」",
  "　 期限つき：「やること 内見予約 8/20まで」",
  "▶ チャレンジ追加：「チャレンジ 毎日ストレッチ」",
  "　 曜日指定：「チャレンジ ジム 月水金」／「チャレンジ 読書 週3」",
  "▶ できた報告：「できた ストレッチ」／「完了 牛乳」",
  "▶ 一覧：「リスト」",
  "▶ いまの状況：「状況」",
  "▶ 役割セット：「わたしは妻」「わたしは夫」",
  "",
  "毎日そっとお尻叩くから、一緒にコツコツいこ〜💪",
].join("\n");

export function welcome(): string {
  return [
    "はじめまして、べびりんです🐣",
    "夫婦専用の秘書として、やることと新しいチャレンジが続くようにお手伝いするよ！",
    "",
    "まずは「わたしは妻」か「わたしは夫」と送って、あなたを教えてね😊",
    "困ったら「ヘルプ」でいつでも使い方みれるよ。",
  ].join("\n");
}

export function registered(role: Role): string {
  return pick([
    `${callName(role)}だね、覚えたよ✍️ これからよろしくね！`,
    `おっけー、${callName(role)}として登録したよ😊 一緒にがんばろ〜`,
  ]);
}

// ── 追加確認 ────────────────────────────────────────────────

export function taskAdded(t: Task): string {
  const due = t.due ? `\n⏰ 期限：${t.due}` : "";
  return pick([
    `${ownerTag(t.owner)} 「${t.title}」だね、リストに入れたよ📌${due}\nできたら「できた ${t.title}」で教えてね！`,
    `メモした📝 ${ownerTag(t.owner)}「${t.title}」${due}\n忘れそうになったらつつくね👉`,
  ]);
}

export function challengeAdded(c: Challenge): string {
  return [
    `新しいチャレンジ、いいね🔥`,
    `${ownerTag(c.owner)}「${c.title}」（${cadenceLabel(c.cadence)}）`,
    "",
    "最初の3日がいちばん大事。べびりんが毎日そっと背中押すから、まずは今日やっちゃお💪",
  ].join("\n");
}

// ── できた報告 ──────────────────────────────────────────────

export function taskDone(t: Task): string {
  return pick([
    `「${t.title}」おつかれさま〜！ひとつ片づいたね✅🎉`,
    `やった、「${t.title}」完了！えらすぎる👏`,
    `「${t.title}」done✅ その調子その調子〜😊`,
  ]);
}

export function challengeDone(c: Challenge): string {
  const s = c.streak;
  const streakLine = s >= 2 ? `\n🔥 ${s}日連続！すごい続いてるよ` : "";
  return (
    pick([
      `「${c.title}」今日のぶんクリア✅`,
      `「${c.title}」やったね！えらい✨`,
      `ナイス、「${c.title}」できたね👏`,
    ]) + streakLine
  );
}

export function milestone(c: Challenge, reached: number): string {
  const banner =
    reached >= 30 ? "🏆🏆🏆" : reached >= 14 ? "🏆🏆" : "🏆";
  return [
    `${banner} ${reached}日連続、達成〜〜！！`,
    `「${c.title}」がもう習慣になってきてるよ。ほんとにすごい。`,
    pick([
      "この調子でいこ、べびりん感動してる🥹",
      "自分をいっぱい褒めてあげてね😊",
      "ここまで続いたの、まぐれじゃないよ。実力です👏",
    ]),
  ].join("\n");
}

// ── 一覧・状況 ──────────────────────────────────────────────

export function taskList(tasks: Task[]): string {
  const open = tasks.filter((t) => !t.done);
  if (open.length === 0) return "やることは今ぜんぶ片づいてるよ、身軽〜🕊️";
  const lines = open.map((t) => {
    const due = t.due ? `（〜${t.due}）` : "";
    return `▫️ ${ownerTag(t.owner)} ${t.title}${due}`;
  });
  return [`やることリスト（${open.length}件）📋`, ...lines].join("\n");
}

export function statusReport(challenges: Challenge[], tasks: Task[]): string {
  const active = challenges.filter((c) => c.active);
  const openTasks = tasks.filter((t) => !t.done).length;
  const lines: string[] = ["いまの状況だよ📊", ""];
  if (active.length === 0) {
    lines.push("チャレンジはまだ無し。何か始めてみる？「チャレンジ ◯◯」で登録できるよ✨");
  } else {
    lines.push("🔥 チャレンジ");
    for (const c of active) {
      const flame = c.streak >= 1 ? `${c.streak}日連続` : "これから";
      lines.push(`　${ownerTag(c.owner)} ${c.title}：${flame}（最高${c.longestStreak}日）`);
    }
  }
  lines.push("", `📋 やること残り：${openTasks}件`);
  return lines.join("\n");
}

// ── お尻叩き(nudge) ────────────────────────────────────────

/** タスク催促。放置が長いほど、そして回数が増えるほど少しだけ圧を上げる(でも責めない)。 */
export function nudgeTask(t: Task, ageDays: number): string {
  const soft = [
    `${ownerTag(t.owner)}「${t.title}」、そろそろどう？無理ないタイミングでね😊`,
    `ちょっとリマインド👉「${t.title}」まだ残ってるよ〜`,
  ];
  const firm = [
    `「${t.title}」、${ageDays}日たったよ⏳ 5分でできる部分だけでもやっちゃお？`,
    `${ownerTag(t.owner)}「${t.title}」気になってる…！ 今日ちょっとだけ触ってみない？`,
  ];
  const due = [
    `⏰「${t.title}」期限きてるよ！ここ踏ん張りどころ、いっしょにやろ💪`,
  ];
  if (t.due) return pick(due);
  return ageDays >= 4 ? pick(firm) : pick(soft);
}

/** チャレンジの本日ぶん未実施リマインド。 */
export function nudgeChallenge(c: Challenge): string {
  if (c.streak >= 2) {
    return pick([
      `🔥「${c.title}」今日まだだよ！${c.streak}日連続、ここで切らすのもったいない。いっちゃお💪`,
      `${c.streak}日つづいてる「${c.title}」、今日のぶんいこ〜！べびりん応援してる📣`,
    ]);
  }
  return pick([
    `「${c.title}」今日のぶん、まだだね。5分だけでもOK、ハードル下げていこ😊`,
    `そろそろ「${c.title}」やってみない？やった後の自分はぜったい気分いいよ✨`,
  ]);
}

/** 途切れかけ・サボり気味のときの「再開さそい」。絶対に責めない。 */
export function recovery(c: Challenge, gapDays: number): string {
  return [
    pick([
      `「${c.title}」、${gapDays}日あいちゃったね。でも大丈夫、やめてなければ続いてるのと同じ🌱`,
      `${gapDays}日ぶりに「${c.title}」の話。サボりは誰でもある、責めないよ😊`,
    ]),
    pick([
      "今日ほんの少しだけ再開してみよ。ゼロを1にするのが一番えらいんだから💪",
      "完璧じゃなくていい。今日1回やれたら、それだけでリスタート成功だよ✨",
    ]),
  ].join("\n");
}

// ── その他 ──────────────────────────────────────────────────

export function unknown(): string {
  return pick([
    "うーん、うまく聞き取れなかったかも🐣「ヘルプ」で使い方みれるよ！",
    "ごめん、それはまだ分からないみたい💦「リスト」「状況」「ヘルプ」あたり試してみて。",
  ]);
}

export function notDone(title: string): string {
  return `「${title}」に近いもの、リストに見つからなかったよ🔍 「リスト」で名前たしかめてみて！`;
}
