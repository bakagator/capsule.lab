import Anthropic from "@anthropic-ai/sdk";
import type { NewsItem, Platform, Variant } from "./types";
import { PLATFORMS } from "./platforms";
import { matsudaVoice } from "./voice";

const MODEL = "claude-opus-5";

function buildSystemPrompt(platforms: Platform[]): string {
  const v = matsudaVoice;
  const platformSpecs = platforms
    .map((p) => {
      const meta = PLATFORMS[p];
      return `- ${meta.label} (キー: "${p}"): ${meta.kind === "short" ? "短文" : "長文"}、${meta.charLimit}文字以内`;
    })
    .join("\n");

  const samplesBlock =
    v.samples.length > 0
      ? `\n# 過去投稿サンプル（この文体・空気感に寄せる）\n${v.samples
          .map((s, i) => `${i + 1}. ${s}`)
          .join("\n")}\n`
      : "";

  return `あなたは「${v.name}」本人として、ニュースを素材に各SNS向けの投稿文を書くライターです。

# ${v.name}のトーン
${v.tone}

# 意識すること
${v.dos.map((d) => `- ${d}`).join("\n")}

# 避けること
${v.donts.map((d) => `- ${d}`).join("\n")}
${samplesBlock}
# 出力する投稿先と制約
${platformSpecs}

各プラットフォームの文字数制約を必ず守ること。ニュース本文にない事実・数字は足さないこと。`;
}

function buildUserPrompt(news: NewsItem): string {
  return `以下のニュースをもとに、指定された各プラットフォーム向けの「${matsudaVoice.name}らしい」投稿文を作ってください。

タイトル: ${news.title}
出典: ${news.source}
概要: ${news.summary || "(概要なし。タイトルから書いてください)"}
リンク: ${news.link}`;
}

function schemaFor(platforms: Platform[]) {
  const properties: Record<string, { type: "string"; description: string }> = {};
  for (const p of platforms) {
    properties[p] = {
      type: "string",
      description: `${PLATFORMS[p].label}向けの投稿本文（${PLATFORMS[p].charLimit}文字以内）`,
    };
  }
  return {
    type: "object" as const,
    properties,
    required: platforms,
    additionalProperties: false,
  };
}

function toVariants(map: Record<string, string>, platforms: Platform[]): Variant[] {
  return platforms.map((p) => {
    const text = (map[p] ?? "").trim();
    return {
      platform: p,
      text,
      charCount: [...text].length,
      overLimit: [...text].length > PLATFORMS[p].charLimit,
    };
  });
}

// APIキーが無いときのモック生成（アプリ全体を鍵無しで動かすため）
function mockVariants(news: NewsItem, platforms: Platform[]): Variant[] {
  const map: Record<string, string> = {};
  for (const p of platforms) {
    const meta = PLATFORMS[p];
    if (meta.kind === "short") {
      map[p] = `【${matsudaVoice.name}メモ】${news.title} — これ、わたしたちの暮らしにどう効くんだろう？🤔 ${news.link}`;
    } else {
      map[p] = `${news.title}\n\nニュースを読んで、まず思ったこと。${
        news.summary || "詳細はこれから。"
      }\n\n結局のところ、身近な生活にどうつながるかで見ると分かりやすい気がしています。みなさんはどう感じますか？\n\n（※これはAPIキー未設定時のサンプル文です）`;
    }
  }
  return toVariants(map, platforms);
}

export type GenerateResult = { variants: Variant[]; mock: boolean };

export async function generateVariants(
  news: NewsItem,
  platforms: Platform[]
): Promise<GenerateResult> {
  // APIキー（またはANTHROPIC_AUTH_TOKEN）が無ければモックで返す
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return { variants: mockVariants(news, platforms), mock: true };
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    system: buildSystemPrompt(platforms),
    output_config: {
      format: { type: "json_schema", schema: schemaFor(platforms) },
    },
    messages: [{ role: "user", content: buildUserPrompt(news) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";
  let map: Record<string, string> = {};
  try {
    map = JSON.parse(raw);
  } catch {
    map = {};
  }
  return { variants: toVariants(map, platforms), mock: false };
}
