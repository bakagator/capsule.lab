import type { ButtonHTMLAttributes, ReactNode } from "react";

export function GameWindow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 ${className}`}
      style={{
        background: "var(--rpg-window)",
        color: "var(--rpg-on-window)",
        border: "3px solid var(--rpg-window-border)",
        boxShadow: "0 0 0 3px var(--rpg-window), 0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      {children}
    </div>
  );
}

export function GameButton({
  children,
  variant = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "ghost" }) {
  const styles = {
    default: { background: "var(--rpg-window-2)", color: "var(--rpg-on-window)", border: "2px solid var(--rpg-on-window-muted)" },
    primary: { background: "var(--rpg-gold)", color: "#1f2442", border: "2px solid var(--rpg-gold)" },
    ghost: { background: "transparent", color: "var(--rpg-on-window)", border: "2px solid transparent" },
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2.5 ${className.includes("text-center") ? "" : "text-left"} font-bold transition-opacity enabled:hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      style={{ fontSize: "15px", ...styles, ...props.style }}
    >
      {children}
    </button>
  );
}

export function StatBar({
  label,
  value,
  max,
  color,
  unit = "",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div>
      <div className="flex justify-between text-xs" style={{ color: "var(--rpg-on-window-muted)" }}>
        <span>{label}</span>
        <span style={{ color: "var(--rpg-on-window)" }}>
          {value}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${ratio * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function fillName(text: string, name: string) {
  return text.replaceAll("{name}", name);
}
