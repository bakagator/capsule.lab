<!DOCTYPE html>

<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Pot de</title>
<link href="https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #fdf6f0;
    --surface: #fff8f3;
    --border: #edd5bf;
    --terra: #c4602a;
    --terra-light: #f5e0d0;
    --terra-mid: #e08050;
    --sage: #7d9e78;
    --sage-light: #daecd8;
    --yellow: #e8b84b;
    --text: #3d2410;
    --muted: #a07050;
    --card: #fffaf5;
    --nav-h: 68px;
    --header-h: 60px;
  }

- { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { height: 100%; overflow: hidden; }

body {
background: var(–bg);
color: var(–text);
font-family: ‘Noto Sans JP’, sans-serif;
font-weight: 300;
}

/* warm paper texture */
body::after {
content: ‘’;
position: fixed; inset: 0;
background-image:
radial-gradient(ellipse at 20% 20%, rgba(196,96,42,0.04) 0%, transparent 60%),
radial-gradient(ellipse at 80% 80%, rgba(232,184,75,0.05) 0%, transparent 60%);
pointer-events: none; z-index: 0;
}

/* HEADER */
.header {
position: fixed; top: 0; left: 0; right: 0;
height: var(–header-h);
background: var(–terra);
display: flex; align-items: center;
padding: 0 20px; gap: 10px; z-index: 100;
}

.logo {
font-family: ‘Klee One’, cursive;
font-size: 26px; font-weight: 600;
color: #fff;
letter-spacing: 0.05em;
text-shadow: 1px 2px 4px rgba(0,0,0,0.15);
}

.logo-yomi {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: rgba(255,255,255,0.75);
margin-left: 4px; font-weight: 400;
}

.tagline {
flex: 1; text-align: right;
font-family: ‘Klee One’, cursive;
font-size: 10px; color: rgba(255,255,255,0.8);
line-height: 1.6;
}

/* SCROLL */
.scroll-area {
position: fixed;
top: var(–header-h); bottom: var(–nav-h);
left: 0; right: 0;
overflow-y: auto; -webkit-overflow-scrolling: touch;
z-index: 1;
}

.view { display: none; padding: 20px 16px 32px; }
.view.active { display: block; }

.section-label {
font-family: ‘Klee One’, cursive;
font-size: 12px; color: var(–muted);
margin-bottom: 4px; letter-spacing: 0.05em;
}

.section-hint { font-size: 12px; color: var(–muted); margin-bottom: 20px; line-height: 1.7; }

.cards-list { display: flex; flex-direction: column; gap: 14px; }

/* DREAM CARD */
.dream-card {
background: var(–card);
border: 1.5px solid var(–border);
border-radius: 18px;
padding: 18px 18px 16px;
position: relative;
box-shadow: 0 3px 14px rgba(196,96,42,0.08), 0 1px 3px rgba(196,96,42,0.05);
transition: transform 0.14s, box-shadow 0.14s;
}

.dream-card:active {
transform: scale(0.975);
box-shadow: 0 1px 6px rgba(196,96,42,0.1);
}

/* little sticker dot */
.card-sticker {
position: absolute; top: -8px; right: 14px;
font-size: 18px; line-height: 1;
}

.dream-text {
font-family: ‘Klee One’, cursive;
font-size: 17px; line-height: 1.9;
color: var(–text); margin-bottom: 14px;
}

.card-footer { display: flex; align-items: center; justify-content: space-between; }

.person-chip { display: flex; align-items: center; gap: 8px; }

.avatar {
border-radius: 50%; display: flex;
align-items: center; justify-content: center;
font-weight: 600; flex-shrink: 0;
font-family: ‘Klee One’, cursive;
}

.person-name {
font-family: ‘Klee One’, cursive;
font-size: 12px; color: var(–muted);
}

.support-counts { display: flex; gap: 6px; }

.count-badge {
font-size: 11px;
display: flex; align-items: center; gap: 3px;
background: var(–terra-light);
padding: 3px 9px; border-radius: 20px;
color: #c8a090; font-family: ‘Klee One’, cursive;
}

.count-badge.lit { color: var(–terra); background: #fce8d8; }

.help-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 11px; }

.help-tag {
font-family: ‘Klee One’, cursive;
font-size: 10px; padding: 3px 10px;
border: 1.5px solid var(–border);
border-radius: 20px; color: var(–muted);
background: var(–bg);
}

/* HELPER CARD */
.helper-card {
background: var(–card);
border: 1.5px solid var(–border);
border-radius: 18px; padding: 16px 18px;
display: flex; align-items: center; gap: 14px;
box-shadow: 0 3px 14px rgba(196,96,42,0.07);
}

.helper-info { flex: 1; min-width: 0; }

.skill-main {
font-family: ‘Klee One’, cursive;
font-size: 15px; color: var(–text); margin-bottom: 4px;
}

.skill-detail {
font-size: 11px; color: var(–muted); line-height: 1.6;
overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* FORMS */
.post-section { margin-bottom: 28px; }

.post-section-title {
font-family: ‘Klee One’, cursive;
font-size: 18px; color: var(–terra);
margin-bottom: 18px; padding-bottom: 10px;
border-bottom: 1.5px dashed var(–border); line-height: 1.6;
}

.form-group { margin-bottom: 14px; }

.form-label {
display: block;
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted);
margin-bottom: 7px; letter-spacing: 0.05em;
}

.form-input, .form-textarea {
width: 100%; background: #fff;
border: 1.5px solid var(–border); border-radius: 12px;
padding: 13px 15px; color: var(–text);
font-family: ‘Klee One’, cursive;
font-size: 15px; font-weight: 400;
outline: none; transition: border-color 0.2s;
-webkit-appearance: none;
}

.form-textarea { min-height: 90px; resize: none; line-height: 1.7; }
.form-input:focus, .form-textarea:focus { border-color: var(–terra); }

.submit-btn {
width: 100%;
font-family: ‘Klee One’, cursive;
font-size: 17px; padding: 15px;
background: var(–terra); color: #fff;
border: none; border-radius: 14px; cursor: pointer;
letter-spacing: 0.05em; transition: opacity 0.15s; margin-top: 4px;
box-shadow: 0 4px 14px rgba(196,96,42,0.35);
}

.submit-btn:active { opacity: 0.82; }

.or-divider {
display: flex; align-items: center; gap: 12px; margin: 22px 0;
}

.or-divider::before, .or-divider::after {
content: ‘’; flex: 1; height: 1.5px;
background: repeating-linear-gradient(90deg, var(–border) 0, var(–border) 4px, transparent 4px, transparent 8px);
}

.or-text {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted); white-space: nowrap;
}

/* MYSTERY BANNER */
.mystery-banner {
background: linear-gradient(135deg, #fff3e8, #ffe8d0);
border: 1.5px solid #f0c8a0;
border-radius: 18px; padding: 22px 18px;
text-align: center; margin-bottom: 22px;
position: relative; overflow: hidden;
}

.mystery-banner::before {
content: ‘🔥’;
position: absolute; top: -6px; right: 12px;
font-size: 28px; opacity: 0.3;
}

.mystery-title {
font-family: ‘Klee One’, cursive;
font-size: 16px; color: var(–terra);
margin-bottom: 7px; line-height: 1.7;
}

.mystery-sub {
font-size: 11px; color: var(–muted);
margin-bottom: 16px; line-height: 1.7;
font-family: ‘Klee One’, cursive;
}

.mystery-btn {
font-family: ‘Klee One’, cursive;
font-size: 15px; padding: 11px 26px;
background: var(–terra); color: #fff;
border: none; border-radius: 24px; cursor: pointer;
box-shadow: 0 3px 10px rgba(196,96,42,0.3);
transition: opacity 0.15s;
}

.mystery-btn:active { opacity: 0.82; }

/* MANUAL BANNER */
.manual-banner {
background: var(–sage-light);
border: 1.5px solid #b8d8b8;
border-radius: 16px; padding: 16px 18px;
margin-bottom: 18px; cursor: pointer;
display: flex; align-items: center; gap: 12px;
}

.manual-icon { font-size: 26px; flex-shrink: 0; }

.manual-text { flex: 1; }

.manual-title {
font-family: ‘Klee One’, cursive;
font-size: 14px; color: var(–sage); margin-bottom: 2px;
}

.manual-sub {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted);
}

.manual-arrow { font-size: 18px; color: var(–sage); }

/* BOTTOM NAV */
.bottom-nav {
position: fixed; bottom: 0; left: 0; right: 0;
height: var(–nav-h);
background: var(–surface);
border-top: 1.5px solid var(–border);
display: flex; z-index: 100;
}

.nav-item {
flex: 1; display: flex; flex-direction: column;
align-items: center; justify-content: center;
gap: 3px; cursor: pointer; color: #d4a888;
transition: color 0.15s; padding: 8px 4px;
}

.nav-item.active { color: var(–terra); }
.nav-icon { font-size: 22px; line-height: 1; }
.nav-label {
font-family: ‘Klee One’, cursive;
font-size: 9px; text-align: center; line-height: 1.3;
}

/* SHEET */
.sheet-overlay {
display: none; position: fixed; inset: 0;
background: rgba(60,30,10,0.3); z-index: 400;
backdrop-filter: blur(2px);
}

.sheet-overlay.open { display: block; }

.sheet {
position: fixed; bottom: 0; left: 0; right: 0;
background: var(–surface);
border-top: 1.5px solid var(–border);
border-radius: 24px 24px 0 0;
padding: 0 20px 52px;
z-index: 500; max-height: 88vh;
overflow-y: auto;
transform: translateY(100%);
transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
box-shadow: 0 -6px 28px rgba(196,96,42,0.12);
}

.sheet.open { transform: translateY(0); }

.sheet-handle {
width: 40px; height: 4px;
background: var(–border); border-radius: 2px;
margin: 14px auto 20px;
}

.sheet-label {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–terra);
margin-bottom: 10px; letter-spacing: 0.05em;
}

.sheet-dream {
font-family: ‘Klee One’, cursive;
font-size: 19px; line-height: 1.85; margin-bottom: 10px;
color: var(–text);
}

.sheet-person {
font-family: ‘Klee One’, cursive;
font-size: 12px; color: var(–muted); margin-bottom: 22px;
display: flex; align-items: center; gap: 8px;
}

.action-step-title {
font-family: ‘Klee One’, cursive;
font-size: 13px; color: var(–muted); margin-bottom: 12px;
}

.sheet-action-row { display: flex; gap: 8px; margin-bottom: 18px; }

.sheet-action-btn {
flex: 1; padding: 14px 6px;
border-radius: 14px; border: 1.5px solid var(–border);
background: var(–bg); cursor: pointer;
text-align: center; transition: all 0.14s;
}

.sheet-action-btn.selected {
border-color: var(–terra);
background: var(–terra-light);
}

.sheet-action-icon { font-size: 24px; margin-bottom: 5px; }

.sheet-action-label {
font-family: ‘Klee One’, cursive;
font-size: 10px; color: var(–muted); line-height: 1.4;
}

.sheet-action-btn.selected .sheet-action-label { color: var(–terra); }

/* REALNAME STEP */
.realname-step {
display: none;
background: var(–terra-light);
border: 1.5px solid #e8c0a0;
border-radius: 14px; padding: 16px;
margin-bottom: 16px;
animation: fadeUp 0.2s ease;
}

.realname-step.show { display: block; }

@keyframes fadeUp {
from { opacity: 0; transform: translateY(8px); }
to { opacity: 1; transform: translateY(0); }
}

.realname-step-title {
font-family: ‘Klee One’, cursive;
font-size: 15px; color: var(–text); margin-bottom: 5px;
}

.realname-step-sub {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted); line-height: 1.7; margin-bottom: 13px;
}

.realname-step-sub strong { color: var(–terra); font-weight: 600; }

.send-btn {
width: 100%;
font-family: ‘Klee One’, cursive;
font-size: 15px; padding: 13px;
background: var(–terra); color: #fff;
border: none; border-radius: 12px; cursor: pointer;
transition: opacity 0.15s;
box-shadow: 0 3px 10px rgba(196,96,42,0.28);
}

.send-btn:active { opacity: 0.82; }

.skip-link {
display: block; text-align: center;
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted);
margin-top: 10px; cursor: pointer; text-decoration: underline;
}

.sheet-notice {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted); line-height: 1.7;
padding: 12px 14px; background: var(–bg);
border-radius: 10px; border: 1.5px dashed var(–border);
margin-bottom: 22px; text-align: center;
}

.sheet-notice strong { color: var(–terra); }

.sheet-section-title {
font-family: ‘Klee One’, cursive;
font-size: 11px; color: var(–muted);
margin-bottom: 12px; padding-bottom: 8px;
border-bottom: 1.5px dashed var(–border);
}

.match-row {
display: flex; align-items: center; gap: 12px;
padding: 13px 0; border-bottom: 1px solid var(–border);
}

.match-row:last-child { border-bottom: none; }
.match-info { flex: 1; min-width: 0; }

.match-name {
font-family: ‘Klee One’, cursive;
font-size: 13px; margin-bottom: 3px;
}

.match-skill { font-size: 11px; color: var(–muted); }

/* MYSTERY MODAL */
.mystery-overlay {
display: none; position: fixed; inset: 0;
background: rgba(60,30,10,0.4); z-index: 600;
backdrop-filter: blur(3px); align-items: flex-end;
}

.mystery-overlay.open { display: flex; }

.mystery-modal {
width: 100%; background: var(–surface);
border-top: 1.5px solid var(–border);
border-radius: 24px 24px 0 0;
padding: 0 20px 52px; max-height: 90vh;
overflow-y: auto;
transform: translateY(100%);
transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
box-shadow: 0 -6px 28px rgba(196,96,42,0.12);
}

.mystery-overlay.open .mystery-modal { transform: translateY(0); }

/* MANUAL MODAL */
.manual-overlay {
display: none; position: fixed; inset: 0;
background: rgba(60,30,10,0.4); z-index: 600;
backdrop-filter: blur(3px); align-items: flex-end;
}

.manual-overlay.open { display: flex; }

.manual-modal {
width: 100%; background: var(–surface);
border-top: 1.5px solid var(–border);
border-radius: 24px 24px 0 0;
padding: 0 20px 52px; max-height: 90vh;
overflow-y: auto;
transform: translateY(100%);
transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
box-shadow: 0 -6px 28px rgba(196,96,42,0.12);
}

.manual-overlay.open .manual-modal { transform: translateY(0); }

.manual-step {
display: flex; gap: 14px; padding: 16px 0;
border-bottom: 1px dashed var(–border);
}

.manual-step:last-of-type { border-bottom: none; }

.manual-step-num {
width: 30px; height: 30px; border-radius: 50%;
background: var(–terra); color: #fff;
display: flex; align-items: center; justify-content: center;
font-family: ‘Klee One’, cursive; font-size: 14px; font-weight: 600;
flex-shrink: 0; margin-top: 1px;
box-shadow: 0 2px 6px rgba(196,96,42,0.3);
}

.manual-step-content { flex: 1; }

.manual-step-title {
font-family: ‘Klee One’, cursive;
font-size: 15px; color: var(–text); margin-bottom: 5px;
}

.manual-step-desc {
font-family: ‘Klee One’, cursive;
font-size: 12px; color: var(–muted); line-height: 1.7;
}

/* CONFETTI */
.confetti-container {
position: fixed; inset: 0;
pointer-events: none; z-index: 900; overflow: hidden;
}

.confetti-piece {
position: absolute;
animation: confettiFall linear forwards;
opacity: 0;
}

@keyframes confettiFall {
0% { transform: translateY(-20px) rotate(0deg) scale(1); opacity: 1; }
70% { opacity: 1; }
100% { transform: translateY(105vh) rotate(600deg) scale(0.5); opacity: 0; }
}

/* TOAST */
.toast {
position: fixed;
bottom: calc(var(–nav-h) + 16px); left: 50%;
transform: translateX(-50%) translateY(10px);
background: var(–terra); color: #fff;
padding: 11px 22px; border-radius: 24px;
font-family: ‘Klee One’, cursive;
font-size: 14px; opacity: 0;
transition: all 0.25s; z-index: 700;
pointer-events: none; white-space: nowrap;
box-shadow: 0 4px 14px rgba(196,96,42,0.35);
}

.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>

</head>
<body>

<div class="header">
  <div class="logo">Pot de <span class="logo-yomi">ぽっとで</span></div>
  <div class="tagline">あなたの「ちょっとね」を<br>ここに入れておいて。</div>
</div>

<div class="scroll-area">

  <!-- DREAMS -->

  <div class="view active" id="view-dreams">
    <div class="manual-banner" onclick="openManual()">
      <div class="manual-icon">🌿</div>
      <div class="manual-text">
        <div class="manual-title">Pot de ってなに？</div>
        <div class="manual-sub">使い方を見てみる →</div>
      </div>
    </div>
    <div class="section-label">みんなの「ちょっとね」</div>
    <div class="section-hint">カードをタップして、気持ちを伝えてみてください</div>
    <div class="cards-list" id="dreams-list"></div>
  </div>

  <!-- HELPERS -->

  <div class="view" id="view-helpers">
    <div class="section-label">お手伝いしたいこと</div>
    <div class="section-hint">得意なことや手伝えることがある人たち</div>
    <div class="cards-list" id="helpers-list"></div>
  </div>

  <!-- POST -->

  <div class="view" id="view-post">
    <div class="mystery-banner">
      <div class="mystery-title">何かわからないけど、<br>一緒に面白いことしたい</div>
      <div class="mystery-sub">具体的じゃなくていい。その気持ちだけ、送ってください。</div>
      <button class="mystery-btn" onclick="openMystery()">気持ちを送る 🔥</button>
    </div>

```
<div class="or-divider"><span class="or-text">または具体的に投稿する</span></div>

<div class="post-section">
  <div class="post-section-title">「ちょっとやってみたいこと」を<br>声に出してみる</div>
  <div class="form-group">
    <label class="form-label">ニックネーム</label>
    <input class="form-input" type="text" id="post-name" placeholder="たかし、T、なんでも">
  </div>
  <div class="form-group">
    <label class="form-label">ちょっとやってみたいこと</label>
    <textarea class="form-textarea" id="post-dream" placeholder="例：地元で小さなカレー屋を開いてみたい"></textarea>
  </div>
  <button class="submit-btn" onclick="submitDream()">声に出してみる 🌱</button>
</div>

<div class="or-divider"><span class="or-text">または</span></div>

<div class="post-section">
  <div class="post-section-title">「お手伝いしたいこと」を<br>登録する</div>
  <div class="form-group">
    <label class="form-label">ニックネーム</label>
    <input class="form-input" type="text" id="helper-name" placeholder="みほ、M、なんでも">
  </div>
  <div class="form-group">
    <label class="form-label">お手伝いしたいこと・得意なこと</label>
    <input class="form-input" type="text" id="helper-skill" placeholder="例：ロゴやフライヤーのデザイン">
  </div>
  <div class="form-group">
    <label class="form-label">もう少し詳しく（任意）</label>
    <textarea class="form-textarea" id="helper-detail" placeholder="例：週1〜2回なら手伝えます" style="min-height:70px;"></textarea>
  </div>
  <button class="submit-btn" onclick="submitHelper()">登録する 🤝</button>
</div>
```

  </div>

</div>

<!-- BOTTOM NAV -->

<div class="bottom-nav">
  <div class="nav-item active" id="nav-dreams" onclick="switchTab('dreams')">
    <div class="nav-icon">🌱</div>
    <div class="nav-label">みんなの<br>ちょっとね</div>
  </div>
  <div class="nav-item" id="nav-helpers" onclick="switchTab('helpers')">
    <div class="nav-icon">🤝</div>
    <div class="nav-label">お手伝い<br>したいこと</div>
  </div>
  <div class="nav-item" id="nav-post" onclick="switchTab('post')">
    <div class="nav-icon">＋</div>
    <div class="nav-label">声に出して<br>みる</div>
  </div>
</div>

<!-- DREAM SHEET -->

<div class="sheet-overlay" id="sheet-overlay" onclick="closeSheet()"></div>
<div class="sheet" id="sheet">
  <div class="sheet-handle"></div>
  <div class="sheet-label">ちょっとやってみたいこと 🌱</div>
  <div class="sheet-dream" id="sheet-dream"></div>
  <div class="sheet-person">
    <div class="avatar" id="sheet-avatar"></div>
    <span id="sheet-person-name"></span>
  </div>

  <div class="action-step-title">どんな気持ちですか？</div>
  <div class="sheet-action-row">
    <div class="sheet-action-btn" id="btn-cheer" onclick="selectAction('cheer')">
      <div class="sheet-action-icon">📣</div>
      <div class="sheet-action-label">応援したい</div>
    </div>
    <div class="sheet-action-btn" id="btn-help" onclick="selectAction('help')">
      <div class="sheet-action-icon">🙌</div>
      <div class="sheet-action-label">お手伝い<br>したい</div>
    </div>
    <div class="sheet-action-btn" id="btn-skill" onclick="selectAction('skill')">
      <div class="sheet-action-icon">🔧</div>
      <div class="sheet-action-label">具体的に<br>手伝える</div>
    </div>
  </div>

  <div class="realname-step" id="realname-step">
    <div class="realname-step-title">まつだにだけ、本名を教えてください</div>
    <div class="realname-step-sub">
      画面には表示されません。<br>
      <strong>まつだ</strong>があなたの素性を確認して、間に入ってつないでくれます。
    </div>
    <div class="form-group" style="margin-bottom:12px;">
      <input class="form-input" type="text" id="realname-input" placeholder="本名（フルネーム）">
    </div>
    <button class="send-btn" onclick="sendAction()">まつだに伝える 🌿</button>
    <span class="skip-link" onclick="sendAction(true)">本名なしで送る（匿名のまま）</span>
  </div>

  <div class="sheet-notice">
    直接の連絡先は共有されません。<br>
    <strong>まつだ</strong>が間に入ってつないでくれます 🍀
  </div>

  <div class="sheet-section-title">お手伝いしたい人（参考）</div>
  <div id="sheet-matches"></div>
</div>

<!-- MYSTERY MODAL -->

<div class="mystery-overlay" id="mystery-overlay" onclick="closeMysteryOnBg(event)">
  <div class="mystery-modal">
    <div class="sheet-handle"></div>
    <div style="font-family:'Klee One',cursive;font-size:20px;color:var(--terra);margin-bottom:8px;line-height:1.7;">
      何かわからないけど、<br>一緒に面白いことしたい 🔥
    </div>
    <div style="font-family:'Klee One',cursive;font-size:12px;color:var(--muted);margin-bottom:22px;line-height:1.8;">
      具体的じゃなくていい。<br>あなたのことを少し教えてください。
    </div>
    <div class="form-group">
      <label class="form-label">本名</label>
      <input class="form-input" type="text" id="mystery-name" placeholder="フルネームで">
    </div>
    <div class="form-group">
      <label class="form-label">一言（任意）</label>
      <textarea class="form-textarea" id="mystery-msg" placeholder="なんかおもしろそうだなと思って。とくに得意なことはないけど..." style="min-height:80px;"></textarea>
    </div>
    <div style="font-family:'Klee One',cursive;font-size:11px;color:var(--muted);margin-bottom:16px;line-height:1.7;padding:12px 14px;background:var(--terra-light);border-radius:12px;border:1.5px dashed #e0c0a0;text-align:center;">
      この内容は <strong style="color:var(--terra);">まつだ</strong> に直接届きます。<br>画面には表示されません。
    </div>
    <button class="submit-btn" onclick="submitMystery()">気持ちを送る 🔥</button>
  </div>
</div>

<!-- MANUAL MODAL -->

<div class="manual-overlay" id="manual-overlay" onclick="closeManualOnBg(event)">
  <div class="manual-modal">
    <div class="sheet-handle"></div>
    <div style="font-family:'Klee One',cursive;font-size:22px;color:var(--terra);margin-bottom:6px;">Pot de とは 🌿</div>
    <div style="font-family:'Klee One',cursive;font-size:12px;color:var(--muted);margin-bottom:22px;line-height:1.8;">
      「ちょっとね」って思ってること、ここに入れておいて。<br>誰かが手を差し伸べてくれるかもしれない。
    </div>

```
<div class="manual-step">
  <div class="manual-step-num">1</div>
  <div class="manual-step-content">
    <div class="manual-step-title">「ちょっとね」を声に出す 🌱</div>
    <div class="manual-step-desc">「＋声に出してみる」タブから、やってみたいことをニックネームで投稿できます。本名は不要、気軽に。</div>
  </div>
</div>

<div class="manual-step">
  <div class="manual-step-num">2</div>
  <div class="manual-step-content">
    <div class="manual-step-title">誰かの「ちょっとね」を見てみる 👀</div>
    <div class="manual-step-desc">「🌱みんなのちょっとね」タブで、地元のみんなが声に出したことが見られます。</div>
  </div>
</div>

<div class="manual-step">
  <div class="manual-step-num">3</div>
  <div class="manual-step-content">
    <div class="manual-step-title">応援・手伝いたい気持ちを伝える 📣</div>
    <div class="manual-step-desc">カードをタップして「応援したい」「お手伝いしたい」を選ぶと、まつだに通知が届きます。本名を伝えると素性がわかって、よりつながりやすくなります。</div>
  </div>
</div>

<div class="manual-step">
  <div class="manual-step-num">4</div>
  <div class="manual-step-content">
    <div class="manual-step-title">まつだが橋渡ししてくれる 🍀</div>
    <div class="manual-step-desc">直接のやり取りはまつだを通じて行われます。安心して気持ちを伝えてください。</div>
  </div>
</div>

<div class="manual-step">
  <div class="manual-step-num">5</div>
  <div class="manual-step-content">
    <div class="manual-step-title">何かわからないけど参加したい 🔥</div>
    <div class="manual-step-desc">「＋声に出してみる」タブの「何かわからないけど一緒に面白いことしたい」ボタンから、気持ちだけ送ることもできます。</div>
  </div>
</div>

<div style="margin-top:20px;padding:14px;background:var(--terra-light);border-radius:14px;text-align:center;border:1.5px dashed #e0c0a0;">
  <div style="font-family:'Klee One',cursive;font-size:13px;color:var(--terra);margin-bottom:4px;">困ったことがあれば</div>
  <div style="font-family:'Klee One',cursive;font-size:12px;color:var(--muted);">まつだに直接連絡してください 🌿</div>
</div>
```

  </div>
</div>

<!-- CONFETTI -->

<div class="confetti-container" id="confetti"></div>
<div class="toast" id="toast"></div>

<script>
const FORMSPREE = 'https://formspree.io/f/xdapnjbr';
const AV_COLORS = ['#c4602a','#c44b2b','#5b8fa8','#7d9e78','#9b6fa8','#c47a2b'];
const CONFETTI_COLORS = ['#c4602a','#e8b84b','#7d9e78','#a0c8e0','#f0c090','#c8e8a0','#f5a080'];
const STICKERS = ['🌱','🌿','🍀','✨','🌸','🎈','🍊','🌻'];

const dreams = [
  { id:1, name:'けんじ', dream:'近所に小さなカレー屋を開いてみたい', tags:['場所貸せる','料理できる','SNS手伝える'], cheers:3, helps:1 },
  { id:2, name:'さやか', dream:'地元の子どもたちに絵を教える教室をやりたい', tags:['デザイン','写真撮れる','子ども好き'], cheers:5, helps:2 },
  { id:3, name:'ゆうた', dream:'友達とバンドを組んでライブをやりたい', tags:['楽器できる','機材ある','動画編集'], cheers:2, helps:0 },
  { id:4, name:'まり', dream:'週末だけのお弁当屋さんをやってみたい', tags:['料理できる','配達できる','SNS手伝える'], cheers:4, helps:1 },
  { id:5, name:'たける', dream:'廃校になった小学校でマルシェをやりたい', tags:['大工できる','場所に詳しい','人集めできる'], cheers:6, helps:3 },
  { id:6, name:'のぞみ', dream:'自分で作ったアクセサリーを売りたい', tags:['デザイン','撮影できる','EC詳しい'], cheers:2, helps:1 },
];

const helpers = [
  { id:1, name:'みほ', skill:'ロゴ・フライヤーのデザイン', detail:'Illustratorなど使えます。週1〜2回なら。' },
  { id:2, name:'こうじ', skill:'大工・DIY全般', detail:'棚や什器なら作れます。材料費だけで。' },
  { id:3, name:'あかね', skill:'SNS運用・写真撮影', detail:'Instagramの投稿作り、撮影も。' },
  { id:4, name:'だいき', skill:'動画編集', detail:'YouTubeやReels向けの編集。' },
  { id:5, name:'ふみ', skill:'場所を貸せる（倉庫・駐車場）', detail:'週末なら使っていない倉庫と駐車場あります。' },
  { id:6, name:'まつだ', skill:'料理・仕込みの手伝い', detail:'飲食店で5年働いてたので仕込みとか手伝えます。' },
];

let userDreams = [...dreams];
let userHelpers = [...helpers];
let currentDreamId = null;
let selectedAction = null;

function getColor(n) {
  let h = 0; for (let c of n) h += c.charCodeAt(0);
  return AV_COLORS[h % AV_COLORS.length];
}
function initials(n) { return n.slice(0,1); }
function getSticker(n) {
  let h = 0; for (let c of n) h += c.charCodeAt(0);
  return STICKERS[h % STICKERS.length];
}

function avHtml(name, size=28, fs=12) {
  const col = getColor(name);
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${fs}px;background:${col}22;color:${col};border:1.5px solid ${col}55;">${initials(name)}</div>`;
}

function launchConfetti() {
  const container = document.getElementById('confetti');
  container.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size = Math.random() * 9 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 1.8 + 1.4;
    const delay = Math.random() * 0.6;
    const br = Math.random() > 0.4 ? '50%' : '3px';
    piece.style.cssText = `left:${left}%;width:${size}px;height:${size}px;background:${color};border-radius:${br};animation-duration:${duration}s;animation-delay:${delay}s;`;
    container.appendChild(piece);
  }
  setTimeout(() => container.innerHTML = '', 3500);
}

function renderDreams() {
  const list = document.getElementById('dreams-list');
  list.innerHTML = '';
  userDreams.forEach(d => {
    const el = document.createElement('div');
    el.className = 'dream-card';
    el.innerHTML = `
      <div class="card-sticker">${getSticker(d.name)}</div>
      <div class="dream-text">${d.dream}</div>
      <div class="card-footer">
        <div class="person-chip">${avHtml(d.name)}<span class="person-name">${d.name}</span></div>
        <div class="support-counts">
          <span class="count-badge ${d.cheers>0?'lit':''}">📣 ${d.cheers}</span>
          <span class="count-badge ${d.helps>0?'lit':''}">🙌 ${d.helps}</span>
        </div>
      </div>
      ${d.tags.length ? `<div class="help-tags">${d.tags.map(t=>`<span class="help-tag">${t}</span>`).join('')}</div>` : ''}
    `;
    el.onclick = () => openSheet(d.id);
    list.appendChild(el);
  });
}

function renderHelpers() {
  const list = document.getElementById('helpers-list');
  list.innerHTML = '';
  userHelpers.forEach(h => {
    const el = document.createElement('div');
    el.className = 'helper-card';
    el.innerHTML = `
      ${avHtml(h.name, 42, 16)}
      <div class="helper-info">
        <div class="skill-main">${h.skill}</div>
        <div class="skill-detail">${h.detail}</div>
      </div>
    `;
    list.appendChild(el);
  });
}

function openSheet(id) {
  currentDreamId = id;
  selectedAction = null;
  document.getElementById('realname-input').value = '';
  document.getElementById('realname-step').classList.remove('show');
  ['cheer','help','skill'].forEach(a => document.getElementById('btn-'+a).classList.remove('selected'));

  const d = userDreams.find(x => x.id === id);
  document.getElementById('sheet-dream').textContent = d.dream;
  document.getElementById('sheet-person-name').textContent = d.name;
  const col = getColor(d.name);
  const a = document.getElementById('sheet-avatar');
  a.textContent = initials(d.name);
  a.style.cssText = `width:26px;height:26px;font-size:12px;background:${col}22;color:${col};border:1.5px solid ${col}55;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-family:'Klee One',cursive;`;

  const picks = [...userHelpers].sort(() => Math.random()-0.5).slice(0,3);
  document.getElementById('sheet-matches').innerHTML = picks.map(h => `
    <div class="match-row">
      ${avHtml(h.name, 34, 13)}
      <div class="match-info">
        <div class="match-name">${h.name}</div>
        <div class="match-skill">${h.skill}</div>
      </div>
    </div>`).join('');

  document.getElementById('sheet-overlay').classList.add('open');
  requestAnimationFrame(() => document.getElementById('sheet').classList.add('open'));
}

function selectAction(type) {
  selectedAction = type;
  ['cheer','help','skill'].forEach(a =>
    document.getElementById('btn-'+a).classList.toggle('selected', a === type));
  const step = document.getElementById('realname-step');
  step.classList.add('show');
  setTimeout(() => step.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

async function sendAction(anonymous = false) {
  if (!selectedAction) return;
  const d = userDreams.find(x => x.id === currentDreamId);
  const realname = anonymous ? '（匿名）' : (document.getElementById('realname-input').value.trim() || '（未入力）');
  const labels = { cheer:'応援したい', help:'お手伝いしたい', skill:'具体的に手伝える' };
  if (selectedAction === 'cheer') d.cheers++; else d.helps++;
  try {
    await fetch(FORMSPREE, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({
        subject:`【Pot de】「${labels[selectedAction]}」という気持ちが届きました`,
        本名: realname, 対象:`${d.name}さん「${d.dream}」`,
        アクション: labels[selectedAction], メモ:'まつだが間に入ってつないであげてください。'
      })
    });
  } catch(e) { console.error(e); }
  renderDreams(); closeSheet();
  launchConfetti(); showToast('気持ち、届けました 🌿');
}

function closeSheet() {
  document.getElementById('sheet').classList.remove('open');
  document.getElementById('sheet-overlay').classList.remove('open');
}

function openMystery() { document.getElementById('mystery-overlay').classList.add('open'); }
function closeMysteryOnBg(e) { if(e.target.id==='mystery-overlay') document.getElementById('mystery-overlay').classList.remove('open'); }

async function submitMystery() {
  const name = document.getElementById('mystery-name').value.trim() || '（未入力）';
  const msg = document.getElementById('mystery-msg').value.trim();
  try {
    await fetch(FORMSPREE, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify({ subject:'【Pot de】一緒に面白いことしたい、という気持ちが届きました', 本名:name, メッセージ:msg||'（なし）', 種別:'何かわからないけど一緒に面白いことしたい' })
    });
  } catch(e) { console.error(e); }
  document.getElementById('mystery-name').value = '';
  document.getElementById('mystery-msg').value = '';
  document.getElementById('mystery-overlay').classList.remove('open');
  launchConfetti(); showToast('気持ち、届けました 🔥');
}

function openManual() { document.getElementById('manual-overlay').classList.add('open'); }
function closeManualOnBg(e) { if(e.target.id==='manual-overlay') document.getElementById('manual-overlay').classList.remove('open'); }

function switchTab(tab) {
  ['dreams','helpers','post'].forEach(t => {
    document.getElementById('view-'+t).classList.toggle('active', t===tab);
    document.getElementById('nav-'+t).classList.toggle('active', t===tab);
  });
  document.querySelector('.scroll-area').scrollTop = 0;
}

async function submitDream() {
  const name = document.getElementById('post-name').value.trim();
  const dream = document.getElementById('post-dream').value.trim();
  if (!name || !dream) { showToast('ニックネームと内容を入力してください'); return; }
  userDreams.unshift({ id:Date.now(), name, dream, tags:[], cheers:0, helps:0 });
  document.getElementById('post-name').value = '';
  document.getElementById('post-dream').value = '';
  renderDreams(); launchConfetti();
  showToast('声に出せた！ 🌱');
  setTimeout(() => switchTab('dreams'), 1000);
}

async function submitHelper() {
  const name = document.getElementById('helper-name').value.trim();
  const skill = document.getElementById('helper-skill').value.trim();
  const detail = document.getElementById('helper-detail').value.trim();
  if (!name || !skill) { showToast('ニックネームと内容を入力してください'); return; }
  userHelpers.unshift({ id:Date.now(), name, skill, detail });
  document.getElementById('helper-name').value = '';
  document.getElementById('helper-skill').value = '';
  document.getElementById('helper-detail').value = '';
  renderHelpers(); launchConfetti();
  showToast('登録できました 🤝');
  setTimeout(() => switchTab('helpers'), 1000);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

renderDreams();
renderHelpers();
</script>

</body>
</html>
