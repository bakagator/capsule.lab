// LINE Messaging API クライアント(fetch + node:crypto の薄いラッパー)。
// 公式SDKを入れず依存を増やさない方針。必要なのは reply / push / 署名検証だけ。
//
// 参考: https://developers.line.biz/ja/reference/messaging-api/

import crypto from "node:crypto";

const REPLY_URL = "https://api.line.me/v2/bot/message/reply";
const PUSH_URL = "https://api.line.me/v2/bot/message/push";

function channelSecret(): string {
  const s = process.env.LINE_CHANNEL_SECRET;
  if (!s) throw new Error("LINE_CHANNEL_SECRET is not set");
  return s;
}

function accessToken(): string {
  const t = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!t) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  return t;
}

/** LINE の x-line-signature を検証する。body は生の文字列を渡すこと。 */
export function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("SHA256", channelSecret())
    .update(body)
    .digest("base64");
  // タイミング安全比較。長さが違うと throw するので try で包む。
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}

// ── 受信イベント型(必要な範囲だけ) ──────────────────────────

export type LineWebhookBody = {
  destination?: string;
  events: LineEvent[];
};

export type LineEvent = {
  type: string; // "message" | "follow" | "unfollow" | ...
  replyToken?: string;
  source?: { type: string; userId?: string };
  message?: { type: string; text?: string };
};

// ── 送信 ────────────────────────────────────────────────────

type TextMessage = { type: "text"; text: string };

function toMessages(text: string | string[]): TextMessage[] {
  const arr = Array.isArray(text) ? text : [text];
  // LINE は 1 リクエスト最大5メッセージ・各5000文字。安全側に丸める。
  return arr.slice(0, 5).map((t) => ({ type: "text", text: t.slice(0, 4900) }));
}

/** replyToken を使った返信(受信への同期応答。無料・推奨)。 */
export async function reply(
  replyToken: string,
  text: string | string[],
): Promise<void> {
  const res = await fetch(REPLY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken()}`,
    },
    body: JSON.stringify({ replyToken, messages: toMessages(text) }),
  });
  if (!res.ok) {
    throw new Error(`LINE reply failed ${res.status}: ${await res.text()}`);
  }
}

/** 任意タイミングで送る push(お尻叩き用)。 */
export async function push(
  to: string,
  text: string | string[],
): Promise<void> {
  const res = await fetch(PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken()}`,
    },
    body: JSON.stringify({ to, messages: toMessages(text) }),
  });
  if (!res.ok) {
    throw new Error(`LINE push failed ${res.status}: ${await res.text()}`);
  }
}
