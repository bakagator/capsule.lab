# 松田スタジオ — SNS / note 自動更新システム

ニュースを取り込み、「松田さんらしい」投稿文を生成し、**確認・承認してから**各SNS / noteへ流す、承認フロー型の自動更新アプリです。

> `capsule.lab` リポジトリ内の独立プロジェクト（既存のカップルアプリとは別物）。

## 仕組み

```
① ニュース収集   →   ② 松田らしく生成   →   ③ 確認/承認   →   ④ 投稿
  RSS (feeds.ts)      Claude (generate.ts)   ダッシュボード     各SNS API
                      + 文体 (voice.ts)                       note は半自動
```

## フェーズ

- **フェーズ1（このコミット / 実装済み）**
  - RSS取り込み（`src/lib/feeds.ts`。NHK・ITmedia。編集で自由に追加）
  - 文体プロファイル（`src/lib/voice.ts`。過去投稿サンプルを増やすほど松田さんの声に寄る）
  - 生成パイプライン（`src/lib/generate.ts`。Claude `claude-opus-5` / adaptive thinking。**APIキー未設定でもモックで動作**）
  - 承認ダッシュボード（生成→編集→承認/却下）
- **フェーズ2（枠組みのみ / 認証情報が揃い次第）**
  - X / Threads / Instagram への投稿（`src/lib/publish.ts` の TODO）
  - note は公式API無しのため「本文コピー→手動投稿」の半自動
- **フェーズ3**
  - 定期実行（Vercel Cron / GitHub Actions）で収集〜生成を無人化。投稿だけ人が承認。

## セットアップ

```bash
cd matsuda-studio
npm install
cp .env.example .env   # 生成にClaude APIキーを使う場合は ANTHROPIC_API_KEY を設定
npm run dev            # http://localhost:3000
```

`ANTHROPIC_API_KEY`（または `ANTHROPIC_AUTH_TOKEN`）が無い場合は、生成部分がモック文に自動でフォールバックし、承認フロー全体を鍵なしで試せます。

## カスタマイズの勘どころ

| やりたいこと | 触るファイル |
|---|---|
| ニュースソースを変える | `src/lib/feeds.ts` の `FEEDS` |
| 松田さんの文体を強める | `src/lib/voice.ts` の `samples`（過去投稿を貼る） |
| 投稿先や文字数上限を変える | `src/lib/platforms.ts` |
| 実際の投稿処理を実装する | `src/lib/publish.ts` の TODO |

## 注意（保存について）

MVPでは下書きをファイル（`.data/drafts.json`）に保存します。Vercel等の
サーバーレスでは実行間で消えるため、本番運用時はDB（Postgres / KVなど）へ
`src/lib/store.ts` を差し替えてください（関数の形はそのまま使えます）。
