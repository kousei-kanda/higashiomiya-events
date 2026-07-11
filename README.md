# 東大宮商工会 × 学生団体 イベント参加オファーシステム（プロトタイプ）

要件定義書の「3.1 学生向け機能」（イベント一覧閲覧・イベント応募・参加実績閲覧）と、
応募内容を確認するための簡易な管理者ページを実装したプロトタイプです。

- イベント情報・参加実績：`data/*.json` を読むモック実装（まだ差し替え前）
- 応募データ：Postgres（Neon、Vercelの Storage から追加）に保存。Vercel上でも管理者ページから確認できます

## できること

- `/` トップページ（サイトの紹介・直近イベントのハイライト）
- `/events` イベント一覧（開催日時・会場・募集内容・締切を「出店券」風カードで表示）
- `/events/[id]` イベント詳細＋応募フォーム（団体名・代表者名・メール・電話番号・出演内容・団体紹介・PRコメント）
- `/records` 過去の参加実績一覧
- `POST /api/applications` 応募データの受付（バリデーション＋DB保存＋確認メール送信のモック）
- `/admin/login` 管理者ログイン（パスワード認証）
- `/admin` 応募内容の一括確認（フッターの「商工会担当者の方はこちら」からもアクセス可）

## データベース (Postgres / Neon) のセットアップ

応募データを保存・表示するには、Vercelプロジェクトに Neon の Postgres データベースを接続する必要があります。
（旧「Vercel Postgres」はNeonに統合されたため、現在はMarketplace経由でNeonを追加する形になっています）

1. Vercelのプロジェクトダッシュボード → **Storage** タブ → **Create Database**
2. **Neon** を選択し、リージョンとプラン（Freeでも可）を選んで作成
3. 作成後、**Connect Project** で対象のVercelプロジェクトを選び、Production / Preview / Development すべてにチェックして接続
   → `DATABASE_URL` などの環境変数が自動でVercel側に追加されます
4. 環境変数が追加されたら、Deployments → 最新デプロイの「Redeploy」で **再デプロイ** して反映させる
5. ローカルでも動作確認したい場合は、同じ接続文字列を `.env.local` の `DATABASE_URL` にコピー

`applications` テーブルはアプリが初回アクセス時に自動作成するので、手動でSQLを実行する必要はありません。

## セットアップ（ローカル）

Node.js 20 以上を推奨します。

```bash
cd higashiomiya-events
npm install
cp .env.example .env.local   # ADMIN_PASSWORD・DATABASE_URLを設定
npm run dev
```

`http://localhost:3000` で確認できます。

> 管理者ページの認証はプロトタイプ用の簡易パスワード認証です。本番運用前に Supabase Auth 等の
> 正式な認証基盤に置き換えることを推奨します。

## ディレクトリ構成（要点）

```
app/
  page.tsx                     トップページ
  events/page.tsx              イベント一覧
  events/[id]/page.tsx         イベント詳細＋応募フォーム
  records/page.tsx             参加実績
  api/applications/route.ts    応募受付API
  admin/login/page.tsx         管理者ログイン
  admin/page.tsx               応募一覧（要ログイン）
  api/admin/login/route.ts     ログイン認証API
  api/admin/logout/route.ts    ログアウトAPI
components/
  EventTicketCard.tsx          イベント一覧カード
  ApplicationForm.tsx          応募フォーム（クライアント側）
  StatusStamp.tsx              「募集中／締切間近／受付終了」の判子風バッジ
  LogoutButton.tsx             管理者ページのログアウトボタン
lib/
  types.ts                     型定義
  data.ts                      データアクセス層（events/recordsはJSON、applicationsはPostgres）
  db.ts                        Postgres(Neon)クライアントとテーブル定義
  auth.ts                      管理者パスワード認証
  format.ts                    日付表示のユーティリティ
data/
  events.json                  イベントのサンプルデータ
  records.json                 参加実績のサンプルデータ
```

## 今のバージョンの制約

- **イベント情報・参加実績はまだ `data/*.json`（モック）**：`events.json` / `records.json` を直接編集して更新します。
- **メール送信はモック**：確認メール・商工会担当者への通知メールは、実際には送信されず
  サーバーのログに `[mock-mail]` として出力されるだけです。
- **管理者認証は簡易パスワード方式**：Cookieベースの簡易実装です。

## 次に着手すると良いところ

- 応募の「採用／不採用／保留」をステータス変更できる操作を `/admin` に追加
- 商工会向けのイベント登録・編集画面（要件定義書 3.2）
- イベント情報・参加実績も Postgres（または Supabase）に移行し、`data/*.json` を廃止
