"use client";

import { useEffect, useRef, useState } from "react";
import { LESSONS, LEVEL_TITLES, MONTHS, XP_PER_LEVEL } from "@/lib/papa/data";
import { PLACES, equipment, lessonsCleared, monthsCleared, stats, treasures, type Place } from "@/lib/papa/rpg";
import { play, setSound, useSound } from "@/lib/papa/sfx";
import { currentHp, levelInfo, maxHp, useProgress, type ProgressApi } from "@/lib/papa/useProgress";
import BurpGame from "./BurpGame";
import CareQuest from "./CareQuest";
import ClassQuest from "./ClassQuest";
import MilkGame from "./MilkGame";
import MonthMap from "./MonthMap";
import { Btn, Cmd, Gauge, HpGauge, Message, TopBar, Win } from "./ui";

type Screen = "title" | "map" | Place["id"];

export default function PapaQuest() {
  const api = useProgress();
  const [screen, setScreen] = useState<Screen>("title");
  const [lastPlace, setLastPlace] = useState<Place["id"]>("home");
  const { loaded, toast } = api;

  useEffect(() => {
    if (toast?.levelUp) play("levelup");
  }, [toast]);

  const back = () => setScreen("map");

  return (
    <div className="max-w-lg mx-auto py-5">
      {toast && !toast.levelUp && (
        <div className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ top: "calc(12px + env(safe-area-inset-top, 0px))" }}>
          <div key={toast.text} className="win pop-in text-sm" style={{ padding: "8px 16px", color: "var(--gold)" }}>
            {toast.text}
          </div>
        </div>
      )}
      {toast?.levelUp && <LevelUp level={toast.level} onClose={api.dismissToast} />}

      {!loaded ? null : screen === "title" ? (
        <Title api={api} onStart={() => setScreen("map")} />
      ) : screen === "map" ? (
        <WorldMap
          api={api}
          start={lastPlace}
          onEnter={(id) => {
            setLastPlace(id);
            setScreen(id);
          }}
        />
      ) : screen === "home" ? (
        <Home api={api} onBack={back} onTitle={() => setScreen("title")} />
      ) : screen === "castle" ? (
        <CareQuest api={api} onBack={back} />
      ) : screen === "road" ? (
        <MonthMap api={api} onBack={back} />
      ) : screen === "temple" ? (
        <ClassQuest api={api} onBack={back} />
      ) : screen === "cave" ? (
        <BurpGame api={api} onBack={back} />
      ) : (
        <MilkGame api={api} onBack={back} />
      )}
    </div>
  );
}

function LevelUp({ level, onClose }: { level: number; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5, 8, 26, 0.75)", padding: "0 max(16px, env(safe-area-inset-left, 0px))" }}
    >
      <div className="win pop-in text-center w-full" style={{ maxWidth: 340 }}>
        <div style={{ fontSize: 48, lineHeight: 1.2 }}>🎉</div>
        <div className="text-lg mb-2" style={{ color: "var(--gold)" }}>
          レベルが あがった！
        </div>
        <p className="text-sm leading-relaxed mb-1">
          Lv {level}「{LEVEL_TITLES[level - 1]}」に なった！
        </p>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
          さいだいHPが {maxHp(level)} に ふえた。
          <br />
          HPが ぜんかいふく した！
        </p>
        <Btn gold onClick={onClose}>
          OK
        </Btn>
      </div>
    </div>
  );
}

function SoundToggle() {
  const on = useSound();
  return (
    <button onClick={() => setSound(!on)} className="btn" style={{ padding: "6px 12px", fontSize: 12 }}>
      {on ? "🔊 おと ON" : "🔇 おと OFF"}
    </button>
  );
}

function Title({ api, onStart }: { api: ProgressApi; onStart: () => void }) {
  const { progress } = api;
  const [name, setName] = useState("");
  const [confirmNew, setConfirmNew] = useState(false);
  const [fresh, setFresh] = useState(!progress.name);

  function begin() {
    const n = name.trim() || "パパ";
    api.reset();
    api.setName(n);
    play("levelup");
    onStart();
  }

  return (
    <div className="fade-in flex flex-col items-center gap-5 pt-6">
      <div className="text-center">
        <div className="bob" style={{ fontSize: 72, lineHeight: 1.1 }}>
          🧑‍🍼
        </div>
        <h1
          className="mt-3"
          style={{
            fontSize: 40,
            color: "var(--gold)",
            letterSpacing: "0.12em",
            textShadow: "3px 3px 0 #7A4E0E, 6px 6px 0 #05081A",
          }}
        >
          パパクエスト
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          〜 そして ちちになる 〜
        </p>
      </div>

      {fresh ? (
        <Win className="w-full" style={{ maxWidth: 340 }}>
          <label htmlFor="hero-name" className="block text-sm mb-2">
            なまえを いれてください
          </label>
          <input
            id="hero-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && begin()}
            maxLength={8}
            placeholder="パパ"
            className="w-full mb-3"
            style={{
              background: "#05081A",
              border: "2px solid var(--frame)",
              borderRadius: 4,
              padding: "8px 10px",
              color: "var(--text)",
              fontFamily: "inherit",
              fontSize: 16,
            }}
          />
          <div className="flex justify-center gap-3">
            {progress.name && <Btn onClick={() => setFresh(false)}>もどる</Btn>}
            <Btn gold onClick={begin}>
              ぼうけんを はじめる
            </Btn>
          </div>
        </Win>
      ) : (
        <Win className="w-full" style={{ maxWidth: 340, padding: "8px 10px" }}>
          <Cmd onClick={onStart}>
            <span>ぼうけんを つづける</span>
            <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
              {progress.name}　Lv {levelInfo(progress.xp).level}
            </span>
          </Cmd>
          <Cmd
            onClick={() => {
              if (confirmNew) {
                setFresh(true);
                setConfirmNew(false);
              } else {
                setConfirmNew(true);
              }
            }}
          >
            <span style={{ color: confirmNew ? "var(--danger)" : "var(--text)" }}>
              {confirmNew ? "きろくが きえます。もういちど タップで はじめから" : "はじめから"}
            </span>
          </Cmd>
        </Win>
      )}

      <SoundToggle />
      <p className="text-[11px] text-center leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 340 }}>
        こそだてパパの ための ぼうけん。ママへの きづかい・月ごとの こころの じゅんび・りょうしん学級・ゲップ・ミルクづくりを たのしく まなぼう。
      </p>
    </div>
  );
}

function placeStatus(id: Place["id"], api: ProgressApi): { text: string; done: boolean } {
  const e = api.progress.earned;
  const has = (k: string) => e[k] !== undefined;
  switch (id) {
    case "castle":
      return { text: has("care-clear") ? "★" : "", done: has("care-clear") };
    case "temple": {
      const n = lessonsCleared(e);
      return { text: `${n}/${LESSONS.length}`, done: n === LESSONS.length };
    }
    case "road": {
      const n = monthsCleared(e);
      return { text: `${n}/${MONTHS.length}`, done: n === MONTHS.length };
    }
    case "cave": {
      const d = has("burp-clear") || has("burp-gentle");
      return { text: d ? "★" : "", done: d };
    }
    case "workshop": {
      const d = has("milk-clear") || has("milk-perfect");
      return { text: d ? "★" : "", done: d };
    }
    default:
      return { text: "", done: false };
  }
}

// マップ上の飾り
const DECOR: { s: string; x: number; y: number; size?: number }[] = [
  { s: "🌲", x: 6, y: 8 }, { s: "🌲", x: 12, y: 14 }, { s: "🌲", x: 40, y: 10 }, { s: "⛰️", x: 50, y: 6, size: 30 },
  { s: "⛰️", x: 90, y: 34, size: 30 }, { s: "🌲", x: 92, y: 46 }, { s: "🌳", x: 8, y: 50 }, { s: "🌲", x: 30, y: 62 },
  { s: "🌳", x: 66, y: 80 }, { s: "🌲", x: 92, y: 86 }, { s: "🌼", x: 34, y: 44 }, { s: "🌼", x: 64, y: 40 },
];

function WorldMap({
  api,
  start,
  onEnter,
}: {
  api: ProgressApi;
  start: Place["id"];
  onEnter: (id: Place["id"]) => void;
}) {
  const { progress } = api;
  const info = levelInfo(progress.xp);
  const hpMax = maxHp(info.level);
  const [at, setAt] = useState<Place["id"]>(start);
  const [walking, setWalking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hero = PLACES.find((p) => p.id === at)!;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function go(p: Place) {
    if (walking) return;
    play("select");
    if (p.id === at) {
      onEnter(p.id);
      return;
    }
    setWalking(true);
    setAt(p.id);
    timer.current = setTimeout(() => onEnter(p.id), 700);
  }

  return (
    <div className="fade-in flex flex-col gap-3">
      <Win style={{ padding: "10px 14px" }}>
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-sm">
            {progress.name || "パパ"}
            <span className="ml-2 text-xs" style={{ color: "var(--gold)" }}>
              {info.title}
            </span>
          </span>
          <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
            Lv {info.level}
          </span>
        </div>
        <HpGauge hp={currentHp(progress)} max={hpMax} />
        <div className="flex items-center gap-2 text-xs mt-1.5 tabular-nums">
          <span style={{ color: "var(--text-muted)" }}>EX</span>
          <div className="flex-1">
            <Gauge value={info.into} max={XP_PER_LEVEL} color="var(--gold)" />
          </div>
          <span style={{ minWidth: 52, textAlign: "right", color: "var(--text-muted)" }}>
            {info.isMax ? "MAX" : `あと${XP_PER_LEVEL - info.into}`}
          </span>
        </div>
      </Win>

      <div
        className="field relative w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: "3 / 4", maxWidth: "100%", border: "3px solid var(--frame)" }}
      >
        {/* 湖と道 */}
        <div className="absolute" style={{ left: "58%", top: "30%", width: "30%", height: "18%", background: "var(--water)", borderRadius: "40% 50% 45% 55%", opacity: 0.9 }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points={`${PLACES.find((p) => p.id === "home")!.x},${PLACES.find((p) => p.id === "home")!.y} 22,30 50,52 72,16 50,52 80,64 50,52 46,86`}
            fill="none"
            stroke="var(--path)"
            strokeWidth="2.4"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </svg>
        {DECOR.map((d, i) => (
          <span
            key={i}
            className="absolute select-none pointer-events-none"
            style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.size ?? 22, transform: "translate(-50%, -50%)" }}
            aria-hidden="true"
          >
            {d.s}
          </span>
        ))}
        {PLACES.map((p) => {
          const st = placeStatus(p.id, api);
          return (
            <button
              key={p.id}
              onClick={() => go(p)}
              className="absolute flex flex-col items-center"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: 2 }}
            >
              <span style={{ fontSize: 40, lineHeight: 1, filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.45))" }}>{p.sprite}</span>
              <span
                className="text-[10px] whitespace-nowrap mt-0.5"
                style={{
                  background: "var(--win)",
                  border: `2px solid ${st.done ? "var(--gold)" : "var(--frame)"}`,
                  borderRadius: 3,
                  padding: "1px 5px",
                  color: st.done ? "var(--gold)" : "var(--text)",
                }}
              >
                {p.name}
                {st.text && ` ${st.text}`}
              </span>
            </button>
          );
        })}
        <span
          className={walking ? "" : "bob"}
          style={{
            position: "absolute",
            left: `${hero.x}%`,
            top: `${hero.y - 9}%`,
            transform: "translate(-50%, -50%)",
            fontSize: 30,
            transition: "left 0.65s steps(6), top 0.65s steps(6)",
            zIndex: 3,
            pointerEvents: "none",
          }}
          aria-label="じぶん"
        >
          🧑‍🍼
        </span>
      </div>

      <Win style={{ padding: "8px 10px" }}>
        <div className="text-xs px-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
          どこへ いく？
        </div>
        {PLACES.map((p) => {
          const st = placeStatus(p.id, api);
          return (
            <Cmd key={p.id} onClick={() => go(p)}>
              <span className="flex items-center justify-between gap-2 text-sm">
                <span>
                  {p.sprite} {p.name}
                </span>
                {st.text && <span style={{ color: st.done ? "var(--gold)" : "var(--text-muted)" }}>{st.text}</span>}
              </span>
              <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
                {p.desc}
              </span>
            </Cmd>
          );
        })}
      </Win>
    </div>
  );
}

function Home({ api, onBack, onTitle }: { api: ProgressApi; onBack: () => void; onTitle: () => void }) {
  const { progress } = api;
  const info = levelInfo(progress.xp);
  const hp = currentHp(progress);
  const hpMax = maxHp(info.level);
  const [rested, setRested] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const gear = equipment(progress.earned);
  const items = treasures(progress.earned);

  return (
    <div>
      <TopBar title="🏠 はじまりの家" onBack={onBack} />
      <div className="fade-in flex flex-col gap-3">
        {rested > 0 && (
          <Message
            key={rested}
            lines={["あかちゃんが ねている あいだに\nいっしょに ひるねした……", "HPが ぜんかいふく した！"]}
          />
        )}

        <Win>
          <div className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            つよさ
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bob" style={{ fontSize: 44, lineHeight: 1 }}>
              🧑‍🍼
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base">{progress.name || "パパ"}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                しょくぎょう：{info.title}　Lv {info.level}
              </div>
            </div>
          </div>
          <HpGauge hp={hp} max={hpMax} />
          <div className="text-xs mt-1 tabular-nums" style={{ color: "var(--text-muted)" }}>
            けいけんち {progress.xp}
            {!info.isMax && `（つぎの レベルまで ${XP_PER_LEVEL - info.into}）`}
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm tabular-nums">
            {stats(progress.earned, progress.missions).map((s) => (
              <div key={s.label} className="flex justify-between">
                <span>{s.label}</span>
                <span style={{ color: "var(--gold)" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </Win>

        <Win>
          <div className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            そうび
          </div>
          <div className="flex flex-col gap-2">
            {gear.map((g) => (
              <div key={g.slot} className="flex items-start gap-3 text-sm">
                <span className="shrink-0" style={{ width: 48, color: "var(--text-muted)" }}>
                  {g.slot}
                </span>
                {g.got ? (
                  <span>
                    {g.sprite} {g.name}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    ―― （{g.hint}）
                  </span>
                )}
              </div>
            ))}
          </div>
        </Win>

        <Win>
          <div className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            たいせつなもの
          </div>
          <div className="flex flex-col gap-1.5">
            {items.map((t) => (
              <div key={t.name} className="text-sm">
                {t.got ? (
                  <span>
                    {t.sprite} {t.name}
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    ？？？ （{t.hint}）
                  </span>
                )}
              </div>
            ))}
          </div>
        </Win>

        <Win style={{ padding: "8px 10px" }}>
          <Cmd
            onClick={() => {
              api.heal();
              setRested((n) => n + 1);
              play("levelup");
            }}
          >
            <span className="text-sm">💤 やすむ（HPを かいふく）</span>
          </Cmd>
          <Cmd onClick={onTitle}>
            <span className="text-sm">📖 タイトルへ</span>
          </Cmd>
          <Cmd
            onClick={() => {
              if (confirmReset) {
                api.reset();
                setConfirmReset(false);
                onTitle();
              } else {
                setConfirmReset(true);
              }
            }}
          >
            <span className="text-sm" style={{ color: confirmReset ? "var(--danger)" : "var(--text)" }}>
              {confirmReset ? "ほんとうに けす？ もういちど タップ" : "🗑 ぼうけんの きろくを けす"}
            </span>
          </Cmd>
          <div className="flex justify-center pt-2 pb-1">
            <SoundToggle />
          </div>
        </Win>

        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          ※ 内容は一般的な目安です。赤ちゃんやママの体調で気になることがあれば、産院・小児科・自治体の窓口に相談してください。
        </p>
      </div>
    </div>
  );
}
