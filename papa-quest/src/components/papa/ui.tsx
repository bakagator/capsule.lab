"use client";

import { useEffect, useState, type ReactNode } from "react";
import { play } from "@/lib/papa/sfx";

export function Win({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`win ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  disabled,
  gold,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  gold?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={() => {
        play("select");
        onClick?.();
      }}
      disabled={disabled}
      className={`btn ${gold ? "gold" : ""} ${className}`}
      style={disabled ? { opacity: 0.4, cursor: "default" } : undefined}
    >
      {children}
    </button>
  );
}

// ▶ カーソル付きのコマンド
export function Cmd({
  children,
  onClick,
  disabled,
  className = "",
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      className={`cmd ${className}`}
      onClick={() => {
        play("select");
        onClick?.();
      }}
      disabled={disabled}
      style={style}
    >
      <span className="cur">▶</span>
      <span className="flex-1 min-w-0">{children}</span>
    </button>
  );
}

export function TopBar({ title, onBack, backLabel = "マップへ" }: { title: string; onBack: () => void; backLabel?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={onBack} className="btn" style={{ padding: "6px 12px", fontSize: 13 }}>
        ◀ {backLabel}
      </button>
      <h2 className="font-bold text-base min-w-0" style={{ color: "var(--gold)", textWrap: "balance" }}>
        {title}
      </h2>
    </div>
  );
}

export function Gauge({
  value,
  max,
  color,
  height = 10,
}: {
  value: number;
  max: number;
  color: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="w-full overflow-hidden"
      style={{ height, background: "#05081A", border: "2px solid var(--frame)", borderRadius: 3 }}
    >
      <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 0.4s steps(8)" }} />
    </div>
  );
}

export function HpGauge({ hp, max }: { hp: number; max: number }) {
  const low = hp / max < 0.3;
  return (
    <div className="flex items-center gap-2 text-xs tabular-nums">
      <span style={{ color: "var(--text-muted)" }}>HP</span>
      <div className="flex-1">
        <Gauge value={hp} max={max} color={low ? "var(--hp-low)" : "var(--hp)"} />
      </div>
      <span style={{ color: low ? "var(--hp-low)" : "var(--text)", minWidth: 52, textAlign: "right" }}>
        {hp}/{max}
      </span>
    </div>
  );
}

// 1文字ずつ表示されるメッセージ。タップで全文表示→次へ
export function Message({
  lines,
  onDone,
  speaker,
}: {
  lines: string[];
  onDone?: () => void;
  speaker?: string;
}) {
  const [page, setPage] = useState(0);
  const [shown, setShown] = useState(0);
  const text = lines[page] ?? "";
  const complete = shown >= text.length;

  useEffect(() => {
    if (complete) return;
    let tick = 0;
    const t = setInterval(() => {
      if (tick++ % 3 === 0) play("blip");
      setShown((n) => n + 1);
    }, 28);
    return () => clearInterval(t);
  }, [complete, page]);

  function advance() {
    if (!complete) {
      setShown(text.length);
      return;
    }
    if (page < lines.length - 1) {
      setPage(page + 1);
      setShown(0);
    } else {
      onDone?.();
    }
  }

  const isLast = page === lines.length - 1;

  return (
    <button
      onClick={advance}
      className="win w-full text-left relative block"
      style={{ minHeight: 104, cursor: "pointer", color: "var(--text)", fontFamily: "inherit" }}
      aria-label="メッセージを進める"
    >
      {speaker && (
        <div className="text-xs mb-1" style={{ color: "var(--gold)" }}>
          【{speaker}】
        </div>
      )}
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text.slice(0, shown)}</p>
      {complete && (!isLast || onDone) && (
        <span className="blink absolute right-3 bottom-2 text-xs" style={{ color: "var(--gold)" }}>
          ▼
        </span>
      )}
    </button>
  );
}
