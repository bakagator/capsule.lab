"use client";

import { useState, useRef, useEffect } from "react";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(retryMessages?: Message[]) {
    const toSend = retryMessages ?? messages;
    const userText = input.trim();

    if (!retryMessages && !userText) return;

    const nextMessages: Message[] = retryMessages
      ? toSend
      : [...toSend, { role: "user", content: userText }];

    if (!retryMessages) {
      setMessages(nextMessages);
      setInput("");
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `API Error: ${res.status}`);
      }

      const { text } = await res.json();

      if (!text || !text.trim()) {
        throw new Error("空のレスポンスが返りました");
      }

      setMessages([...nextMessages, { role: "assistant", content: text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send();
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{
          background: "var(--primary)",
          color: "#fff",
          fontSize: "24px",
          border: "none",
          cursor: "pointer",
          zIndex: 50,
        }}
        aria-label="AIチャット"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: "340px",
            height: "480px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 text-sm font-bold"
            style={{
              background: "var(--primary)",
              color: "#fff",
            }}
          >
            AIアシスタント ✨
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.length === 0 && (
              <p
                className="text-xs text-center py-8"
                style={{ color: "var(--text-muted)" }}
              >
                何でも聞いてください 🌸
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="text-sm rounded-2xl px-3 py-2 max-w-[80%]"
                  style={{
                    background:
                      m.role === "user"
                        ? "var(--primary)"
                        : "var(--surface-2)",
                    color: m.role === "user" ? "#fff" : "var(--text)",
                    borderRadius:
                      m.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="text-sm rounded-2xl px-3 py-2"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--text-muted)",
                    borderRadius: "18px 18px 18px 4px",
                  }}
                >
                  ...
                </div>
              </div>
            )}

            {error && (
              <div
                className="rounded-xl p-3 text-xs"
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#dc2626",
                }}
              >
                <p className="font-bold mb-1">APIエラー</p>
                <p>{error}</p>
                <button
                  onClick={() => send(messages)}
                  className="mt-2 text-xs font-bold underline"
                  style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  もう一度試す
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              disabled={loading}
              className="flex-1 text-sm rounded-full px-3 py-2 outline-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-full w-9 h-9 flex items-center justify-center transition-all"
              style={{
                background: input.trim() && !loading ? "var(--primary)" : "var(--surface-2)",
                color: input.trim() && !loading ? "#fff" : "var(--text-muted)",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                fontSize: "16px",
              }}
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}
