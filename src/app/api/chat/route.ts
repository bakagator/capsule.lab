import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { messages } = await request.json();

  const cleanMessages: MessageParam[] = (messages as MessageParam[]).filter(
    (m) => {
      if (typeof m.content === "string") return m.content.trim().length > 0;
      if (Array.isArray(m.content)) {
        const cleaned = m.content.filter(
          (block) =>
            block.type !== "text" ||
            (block as { type: "text"; text: string }).text.trim().length > 0
        );
        return cleaned.length > 0;
      }
      return false;
    }
  );

  if (cleanMessages.length === 0) {
    return Response.json({ error: "メッセージが空です" }, { status: 400 });
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system:
      "あなたはまつだ夫妻のAIアシスタントです。夫婦の会話やつぶやきを見て、温かくサポートしてください。日本語で短く答えてください。",
    messages: cleanMessages,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return Response.json({ text });
}
