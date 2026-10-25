"use client";

import { useState } from "react";
import { BAG_ITEMS, CLINIC_MONSTERS, CLINIC_QUIZ, PROCEDURES, VACCINES, type BagItem } from "@/lib/papa/life";
import { play } from "@/lib/papa/sfx";
import type { ProgressApi } from "@/lib/papa/useProgress";
import Battle from "./Battle";
import { Btn, Cmd, Message, TopBar, Win } from "./ui";

type Shop = "hub" | "office" | "clinic" | "shop";

export default function Town({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [shop, setShop] = useState<Shop>("hub");
  const back = () => setShop("hub");
  const { missions } = api.progress;
  const procDone = PROCEDURES.filter((p) => missions[p.id]).length;
  const vacDone = VACCINES.filter((v) => missions[v.id]).length;
  const bagDone = api.progress.earned["bag-clear"] !== undefined;

  if (shop === "office") return <Office api={api} onBack={back} />;
  if (shop === "clinic") return <Clinic api={api} onBack={back} />;
  if (shop === "shop") return <BagShop api={api} onBack={back} />;

  return (
    <div>
      <TopBar title="🏘️ はじまりの町" onBack={onBack} />
      <div className="fade-in flex flex-col gap-3">
        <div className="text-center" style={{ fontSize: 60, lineHeight: 1.1 }}>
          🏘️
        </div>
        <Message
          speaker="まちの ひと"
          lines={["ようこそ はじまりの町へ！", "あかちゃんを むかえる じゅんびは\nこの町で ととのえると いいよ。"]}
        />
        <Win style={{ padding: "8px 10px" }}>
          <div className="text-xs px-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
            どこに はいる？
          </div>
          <Cmd onClick={() => setShop("office")}>
            <Row sprite="🏢" name="やくしょ" desc="出生前・出生後の てつづき" status={`${procDone}/${PROCEDURES.length}`} done={procDone === PROCEDURES.length} />
          </Cmd>
          <Cmd onClick={() => setShop("clinic")}>
            <Row sprite="🏥" name="しんりょうじょ" desc="予防接種の スケジュール" status={`${vacDone}/${VACCINES.length}`} done={vacDone === VACCINES.length} />
          </Cmd>
          <Cmd onClick={() => setShop("shop")}>
            <Row sprite="🎒" name="どうぐや" desc="陣痛バッグの にもつを そろえる" status={bagDone ? "★" : ""} done={bagDone} />
          </Cmd>
        </Win>
      </div>
    </div>
  );
}

function Row({ sprite, name, desc, status, done }: { sprite: string; name: string; desc: string; status: string; done: boolean }) {
  return (
    <>
      <span className="flex items-center justify-between gap-2 text-sm">
        <span>
          {sprite} {name}
        </span>
        {status && <span style={{ color: done ? "var(--gold)" : "var(--text-muted)" }}>{status}</span>}
      </span>
      <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
        {desc}
      </span>
    </>
  );
}

function CheckRow({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="cmd text-sm" style={{ color: on ? "var(--text-muted)" : "var(--text)" }}>
      <span style={{ color: on ? "var(--hp)" : "var(--text-muted)", flexShrink: 0 }}>{on ? "■" : "□"}</span>
      <span className="flex-1 min-w-0">{children}</span>
    </button>
  );
}

function Office({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [tab, setTab] = useState<"before" | "after">("before");
  const { missions } = api.progress;
  const list = PROCEDURES.filter((p) => p.when === tab);

  function toggle(id: string) {
    const willBeOn = !missions[id];
    api.toggleMission(id);
    play(willBeOn ? "select" : "miss");
    if (willBeOn) {
      api.award(id, 10);
      const allDone = PROCEDURES.every((p) => (p.id === id ? true : missions[p.id]));
      if (allDone && api.award("proc-all", 30)) setTimeout(() => play("win"), 200);
    }
  }

  return (
    <div>
      <TopBar title="🏢 やくしょ" onBack={onBack} backLabel="町へ" />
      <div className="fade-in flex flex-col gap-3">
        <Message
          speaker="やくしょの ひと"
          lines={["てつづきの まどぐちへ ようこそ。", "うまれる まえと うまれた あとで\nやることが ちがうから、じゅんばんに すすめてね。\nきげんが あるものも あるよ！"]}
        />
        <div className="grid grid-cols-2 gap-2">
          <Btn gold={tab === "before"} onClick={() => setTab("before")}>
            🤰 出生前
          </Btn>
          <Btn gold={tab === "after"} onClick={() => setTab("after")}>
            👶 出生後
          </Btn>
        </div>
        <Win style={{ padding: "8px 10px" }}>
          {list.map((p) => (
            <CheckRow key={p.id} on={!!missions[p.id]} onClick={() => toggle(p.id)}>
              <span className="block" style={{ textDecoration: missions[p.id] ? "line-through" : "none" }}>
                {p.title}
              </span>
              <span className="block text-[11px] mt-0.5" style={{ color: "var(--gold)" }}>
                ⏰ {p.deadline}
              </span>
              <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
                📍 {p.where}
                <br />
                {p.memo}
              </span>
            </CheckRow>
          ))}
        </Win>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          ※ 制度や期限は変わることがあります。くわしくは お住まいの市区町村・勤務先・健康保険で確認してください。
        </p>
      </div>
    </div>
  );
}

function Clinic({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [phase, setPhase] = useState<"schedule" | "battle" | "done">("schedule");
  const [round, setRound] = useState(0);
  const { missions } = api.progress;

  function toggle(id: string) {
    const willBeOn = !missions[id];
    api.toggleMission(id);
    play(willBeOn ? "select" : "miss");
    if (willBeOn) api.award(id, 10);
  }

  return (
    <div>
      <TopBar title="🏥 しんりょうじょ" onBack={onBack} backLabel="町へ" />
      {phase === "schedule" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 56, lineHeight: 1.1 }}>
            🧑‍⚕️
          </div>
          <Message
            speaker="おいしゃさん"
            lines={[
              "よぼうせっしゅは あかちゃんを まもる\nだいじな「ぼうぎょまほう」だよ。",
              "うまれて 2ヶ月から いっきに はじまるから\nかかりつけの 小児科を きめて\nはやめに よやくしよう。",
            ]}
          />
          <Win style={{ padding: "8px 10px" }}>
            <div className="text-xs px-1.5 mb-1" style={{ color: "var(--gold)" }}>
              📅 ていき せっしゅの めやす（うけたら チェック）
            </div>
            {VACCINES.map((v) => (
              <CheckRow key={v.id} on={!!missions[v.id]} onClick={() => toggle(v.id)}>
                <span className="block">{v.age}</span>
                <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {v.shots.join("／")}
                </span>
              </CheckRow>
            ))}
          </Win>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            ※ 標準的なスケジュールの目安です。おたふくかぜ等の任意接種や、実際の日程は かかりつけ医・自治体の案内で確認してください。
          </p>
          <div className="flex justify-center">
            <Btn
              gold
              onClick={() => {
                setRound((r) => r + 1);
                setPhase("battle");
              }}
            >
              ⚔ びょうきの まものに いどむ
            </Btn>
          </div>
        </div>
      )}
      {phase === "battle" && (
        <Battle
          key={round}
          encounters={CLINIC_QUIZ.map((q) => ({ question: q, monster: CLINIC_MONSTERS[q.id] }))}
          api={api}
          xpPerWin={15}
          onClear={() => {
            api.award("vac-clear", 20);
            setPhase("done");
          }}
        />
      )}
      {phase === "done" && (
        <div className="fade-in flex flex-col gap-3">
          <div className="text-center" style={{ fontSize: 56, lineHeight: 1.1 }}>
            🧑‍⚕️
          </div>
          <Message
            speaker="おいしゃさん"
            lines={[
              "おみごと！ これで よぼうせっしゅは ばっちりだね。",
              "よるや きゅうじつに こまったら\n#8000（こども いりょう でんわそうだん）も\nおぼえておいてね。",
            ]}
          />
          <div className="flex justify-center">
            <Btn gold onClick={() => setPhase("schedule")}>
              スケジュールへ もどる
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const NEEDED = BAG_ITEMS.filter((i) => i.need).length;

function BagShop({ api, onBack }: { api: ProgressApi; onBack: () => void }) {
  const [shelf, setShelf] = useState(() => shuffle(BAG_ITEMS));
  const [bag, setBag] = useState<BagItem[]>([]);
  const [last, setLast] = useState<{ item: BagItem; ok: boolean } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const done = bag.length === NEEDED;

  function pick(item: BagItem) {
    if (done) return;
    setLast({ item, ok: item.need });
    if (item.need) {
      play("select");
      const next = [...bag, item];
      setBag(next);
      setShelf((s) => s.filter((x) => x.id !== item.id));
      if (next.length === NEEDED) {
        setTimeout(() => play("win"), 200);
        api.award("bag-clear", 50);
        if (mistakes === 0) api.award("bag-perfect", 20);
      }
    } else {
      play("damage");
      setMistakes((m) => m + 1);
      setShakeId(item.id);
      setTimeout(() => setShakeId(null), 400);
    }
  }

  function restart() {
    setShelf(shuffle(BAG_ITEMS));
    setBag([]);
    setLast(null);
    setMistakes(0);
  }

  return (
    <div>
      <TopBar title="🎒 どうぐや" onBack={onBack} backLabel="町へ" />
      <div className="fade-in flex flex-col gap-3">
        <Message
          speaker="どうぐやの おやじ"
          lines={["へい らっしゃい！", "じんつうが きたら すぐ でかけられるように\nじんつうバッグを つめておきな。\nいらない ものを いれると おもくなるぜ！"]}
        />

        <Win style={{ padding: "10px 14px" }}>
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: "var(--gold)" }}>🎒 じんつうバッグ</span>
            <span className="tabular-nums" style={{ color: "var(--text-muted)" }}>
              {bag.length}/{NEEDED}　しっぱい {mistakes}
            </span>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {Array.from({ length: NEEDED }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{ aspectRatio: "1", border: "2px solid var(--frame)", borderRadius: 4, background: "#05081A", fontSize: 22 }}
              >
                {bag[i] ? <span className="pop-in">{bag[i].sprite}</span> : ""}
              </div>
            ))}
          </div>
        </Win>

        {last && (
          <Win key={`${last.item.id}-${mistakes}-${bag.length}`} className="pop-in" style={{ padding: "10px 14px" }}>
            <div className="text-sm" style={{ color: last.ok ? "var(--hp)" : "var(--danger)" }}>
              {last.ok ? "○" : "×"} {last.item.sprite} {last.item.name}
            </div>
            <p className="text-xs leading-relaxed mt-1">{last.item.reason}</p>
          </Win>
        )}

        {!done ? (
          <Win style={{ padding: "8px 10px" }}>
            <div className="text-xs px-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
              なにを いれる？
            </div>
            <div className="grid grid-cols-2 gap-1">
              {shelf.map((item) => (
                <button
                  key={item.id}
                  onClick={() => pick(item)}
                  className={`cmd text-xs ${shakeId === item.id ? "shake" : ""}`}
                  style={{ color: shakeId === item.id ? "var(--danger)" : "var(--text)" }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{item.sprite}</span>
                  <span className="flex-1 min-w-0">{item.name}</span>
                </button>
              ))}
            </div>
          </Win>
        ) : (
          <>
            <Message
              speaker="どうぐやの おやじ"
              lines={[
                mistakes === 0 ? "ノーミスとは やるじゃねえか！" : "よし、これで ばっちりだ！",
                "🎒 じんつうバッグ を てにいれた！",
                "にゅういんバッグ（さんじょくショーツ・じゅにゅうブラ・\nたいいんの日の あかちゃんの ふく など）は\nべつに よういしておくんだぜ。",
                "げんかんの ちかくに おいて、ばしょを ママと\nきょうゆう しておけば かんぺきだ！",
              ]}
            />
            <div className="flex justify-center gap-3">
              <Btn onClick={restart}>もういちど</Btn>
              <Btn gold onClick={onBack}>
                町へ もどる
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
