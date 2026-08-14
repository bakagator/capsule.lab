# べびりん セットアップ手順（夫婦専用 LINE AI秘書）

やること・新しいチャレンジが続くように、LINE で毎日そっとお尻を叩いてくれる秘書「べびりん」を、
自分たち専用の LINE 公式アカウントとして動かすための手順です。

> 「頭脳」はまず定型文ベース。将来 Claude API に差し替えたくなったら
> `src/lib/babyrin/commands.ts` の中身だけ置き換えれば、他は変えずに済む構成になっています。

---

## 全体像

```
夫婦の LINE トーク
      │  メッセージ
      ▼
LINE Messaging API ──▶ /api/line/webhook   … 受信して返信（やること追加・できた報告など）
                                   │
                                   ▼
                          ストア（Upstash Redis）
                                   ▲
      定期実行(cron) ──▶ /api/cron/nudge   … 未実施チャレンジ/放置タスクをpushで催促
                                   │
                                   ▼
                        夫婦の LINE に「お尻叩き」push
```

- **Webhook** … 二人の発言に返信し、状態を更新
- **cron** … 定期的に「今つつくべき相手」に push（＝お尻叩き）
- **ストア** … 夫婦2人・低頻度なので Upstash Redis に JSON 1本で保存

---

## 1. LINE 公式アカウント（Messaging API チャンネル）を作る

1. [LINE Developers](https://developers.line.biz/) に LINE アカウントでログイン
2. **プロバイダー**を作成（例：`まつだ家`）
3. そのプロバイダーで **Messaging API チャンネル**を新規作成
   - チャンネル名 … `べびりん`
   - チャンネルアイコン・説明はお好みで
4. 作成後、以下を控える
   - **チャンネルシークレット**（`Basic settings` タブ）→ `LINE_CHANNEL_SECRET`
   - **チャンネルアクセストークン（長期）**（`Messaging API` タブで発行）→ `LINE_CHANNEL_ACCESS_TOKEN`
5. `Messaging API` タブで
   - **応答メッセージ** … オフ（べびりんが返信するため）
   - **あいさつメッセージ** … オフ推奨（べびりんの welcome を使う）
   - **Webhook** … オン
6. 夫婦それぞれのスマホで、この公式アカウントを**友だち追加**（QRコード or ID）

> 夫婦専用にするため、**アカウントは非公開のまま**（検索に出さない）でOK。友だち追加は QR で十分です。

---

## 2. 環境変数を用意する

`.env.example` をコピーして `.env.local` を作り、値を入れます。

```bash
cp .env.example .env.local
```

| 変数 | 用途 | 必須 |
|---|---|---|
| `LINE_CHANNEL_SECRET` | Webhook 署名検証 | ✅ |
| `LINE_CHANNEL_ACCESS_TOKEN` | 返信・push 送信 | ✅ |
| `CRON_SECRET` | cron エンドポイント保護（任意の長い文字列） | 推奨 |
| `UPSTASH_REDIS_REST_URL` | 永続ストア | 本番で✅ |
| `UPSTASH_REDIS_REST_TOKEN` | 永続ストア | 本番で✅ |

### 永続ストア（Upstash Redis）

未設定でも動きますが、その場合**メモリ保存＝サーバー再起動で消えます**（デモ用）。
本番は無料枠で十分なので設定を推奨します。

1. [Upstash](https://upstash.com/) でアカウント作成 → **Redis** データベースを作成（リージョンは `ap-northeast-1` 東京が近い）
2. `REST API` の **UPSTASH_REDIS_REST_URL** と **UPSTASH_REDIS_REST_TOKEN** をコピーして環境変数へ

---

## 3. デプロイして Webhook URL を設定

LINE の Webhook は **HTTPS の公開URL**が必要です。

### 本番（Vercel 推奨）

1. このリポジトリを Vercel にインポート
2. 上記の環境変数をすべて Vercel の Project → Settings → Environment Variables に登録
3. デプロイ
4. LINE Developers の `Messaging API` → **Webhook URL** に
   ```
   https://<あなたのドメイン>/api/line/webhook
   ```
   を設定し、**「検証」ボタン**で `Success` を確認 → Webhook を**オン**

### ローカルで試す

```bash
npm install
npm run dev          # http://localhost:3000
```

LINE から届けるには公開URLが要るので、トンネルを使います（例）:

```bash
npx localtunnel --port 3000
# もしくは ngrok http 3000
```

出てきた `https://xxxx` を Webhook URL の末尾に `/api/line/webhook` を付けて設定します。

---

## 4. cron（お尻叩き）を回す

`/api/cron/nudge` を定期的に叩くと、その時つつくべき相手に push されます。

### 方法A：Vercel Cron（同梱の `vercel.json`）

`vercel.json` に JST 8:00 / 12:00 / 19:00 / 21:00 相当の4回を設定済みです。
Vercel が `Authorization: Bearer <CRON_SECRET>` を自動付与するので、`CRON_SECRET` を設定していれば認証も通ります。

> ⚠️ Vercel の **Hobby プランは cron が1日1回まで**。もっと細かく回したい場合は方法Bを。

### 方法B：外部cron（回数の制限なし）

[cron-job.org](https://cron-job.org/) などで、30分おきに次のURLを GET するだけ：

```
https://<あなたのドメイン>/api/cron/nudge?key=<CRON_SECRET>
```

quiet hours（既定 22時〜翌7時）とチャレンジの頻度判定はサーバー側で行うので、
少し多めに叩いても二人に夜中の通知は飛びません。

### 手動テスト

```
GET https://<ドメイン>/api/cron/nudge?key=<CRON_SECRET>&force=1
```

`force=1` で quiet hours を無視して即つつけます。

---

## 5. 使い方（LINE でそのまま送るだけ）

友だち追加したら、まず自己紹介：

- `わたしは妻` / `わたしは夫` … あなたの役割を登録

あとは自由に：

| したいこと | 送る例 |
|---|---|
| やること追加 | `やること 牛乳かう` / `やること 内見予約 8/20まで` |
| チャレンジ追加（毎日） | `チャレンジ 毎日ストレッチ` |
| チャレンジ追加（曜日） | `チャレンジ ジム 月水金` |
| チャレンジ追加（週N回） | `チャレンジ 読書 週3` |
| できた報告 | `できた ストレッチ` / `完了 牛乳` |
| 一覧 | `リスト` |
| いまの状況 | `状況` |
| 使い方 | `ヘルプ` |

Web からも状況を見られます： `https://<ドメイン>/babyrin`

---

## 続けるための工夫（設計メモ）

「新しいチャレンジが続かなくなる」を防ぐために、べびりんは次のように動きます。

- **最初の3日を重視**：登録直後から毎日そっと後押し（習慣化は序盤が命）
- **ストリーク（連続日数）を可視化**：`3・7・14・21・30…日` でお祝い🏆
- **途切れても責めない**：数日空いたら「また一緒にやろ」の**再開さそい**に切り替え（ゼロを1にするのを最優先）
- **叩きすぎない**：1つの項目につき1日1回、夜間は通知しない
- **夫婦で共有**：`共有` 指定で二人に届く。お互いの継続が見えることが一番の燃料

口調（定型文）は `src/lib/babyrin/persona.ts` に集約。ここを編集すればキャラの言い回しを丸ごと変えられます。
