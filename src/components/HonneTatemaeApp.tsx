"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useHitorigoto } from "@/lib/useHitorigoto";
import { SCENES, type Hitorigoto, type Mode, type Scene } from "@/lib/types";

const SCENE_ICON: Record<Scene, string> = {
  仕事: "💼",
  家族: "🏠",
  友達: "🍻",
  ひとり: "🌙",
  その他: "💭",
};

const GAP_LABEL = ["", "ほぼ本音", "ちょい建前", "それなりに建前", "かなり建前", "完全に別人"];

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

function GapMeter({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`ギャップ度 ${value}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        const El = onChange ? "button" : "span";
        return (
          <El
            key={n}
            {...(onChange ? { type: "button" as const, onClick: () => onChange(n) } : {})}
            className="inline-block rounded-sm transition-all"
            style={{
              width: onChange ? 22 : 10,
              height: onChange ? 10 : 6,
              background: on ? "var(--gap)" : "var(--surface-2)",
              border: "1px solid var(--border)",
              cursor: onChange ? "pointer" : "default",
            }}
          />
        );
      })}
    </div>
  );
}

function Card({
  item,
  mode,
  onDelete,
}: {
  item: Hitorigoto;
  mode: Mode;
  onDelete: (id: string) => void;
}) {
  const [peek, setPeek] = useState(false);
  const revealed = mode === "honne" || peek;

  return (
    <article
      className="fade-in rounded-2xl p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span
            className="rounded-full px-2 py-0.5 font-medium"
            style={{ background: "var(--surface-2)", color: "var(--text)" }}
          >
            {SCENE_ICON[item.scene]} {item.scene}
          </span>
          <span>{timeAgo(item.timestamp)}</span>
        </div>
        <button
          onClick={() => {
            if (confirm("このひとりごとを消しますか？")) onDelete(item.id);
          }}
          aria-label="削除"
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ color: "var(--text-muted)", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>

      {/* タテマエ：口に出した言葉 */}
      <div className="flex gap-2 items-start">
        <span className="text-lg leading-none mt-1">🙂</span>
        <div
          className="relative rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed"
          style={{
            background: "var(--tatemae-bg)",
            color: "var(--tatemae-text)",
            opacity: mode === "honne" ? 0.55 : 1,
            whiteSpace: "pre-wrap",
            transition: "opacity 0.3s",
          }}
        >
          「{item.tatemae}」
        </div>
      </div>

      {/* ホンネ：心の声 */}
      {item.honne && (
        <div className="flex gap-2 items-start mt-2.5 pl-6">
          <span className="text-lg leading-none mt-1">😈</span>
          <button
            type="button"
            onClick={() => mode === "tatemae" && setPeek((v) => !v)}
            className="relative text-left rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed flex-1"
            style={{
              background: "var(--honne-bg)",
              color: "var(--honne-text)",
              border: "1px dashed var(--honne-border)",
              cursor: mode === "tatemae" ? "pointer" : "default",
              whiteSpace: "pre-wrap",
            }}
            aria-label={revealed ? "ホンネ" : "タップしてホンネをのぞく"}
          >
            <span
              style={{
                filter: revealed ? "none" : "blur(6px)",
                transition: "filter 0.3s",
                userSelect: revealed ? "auto" : "none",
              }}
            >
              （{item.honne}）
            </span>
            {!revealed && (
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: "var(--honne-text)" }}
              >
                👀 タップしてホンネをのぞく
              </span>
            )}
          </button>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mt-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <span>ギャップ度</span>
        <GapMeter value={item.gap} />
      </div>
    </article>
  );
}

function Composer({
  onSubmit,
}: {
  onSubmit: (v: { tatemae: string; honne: string; scene: Scene; gap: number }) => void;
}) {
  const [tatemae, setTatemae] = useState("");
  const [honne, setHonne] = useState("");
  const [scene, setScene] = useState<Scene>("仕事");
  const [gap, setGap] = useState(3);
  const canPost = tatemae.trim().length > 0;

  const field = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontFamily: "inherit",
  } as const;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canPost) return;
        onSubmit({ tatemae, honne, scene, gap });
        setTatemae("");
        setHonne("");
        setGap(3);
      }}
      className="rounded-2xl p-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
    >
      <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-muted)" }}>
        🙂 タテマエ（口に出した言葉）
      </label>
      <textarea
        value={tatemae}
        onChange={(e) => setTatemae(e.target.value)}
        placeholder="例：いえいえ、全然大丈夫ですよ！"
        rows={2}
        className="w-full rounded-xl p-3 text-sm resize-none outline-none"
        style={field}
      />

      <label className="block text-xs font-bold mt-3 mb-1.5" style={{ color: "var(--text-muted)" }}>
        😈 ホンネ（心の声・任意）
      </label>
      <textarea
        value={honne}
        onChange={(e) => setHonne(e.target.value)}
        placeholder="例：全然大丈夫じゃない。"
        rows={2}
        className="w-full rounded-xl p-3 text-sm resize-none outline-none"
        style={{ ...field, borderStyle: "dashed" }}
      />

      <div className="flex flex-wrap gap-1.5 mt-3">
        {SCENES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScene(s)}
            className="text-xs rounded-full px-3 py-1 transition-all"
            style={{
              background: scene === s ? "var(--primary)" : "var(--surface-2)",
              color: scene === s ? "var(--on-primary)" : "var(--text-muted)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            {SCENE_ICON[s]} {s}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <div>
          <p className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>
            ギャップ度：<b style={{ color: "var(--text)" }}>{GAP_LABEL[gap]}</b>
          </p>
          <GapMeter value={gap} onChange={setGap} />
        </div>
        <button
          type="submit"
          disabled={!canPost}
          className="text-sm font-bold rounded-full px-5 py-2 transition-all shrink-0"
          style={{
            background: canPost ? "var(--primary)" : "var(--surface-2)",
            color: canPost ? "var(--on-primary)" : "var(--text-muted)",
            cursor: canPost ? "pointer" : "default",
          }}
        >
          ひとりごつ 💬
        </button>
      </div>
    </form>
  );
}

export default function HonneTatemaeApp() {
  const { items, loaded, add, remove } = useHitorigoto();
  const [mode, setMode] = useState<Mode>("tatemae");
  const [filter, setFilter] = useState<Scene | "すべて">("すべて");

  const shown = filter === "すべて" ? items : items.filter((i) => i.scene === filter);
  const avgGap = items.length ? items.reduce((s, i) => s + i.gap, 0) / items.length : 0;

  return (
    <div data-mode={mode} className="app-root min-h-screen">
      <Header mode={mode} onModeChange={setMode} />

      <main className="max-w-lg mx-auto px-4 py-6">
        <section className="text-center mb-5">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {mode === "tatemae"
              ? "今日もいい人でいられました。"
              : "ここだけの話、ぜんぶ聞いて。"}
          </p>
          <div className="flex justify-center gap-6 mt-3">
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--text)" }}>{items.length}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>ひとりごと</p>
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--text)" }}>{avgGap.toFixed(1)}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>平均ギャップ度</p>
            </div>
          </div>
        </section>

        <Composer onSubmit={add} />

        <div className="flex gap-1.5 mt-5 overflow-x-auto pb-1 -mx-4 px-4">
          {(["すべて", ...SCENES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="text-xs rounded-full px-3 py-1 shrink-0"
              style={{
                background: filter === s ? "var(--text)" : "transparent",
                color: filter === s ? "var(--bg)" : "var(--text-muted)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {!loaded ? (
            <p className="text-center text-sm py-12" style={{ color: "var(--text-muted)" }}>
              読み込み中...
            </p>
          ) : shown.length === 0 ? (
            <p className="text-center text-sm py-12" style={{ color: "var(--text-muted)" }}>
              まだひとりごとはありません 🤐
            </p>
          ) : (
            shown.map((item) => <Card key={item.id} item={item} mode={mode} onDelete={remove} />)
          )}
        </div>

        <p className="text-center text-[10px] mt-10" style={{ color: "var(--text-muted)" }}>
          ひとりごとはこの端末の中だけに保存されます 🔒
        </p>
      </main>
    </div>
  );
}
