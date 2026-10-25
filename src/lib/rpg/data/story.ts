import type { Speaker, StoryNode } from "../types";

export const SPEAKERS: Record<Speaker, { name: string; icon: string }> = {
  owl: { name: "フクロウ先生", icon: "🦉" },
  chiyo: { name: "千代", icon: "👵" },
  soroban: { name: "算盤さん", icon: "🧮" },
  gen: { name: "源さん", icon: "👴" },
  player: { name: "{name}", icon: "🙂" },
  narration: { name: "", icon: "" },
};

export const STORY: StoryNode[] = [
  // ── 序章 ──
  {
    type: "chapter",
    label: "序章",
    title: "のれんを継ぐ日",
    subtitle: "経営とは何か",
  },
  {
    type: "dialogue",
    lines: [
      { speaker: "narration", text: "紡町（つむぎまち）商店街。シャッターの目立つ通りに、創業60年の和菓子店「つむぎ堂」がある。" },
      { speaker: "narration", text: "店主の千代が腰を痛めて入院し、孫の{name}が店を継ぐことになった。" },
      { speaker: "chiyo", text: "{name}、悪いねえ。お店のこと、頼んだよ。" },
      { speaker: "chiyo", text: "おばあちゃんはね、「町の人の毎日に、ひと口の幸せを」って思って、ずっとやってきたんだよ。" },
      { speaker: "player", text: "（そうは言っても、経営なんてやったことないし……）" },
      { speaker: "narration", text: "店に戻り、古い帳簿を開いたそのとき——棚の上の置物が、ばさりと羽を広げた。" },
      { speaker: "owl", text: "ほっほう。ようやく来たか、新しい店主どの。わしはミネルヴァ。千代さんの相談役をしておったフクロウじゃ。" },
      { speaker: "owl", text: "経営とは、限られた「経営資源」を使って、お客様や地域に価値を届け続けることじゃ。" },
      { speaker: "owl", text: "経営資源は4つ。人材の「ヒト」、設備や商品の「モノ」、資金の「カネ」、そしてノウハウや評判の「情報」じゃ。" },
      { speaker: "owl", text: "そして何より大切なのが「何のために店をやるのか」——経営理念じゃよ。" },
    ],
  },
  {
    type: "learn",
    skills: ["mission-flag", "resource-scan"],
    codex: ["mission", "resources"],
    items: { yokan: 2 },
  },
  {
    type: "dialogue",
    lines: [
      { speaker: "owl", text: "経営の世界では、課題が魔物の姿で襲ってくる。覚えた理論こそが、お主の武器じゃ。" },
      { speaker: "owl", text: "コツは、まず「分析」で敵の正体を見抜くこと。弱点が分かれば、正しいスキルで大きな一撃を与えられる。" },
      { speaker: "owl", text: "そして忘れてはならん。お主のHPは「資金」じゃ。資金が尽きれば、店はおしまいじゃぞ。" },
      { speaker: "player", text: "……なんだか、胸のあたりがざわざわする。" },
    ],
  },
  { type: "battle", enemyId: "doubt-shadow" },
  {
    type: "dialogue",
    lines: [
      { speaker: "gen", text: "おう、{name}か。千代さんから話は聞いとる。わしは源。この店で40年、あんこを炊いとる。" },
      { speaker: "gen", text: "小豆は北の農家さんから、お客は商店街の人たちから。この店は、いろんな人に支えられとるんじゃ。" },
      { speaker: "owl", text: "良い機会じゃ。ひとつ問題を出そう。" },
    ],
  },
  {
    type: "quiz",
    quizId: "stakeholders",
    intro: "フクロウ先生の抜き打ちクイズ！",
    exp: 20,
  },
  { type: "learn", codex: ["stakeholders"] },

  // ── 第1章 ──
  {
    type: "chapter",
    label: "第1章",
    title: "赤字の霧",
    subtitle: "会計の基礎",
  },
  {
    type: "dialogue",
    lines: [
      { speaker: "narration", text: "店を継いで1か月。近くの老舗旅館「紡ノ湯」から、大福の卸売りの注文が入った。" },
      { speaker: "player", text: "売上が増えた！ これでひと安心だね。" },
      { speaker: "narration", text: "ところが月末。仕入れ代と源さんの給料を払おうとすると、口座の残高が足りない。" },
      { speaker: "soroban", text: "やあやあ。商店街で税理士をしている算盤です。千代さんに頼まれて、様子を見に来ましたよ。" },
      { speaker: "soroban", text: "ふむ……旅館さんの代金は2か月後払いの「売掛金」ですね。帳簿の上では売上でも、お金はまだ手元にない。" },
      { speaker: "soroban", text: "会社の数字を読むには、まず財務三表を知ることです。もうけを表す「PL」、財産と借金の状態を表す「BS」、お金の出入りを表す「CF」。" },
    ],
  },
  {
    type: "learn",
    skills: ["pl-reading", "cash-guard"],
    codex: ["financial-statements", "kuroji-tousan"],
  },
  {
    type: "quiz",
    quizId: "bs-definition",
    intro: "算盤さんの確認問題！",
    exp: 20,
  },
  { type: "battle", enemyId: "cash-goblin" },
  {
    type: "dialogue",
    lines: [
      { speaker: "soroban", text: "資金繰りはひとまず乗り切りましたね。ですが、本当の問題はここからです。" },
      { speaker: "soroban", text: "PLを見ると、つむぎ堂は毎月赤字。売れていないわけではないのに、なぜでしょう？" },
      { speaker: "soroban", text: "費用には、売れても売れなくてもかかる「固定費」と、売れるほど増える「変動費」があります。" },
      { speaker: "soroban", text: "価格から変動費を引いた「貢献利益」で固定費をまかなえる販売数——それが「損益分岐点」です。" },
      { speaker: "owl", text: "ほっほう、来るぞ。帳簿の向こうから、霧が立ちこめてきおった！" },
    ],
  },
  {
    type: "learn",
    skills: ["break-even"],
    codex: ["fixed-variable", "contribution-margin", "break-even"],
  },
  { type: "battle", enemyId: "red-fog" },
  { type: "case", caseId: "ch1-profit-plan" },
  {
    type: "dialogue",
    lines: [
      { speaker: "chiyo", text: "{name}、病院まで帳簿を持ってきてくれてありがとうね。……ちゃんと数字と向き合ってるんだね。" },
      { speaker: "chiyo", text: "おばあちゃんは勘でやってきたけど、{name}はきっと、もっと遠くまでお店を連れて行けるよ。" },
      { speaker: "owl", text: "数字が読めるようになったら、次は「誰に、何を届けるのか」じゃ。" },
      { speaker: "narration", text: "そのころ、商店街の入り口に、ひとりの女性が大きなスーツケースを引いて降り立っていた——。" },
    ],
  },
  { type: "end" },
];
