"use client";

import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  color = "var(--papa)",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-transform active:scale-95 ${className}`}
      style={{
        background: disabled ? "var(--border)" : color,
        color: disabled ? "var(--text-muted)" : "#fff",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function BackBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={onBack}
        className="rounded-full px-3 py-1.5 text-sm"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          cursor: "pointer",
        }}
      >
        ← もどる
      </button>
      <h2 className="font-bold text-base" style={{ color: "var(--text)" }}>
        {title}
      </h2>
    </div>
  );
}

export function Bar({
  value,
  max = 100,
  color = "var(--papa)",
  height = 10,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ background: "var(--surface-2)", height }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color, transition: "width 0.3s ease" }}
      />
    </div>
  );
}
