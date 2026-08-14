// LINE Webhook 受信エンドポイント。
// LINE Developers のチャンネル > Messaging API > Webhook URL に
//   https://<デプロイ先>/api/line/webhook
// を設定する。

import { NextRequest } from "next/server";
import { verifySignature, reply, type LineWebhookBody } from "@/lib/babyrin/line";
import { loadState, saveState } from "@/lib/babyrin/store";
import { handleMessage, type Sender } from "@/lib/babyrin/commands";
import type { Role } from "@/lib/babyrin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 署名検証には「生のボディ文字列」が必要。
  const raw = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!verifySignature(raw, signature)) {
    return new Response("invalid signature", { status: 401 });
  }

  let body: LineWebhookBody;
  try {
    body = JSON.parse(raw) as LineWebhookBody;
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const state = await loadState();
  let dirty = false;

  // 各イベントを順に処理。テキストメッセージのみ反応する。
  for (const event of body.events ?? []) {
    const userId = event.source?.userId;

    if (event.type === "message" && event.message?.type === "text" && event.replyToken) {
      const role = state.users.find((u) => u.userId === userId)?.role as Role | undefined;
      const sender: Sender = { userId: userId ?? "unknown", role };
      const messages = handleMessage(state, sender, event.message.text ?? "");
      dirty = true;
      try {
        await reply(event.replyToken, messages);
      } catch (err) {
        console.error("[babyrin] reply failed:", err);
      }
    } else if (event.type === "follow" && event.replyToken) {
      // 友だち追加時のあいさつ。
      const { welcome } = await import("@/lib/babyrin/persona");
      try {
        await reply(event.replyToken, welcome());
      } catch (err) {
        console.error("[babyrin] follow reply failed:", err);
      }
    }
  }

  if (dirty) await saveState(state);

  // LINE には常に 200 を返す(再送ループを避ける)。
  return new Response("ok", { status: 200 });
}

// LINE の Webhook 検証(接続確認)は GET は来ないが、疎通確認用に用意。
export async function GET() {
  return Response.json({ ok: true, service: "babyrin", endpoint: "line-webhook" });
}
