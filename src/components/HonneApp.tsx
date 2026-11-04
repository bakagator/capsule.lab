"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Fog from "@/components/Fog";
import {
  loadDraft, loadMeta, loadPosts, saveDraft, saveMeta, savePosts,
  type Meta, type Post,
} from "@/lib/store";

const LIMIT = 280;
const MIN = 60_000;
const HOUR = 60 * MIN;
const FOG_RETURN_HOURS = 24; // 書いてから霧が戻りきるまで
const RING = 62.83;
const HINT = "「残す」は記録に。「流す」は保存せず、空気に溶かすだけ。";

const SAMPLES: Post[] = [
  { id: "s1", text: "「全然大丈夫です」って言ったけど、正直ちょっと多い。", ts: 0, cleared: false },
  { id: "s2", text: "昼なに食べよう。いや、その前にあのメール返さないと。", ts: 0, cleared: false },
  { id: "s3", text: "ずっと気になってた件、聞いてみたら一瞬で解決した。", ts: 0, cleared: true },
];
const RELEASE_LINES = ["流しました。", "独り言は空気に溶けました。", "言ったらおしまい、で大丈夫。"];
const KEEP_LINES = ["置いておきました。", "頭の外に出せました。", "書いたら少し整理されたかも。"];

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];
const count = (s: string) => [...s].length;
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function ago(ts: number, now: number) {
  const m = Math.floor((now - ts) / MIN);
  if (m < 1) return "たった今";
  if (m < 60) return `${m}分`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間`;
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function fogLevel(posts: Post[], meta: Meta, now: number) {
  const last = Math.max(meta.lastVent, ...posts.map((p) => p.ts), 0);
  if (!last) return 0.9;
  const h = Math.max(0, now - last) / HOUR;
  return 0.08 + 0.82 * Math.min(1, h / FOG_RETURN_HOURS);
}

function weatherLabel(lv: number) {
  if (lv > 0.66) return "🌫 頭の中にぎやか";
  if (lv > 0.33) return "🌥 ちょっと考えごと";
  if (lv > 0.15) return "🌤 落ち着いてきた";
  return "☀️ 頭すっきり";
}

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="8" y="8" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Tab = "open" | "cleared";

function PostItem({
  post, sample, now, confirming, copied,
  onToggleClear, onCopy, onAskDelete, onCancelDelete, onDelete,
}: {
  post: Post; sample?: boolean; now: number; confirming: boolean; copied: boolean;
  onToggleClear: () => void; onCopy: () => void; onAskDelete: () => void; onCancelDelete: () => void; onDelete: () => void;
}) {
  return (
    <article className={`post pad${post.cleared ? " cleared" : ""}`}>
      <Image className="avatar" src="/avatar.jpg" alt="" width={40} height={40} />
      <div className="post-main">
        <div className="post-head">
          <b>マツダ</b>
          <span>@matsuda_honne · {sample ? "例" : ago(post.ts, now)}</span>
          {post.cleared && <em className="badge sun">☀️ すっきり</em>}
          {sample && <em className="badge">サンプル</em>}
        </div>
        <p className="post-text">{post.text}</p>
        {!sample && (
          <div className="post-bar">
            {confirming ? (
              <span className="confirm">
                この独り言を消しますか？
                <button type="button" className="yes" onClick={onDelete}>消す</button>
                <button type="button" className="no" onClick={onCancelDelete}>やめる</button>
              </span>
            ) : (
              <>
                <button type="button" className="act sun" aria-pressed={post.cleared} onClick={onToggleClear}>
                  <SunIcon /><span>{post.cleared ? "すっきり" : "すっきり？"}</span>
                </button>
                <button type="button" className="act" aria-label="テキストをコピー" onClick={onCopy}><CopyIcon /></button>
                <button type="button" className="act del" aria-label="消す" onClick={onAskDelete}><TrashIcon /></button>
                {copied && <span className="copied">コピーしました</span>}
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function HonneApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<Meta>({ released: 0, lastVent: 0 });
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState<Tab>("open");
  const [text, setText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [mists, setMists] = useState<{ id: string; text: string }[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 端末の保存内容はクライアントでしか読めないので、マウント後に読み込む
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setPosts(loadPosts());
    setMeta(loadMeta());
    setText(loadDraft());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const t = setInterval(() => setNow(Date.now()), 5 * MIN);
    const onVisible = () => { if (document.visibilityState === "visible") setNow(Date.now()); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", onVisible); };
  }, []);

  // 入力欄の高さを中身に合わせる
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const commitPosts = (next: Post[]) => { setPosts(next); savePosts(next); };
  const commitMeta = (next: Meta) => { setMeta(next); saveMeta(next); };
  const changeText = (v: string) => { setText(v); saveDraft(v); };

  const n = count(text);
  const left = LIMIT - n;
  const empty = !text.trim();

  function keep() {
    const body = text.trim();
    if (!body || count(body) > LIMIT) return;
    const ts = Date.now();
    commitPosts([{ id: newId(), text: body, ts, cleared: false }, ...posts]);
    commitMeta({ ...meta, lastVent: ts });
    changeText("");
    setTab("open");
    setNow(ts);
    showToast(pick(KEEP_LINES));
  }

  function release() {
    if (!text.trim()) return;
    const mist = { id: newId(), text };
    setMists((m) => [...m, mist]);
    setTimeout(() => setMists((m) => m.filter((x) => x.id !== mist.id)), 1500);
    const ts = Date.now();
    commitMeta({ released: meta.released + 1, lastVent: ts });
    changeText("");
    setNow(ts);
    showToast(pick(RELEASE_LINES));
  }

  function toggleClear(id: string) {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    if (!target.cleared) showToast("すっきりしてよかった ☀️");
    commitPosts(posts.map((p) => (p.id === id ? { ...p, cleared: !p.cleared } : p)));
  }

  function copy(post: Post) {
    try {
      navigator.clipboard.writeText(post.text).then(() => {
        setCopiedId(post.id);
        setTimeout(() => setCopiedId((c) => (c === post.id ? null : c)), 1600);
      }, () => {});
    } catch { /* コピーできない環境 */ }
  }

  const open = posts.filter((p) => !p.cleared);
  const cleared = posts.filter((p) => p.cleared);
  const level = fogLevel(posts, meta, now);
  const shown = tab === "open" ? open : cleared;
  const samples = SAMPLES.filter((s) => (tab === "open" ? !s.cleared : s.cleared));

  const itemProps = (p: Post) => ({
    post: p, now,
    confirming: confirmId === p.id,
    copied: copiedId === p.id,
    onToggleClear: () => toggleClear(p.id),
    onCopy: () => copy(p),
    onAskDelete: () => setConfirmId(p.id),
    onCancelDelete: () => setConfirmId(null),
    onDelete: () => { setConfirmId(null); commitPosts(posts.filter((x) => x.id !== p.id)); },
  });

  return (
    <div className="shell">
      <header className="topbar pad">
        <h1>マツダの『ホンネとタテマエ』</h1>
        <p>{open.length} 件の独り言</p>
      </header>

      <section aria-label="プロフィール">
        <div className="banner">
          <Image className="banner-art" src="/matsuda.jpg" alt="" width={790} height={640} preload />
          <Fog level={loaded ? level : 0.9} />
          <div className="weather" role="status">
            <span>{weatherLabel(level)}</span>
            <span className="bar"><i style={{ width: `${Math.round(level * 100)}%` }} /></span>
          </div>
        </div>
        <div className="profile pad">
          <Image className="avatar-lg" src="/avatar.jpg" alt="マツダのアイコン" width={240} height={240} preload />
          <div className="who">
            <h2>マツダ</h2>
            <div className="handle">@matsuda_honne</div>
          </div>
          <p className="bio">タテマエは本人が持ってます。ここは頭の中の独り言を、そっと置いておく場所。</p>
          <div className="facts">
            <span><b>{posts.length}</b> 独り言</span>
            <span><b>{meta.released}</b> 流した</span>
            <span><b>{cleared.length}</b> すっきり</span>
          </div>
        </div>
      </section>

      <form
        className="composer pad"
        autoComplete="off"
        onSubmit={(e) => { e.preventDefault(); keep(); }}
      >
        <Image className="avatar" src="/avatar.jpg" alt="" width={40} height={40} />
        <div className="composer-main">
          <div className="write">
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => changeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); keep(); }
              }}
              placeholder="いま、頭の中でなんて言ってる？"
              aria-label="独り言を書く"
            />
            {mists.map((m) => (
              <div key={m.id} className="mist" aria-hidden="true">{m.text}</div>
            ))}
          </div>
          <div className="composer-foot">
            <span className="hint">⌘ / Ctrl + Enter で残す</span>
            <div className="post-actions">
              <span className={`remain${left < 0 ? " over" : ""}`}>{left <= 30 ? left : ""}</span>
              <svg className={`ring${left < 0 ? " over" : left <= 30 ? " warn" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
                <circle className="track" cx="12" cy="12" r="10" />
                <circle
                  className="meter" cx="12" cy="12" r="10" transform="rotate(-90 12 12)"
                  strokeDasharray={RING} strokeDashoffset={RING * (1 - Math.min(n, LIMIT) / LIMIT)}
                />
              </svg>
              <button type="button" className="btn ghost" disabled={empty} onClick={release}>流す</button>
              <button type="submit" className="btn" disabled={empty || left < 0}>残す</button>
            </div>
          </div>
          <p className={`toast${toast ? " on" : ""}`} aria-live="polite">{toast ?? HINT}</p>
        </div>
      </form>

      <div className="tabs" role="tablist" aria-label="表示">
        <button type="button" className="tab" role="tab" aria-selected={tab === "open"} onClick={() => { setTab("open"); setConfirmId(null); }}>
          独り言{posts.length > 0 && <small>{open.length}</small>}
        </button>
        <button type="button" className="tab" role="tab" aria-selected={tab === "cleared"} onClick={() => { setTab("cleared"); setConfirmId(null); }}>
          すっきり{posts.length > 0 && <small>{cleared.length}</small>}
        </button>
      </div>

      <div aria-live="polite">
        {!loaded ? (
          <p className="empty pad">読み込んでいます…</p>
        ) : posts.length === 0 ? (
          <>
            <p className="sample-note pad">まだ何もありません。下はサンプルです。頭に浮かんだことを上の欄に書いて、残すか流すかを選んでください。</p>
            {samples.map((s) => <PostItem key={s.id} {...itemProps(s)} sample />)}
          </>
        ) : shown.length > 0 ? (
          shown.map((p) => <PostItem key={p.id} {...itemProps(p)} />)
        ) : tab === "cleared" ? (
          <div className="empty pad"><b>まだ「すっきり」はありません</b>片づいた独り言に ☀️ をつけると、ここに移ります。</div>
        ) : (
          <div className="empty pad"><b>いまは頭の中しずか ☀️</b>また何か浮かんだら、上の欄にどうぞ。</div>
        )}
      </div>

      <p className="foot pad">独り言はこのiPhone（ブラウザ）の中にだけ保存されます 🔒</p>
    </div>
  );
}
