"use client";

import { useState, useRef, useEffect } from "react";
import { useTsubuyaki } from "@/lib/useTsubuyaki";
import type { Author, Tsubuyaki } from "@/lib/types";

const REACTIONS = [
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🤍", "🖤",
  "💕", "💞", "💗", "💝", "😍", "😘", "🥰", "🥹",
  "😂", "🤣", "😆", "😄", "😊", "🥲", "😭", "😢",
  "🥺", "😮", "🤩", "🤗", "😏", "🤔", "👀", "😎",
  "🔥", "✨", "🌸", "🌺", "🎉", "🎊", "👏", "🙌",
  "💪", "🤜", "🍀", "🌈", "🎵", "💫", "🌙", "⭐",
  "🌟", "🎯", "🐾", "🦋", "🌻", "🍓", "🍰", "🫶",
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
}

function ReactionPicker({
  onSelect,
  onClose,
}: {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="pop-in absolute z-30 rounded-2xl p-3 shadow-xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        bottom: "calc(100% + 8px)",
        left: 0,
        width: "272px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: "4px",
        }}
      >
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => { onSelect(emoji); onClose(); }}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              fontSize: "22px",
              padding: "4px",
              background: "transparent",
              cursor: "pointer",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--surface-2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function PostCard({
  item,
  viewer,
  onReaction,
  onDelete,
}: {
  item: Tsubuyaki;
  viewer: Author;
  onReaction: (id: string, emoji: string) => void;
  onDelete: (id: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const isWife = item.author === "妻";
  const authorColor = isWife ? "var(--wife)" : "var(--husband)";
  const authorBg = isWife ? "var(--wife-bg)" : "var(--husband-bg)";

  const reactionEntries = Object.entries(item.reactions).filter(
    ([, authors]) => authors.length > 0
  );

  return (
    <div
      className="fade-in rounded-2xl p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-bold rounded-full px-3 py-0.5"
            style={{ background: authorBg, color: authorColor }}
          >
            {item.author}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {timeAgo(item.timestamp)}
          </span>
        </div>
        {item.author === viewer && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs rounded-full px-2 py-0.5 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Text */}
      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "var(--text)", whiteSpace: "pre-wrap" }}
      >
        {item.text}
      </p>

      {/* Reactions */}
      <div className="flex flex-wrap items-center gap-1.5 relative">
        {reactionEntries.map(([emoji, authors]) => {
          const reacted = authors.includes(viewer);
          return (
            <button
              key={emoji}
              onClick={() => onReaction(item.id, emoji)}
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm transition-all"
              style={{
                background: reacted ? "var(--primary-light)" : "var(--surface-2)",
                border: reacted
                  ? "1px solid var(--primary)"
                  : "1px solid var(--border)",
                color: reacted ? "var(--primary)" : "var(--text-muted)",
                fontWeight: reacted ? 600 : 400,
                cursor: "pointer",
              }}
            >
              <span>{emoji}</span>
              <span style={{ fontSize: "11px" }}>{authors.length}</span>
            </button>
          );
        })}

        {/* Add reaction button */}
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="rounded-full px-2.5 py-0.5 text-sm transition-colors"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--primary)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--text-muted)";
            }}
          >
            + 反応
          </button>
          {pickerOpen && (
            <ReactionPicker
              onSelect={(emoji) => onReaction(item.id, emoji)}
              onClose={() => setPickerOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PostForm({
  viewer,
  onViewerChange,
  onSubmit,
}: {
  viewer: Author;
  onViewerChange: (a: Author) => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Author toggle */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          投稿者:
        </span>
        {(["妻", "夫"] as Author[]).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => onViewerChange(a)}
            className="text-sm font-bold rounded-full px-3 py-0.5 transition-all"
            style={{
              background:
                viewer === a
                  ? a === "妻"
                    ? "var(--wife-bg)"
                    : "var(--husband-bg)"
                  : "var(--surface-2)",
              color:
                viewer === a
                  ? a === "妻"
                    ? "var(--wife)"
                    : "var(--husband)"
                  : "var(--text-muted)",
              border:
                viewer === a
                  ? `1px solid ${a === "妻" ? "var(--wife)" : "var(--husband)"}`
                  : "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="今どんな気持ち？"
        rows={3}
        className="w-full rounded-xl p-3 text-sm resize-none outline-none transition-colors"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          fontFamily: "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--primary)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      />

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={!text.trim()}
          className="text-sm font-bold rounded-full px-5 py-2 transition-all"
          style={{
            background: text.trim() ? "var(--primary)" : "var(--surface-2)",
            color: text.trim() ? "#fff" : "var(--text-muted)",
            border: "none",
            cursor: text.trim() ? "pointer" : "default",
          }}
        >
          つぶやく 💬
        </button>
      </div>
    </form>
  );
}

export default function TsubuyakiBoard() {
  const { items, loaded, addPost, toggleReaction, deletePost } =
    useTsubuyaki();
  const [viewer, setViewer] = useState<Author>("妻");

  if (!loaded) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="text-sm">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Page title */}
      <div className="text-center mb-6">
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {new Date().toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </p>
        <h1
          className="mt-1 text-lg font-bold"
          style={{ color: "var(--text)" }}
        >
          今日のつぶやき
        </h1>
      </div>

      {/* Post form */}
      <PostForm
        viewer={viewer}
        onViewerChange={setViewer}
        onSubmit={(text) => addPost(viewer, text)}
      />

      {/* Feed */}
      <div className="mt-4 flex flex-col gap-3">
        {items.length === 0 ? (
          <p
            className="text-center text-sm py-12"
            style={{ color: "var(--text-muted)" }}
          >
            まだつぶやきはありません ✨
          </p>
        ) : (
          items.map((item) => (
            <PostCard
              key={item.id}
              item={item}
              viewer={viewer}
              onReaction={(id, emoji) => toggleReaction(id, emoji, viewer)}
              onDelete={deletePost}
            />
          ))
        )}
      </div>
    </div>
  );
}
