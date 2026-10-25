import type { CodexEntry } from "../types";

export const CODEX: Record<string, CodexEntry> = {
  mission: {
    id: "mission",
    term: "経営理念（ミッション・ビジョン・バリュー）",
    category: "経営総論",
    body: "企業が「何のために存在するのか（ミッション）」「どこを目指すのか（ビジョン）」「何を大切にするのか（バリュー）」を言葉にしたもの。日々の意思決定の拠り所になる。",
  },
  resources: {
    id: "resources",
    term: "経営資源",
    category: "経営総論",
    body: "事業を行うために使える資源。一般に「ヒト（人材）」「モノ（設備・商品）」「カネ（資金）」「情報（ノウハウ・データ・ブランド）」の4つに分けられる。",
  },
  stakeholders: {
    id: "stakeholders",
    term: "ステークホルダー",
    category: "経営総論",
    body: "企業の活動に影響を与えたり、影響を受けたりする利害関係者。顧客・従業員・取引先・地域社会・株主・金融機関など。",
  },
  "financial-statements": {
    id: "financial-statements",
    term: "財務三表（PL・BS・CF）",
    category: "会計",
    body: "損益計算書（PL）は一定期間の「売上−費用＝利益」、貸借対照表（BS）はある時点の「資産＝負債＋純資産」、キャッシュフロー計算書（CF）は一定期間の「現金の出入り」を表す。",
  },
  "kuroji-tousan": {
    id: "kuroji-tousan",
    term: "黒字倒産",
    category: "会計",
    body: "帳簿上は利益が出ているのに、支払いに必要な現金が足りずに倒産すること。売掛金の回収が遅い、在庫を抱えすぎる、などが原因になる。",
  },
  "fixed-variable": {
    id: "fixed-variable",
    term: "固定費と変動費",
    category: "会計",
    body: "固定費は販売数にかかわらず一定額かかる費用（家賃・人件費など）。変動費は販売数に比例して増える費用（原材料・包装・廃棄ロスなど）。",
  },
  "contribution-margin": {
    id: "contribution-margin",
    term: "貢献利益（限界利益）",
    category: "会計",
    body: "価格 − 変動費。商品を1個売るごとに、固定費の回収と利益に回せる金額。これがマイナスなら売るほど赤字になる。",
  },
  "break-even": {
    id: "break-even",
    term: "損益分岐点",
    category: "会計",
    body: "利益がちょうどゼロになる販売数（または売上高）。損益分岐点販売数 ＝ 固定費 ÷（価格 − 変動費）。利益を出すには「販売数を増やす」「価格を上げる」「変動費を下げる」「固定費を下げる」のいずれかが必要。",
  },
};
