import type { Draft, Platform } from "./types";
import { PLATFORMS } from "./platforms";

// フェーズ2の投稿連携。
// 現状は「連携の枠組み」を用意した状態です。各プラットフォームの認証情報が
// 揃った段階で、下記 TODO の箇所に公式API呼び出しを実装します。
export type PublishResult = { ok: boolean; message: string };

async function publishToPlatform(
  platform: Platform,
  text: string
): Promise<PublishResult> {
  switch (platform) {
    case "note":
      // 公式APIが無いため半自動。UIの「noteにコピー」で本文を渡します。
      return {
        ok: true,
        message: "noteは半自動：本文をコピーしてnote編集画面に貼り付けてください。",
      };

    case "x":
      if (!process.env.X_ACCESS_TOKEN) {
        return { ok: false, message: "X APIキー未設定（.envを設定してください）" };
      }
      // TODO: X API v2 (POST /2/tweets) をOAuth1.0aで呼び出す
      return { ok: false, message: "X連携は未実装（キーは検出。実装待ち）" };

    case "threads":
      if (!process.env.META_ACCESS_TOKEN || !process.env.THREADS_USER_ID) {
        return { ok: false, message: "Threads(META)トークン未設定" };
      }
      // TODO: Threads API (media -> publish) を呼び出す
      return { ok: false, message: "Threads連携は未実装（トークンは検出）" };

    case "instagram":
      if (!process.env.META_ACCESS_TOKEN || !process.env.INSTAGRAM_USER_ID) {
        return { ok: false, message: "Instagram(META)トークン未設定" };
      }
      // TODO: Instagram Graph API（画像必須）を呼び出す
      return { ok: false, message: "Instagram連携は未実装（画像が別途必要）" };

    default:
      return { ok: false, message: "不明なプラットフォーム" };
  }
}

// 承認済み下書きを、対象の各プラットフォームへ投稿（試行）する。
export async function publishDraft(
  draft: Draft
): Promise<Record<string, PublishResult>> {
  const results: Record<string, PublishResult> = {};
  for (const variant of draft.variants) {
    const meta = PLATFORMS[variant.platform];
    if (variant.overLimit) {
      results[variant.platform] = {
        ok: false,
        message: `文字数オーバー（${variant.charCount}/${meta.charLimit}）。編集してください。`,
      };
      continue;
    }
    results[variant.platform] = await publishToPlatform(
      variant.platform,
      variant.text
    );
  }
  return results;
}
