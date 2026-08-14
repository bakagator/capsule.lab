// お尻叩き実行エンドポイント(cron から定期的に叩く)。
//
// 呼び出し方:
//   GET/POST /api/cron/nudge
//   認証: ヘッダ  Authorization: Bearer <CRON_SECRET>
//         または  ?key=<CRON_SECRET>
//   テスト: ?force=1 を付けると quiet hours を無視して即つつく。
//
// Vercel Cron を使う場合は vercel.json の crons で 30分おき等に設定し、
// Vercel が付与する Authorization: Bearer <CRON_SECRET> がそのまま通る。

import { NextRequest } from "next/server";
import { loadState, saveState } from "@/lib/babyrin/store";
import { computeNudges } from "@/lib/babyrin/nudge";
import { push } from "@/lib/babyrin/line";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // 未設定なら保護なし(ローカル/デモ)
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const key = request.nextUrl.searchParams.get("key");
  return key === secret;
}

async function run(request: NextRequest): Promise<Response> {
  if (!authorized(request)) {
    return new Response("unauthorized", { status: 401 });
  }

  const force = request.nextUrl.searchParams.get("force") === "1";
  const state = await loadState();
  const deliveries = computeNudges(state, { force });

  let sent = 0;
  const failures: string[] = [];
  for (const d of deliveries) {
    try {
      await push(d.userId, d.messages);
      sent += d.messages.length;
    } catch (err) {
      failures.push(String(err));
      console.error("[babyrin] nudge push failed:", err);
    }
  }

  // 送れたぶんだけ lastNudgedDate 等が進んでいる。保存する。
  await saveState(state);

  return Response.json({
    ok: true,
    recipients: deliveries.length,
    messagesSent: sent,
    failures,
  });
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}
