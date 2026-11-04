import type { Mode } from "@/lib/types";

export default function Header({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
}) {
  return (
    <header
      className="sticky top-0 z-50 px-4 py-3"
      style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.4s ease",
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        <div className="leading-tight min-w-0">
          <p className="text-[10px] tracking-widest" style={{ color: "var(--text-muted)" }}>
            松田の独り言アプリ
          </p>
          <h1 className="text-[15px] font-bold leading-snug" style={{ color: "var(--text)" }}>
            マツダの<span className="inline-block">『ホンネとタテマエ』</span>
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="表示モード"
          className="flex shrink-0 rounded-full p-1"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          {(
            [
              ["tatemae", "🙂 タテマエ"],
              ["honne", "😈 ホンネ"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => onModeChange(m)}
              className="text-xs font-bold rounded-full px-3 py-1.5 transition-all"
              style={{
                background: mode === m ? "var(--primary)" : "transparent",
                color: mode === m ? "var(--on-primary)" : "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
