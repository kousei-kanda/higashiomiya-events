# 東大宮商工会 × 学生団体 イベント参加オファーシステム

要件定義書の「3.1 学生向け機能」（イベント一覧閲覧・イベント応募・参加実績閲覧）と、
「3.2 商工会向け機能」のうちイベント管理・応募確認を実装したプロトタイプです。

イベント・参加実績・応募データはすべて Postgres（Neon、Vercelの Storage から追加）に保存されており、
管理者ページからWeb上で編集できます。

## できること

**学生向け**
- `/` トップページ（サイトの紹介・直近イベントのハイライト）
- `/events` イベント一覧（開催日時・会場・募集内容・締切を「出店券」風カードで表示）
- `/events/[id]` イベント詳細＋応募フォーム（団体名・代表者名・メール・電話番号・出演内容・団体紹介・PRコメント）
- `/records` 過去の参加実績一覧

**商工会（管理者）向け**（`/admin/login` からパスワードでログイン）
- `/admin` 応募内容の一括確認
- `/admin/events` イベントの一覧・新規作成・編集・削除
- `/admin/records` 参加実績の一覧・新規作成・編集・削除

フッターの「商工会担当者の方はこちら」からも `/admin/login` にアクセスできます。

## データベース (Postgres / Neon) のセットアップ

Vercelプロジェクトに Neon の Postgres データベースを接続する必要があります。
（旧「Vercel Postgres」はNeonに統合されたため、現在はMarketplace経由でNeonを追加する形になっています）

1. Vercelのプロジェクトダッシュボード → **Storage** タブ → **Create Database**
2. **Neon** を選択し、リージョンとプラン（Freeでも可）を選んで作成
3. 作成後、**Connect Project** で対象のVercelプロジェクトを選び、Production / Preview / Development すべてにチェックして接続
   → `DATABASE_URL` などの環境変数が自動でVercel側に追加されます
4. 環境変数が追加されたら、Deployments → 最新デプロイの「Redeploy」で **再デプロイ** して反映させる
5. ローカルでも動作確認したい場合は、同じ接続文字列を `.env.local` の `DATABASE_URL` にコピー

`events` / `participation_records` / `applications` の各テーブルはアプリが初回アクセス時に自動作成します。
`events` と `participation_records` は、テーブルが空の場合に限り `data/events.json` / `data/records.json`
の内容で初期化されます（一度でも管理者画面から編集・追加すると、以後この初期データ投入は行われません）。

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
  page.tsx                        トップページ
  events/page.tsx                 イベント一覧
  events/[id]/page.tsx            イベント詳細＋応募フォーム
  records/page.tsx                参加実績
  api/applications/route.ts       応募受付API
  admin/login/page.tsx            管理者ログイン
  admin/page.tsx                  応募一覧（要ログイン）
  admin/events/page.tsx           イベント管理一覧
  admin/events/new/page.tsx       イベント新規作成
  admin/events/[id]/edit/page.tsx イベント編集
  admin/records/page.tsx          参加実績管理一覧
  admin/records/new/page.tsx      参加実績新規追加
  admin/records/[id]/edit/page.tsx 参加実績編集
  api/admin/login/route.ts        ログイン認証API
  api/admin/logout/route.ts       ログアウトAPI
  api/admin/events/route.ts       イベント作成API
  api/admin/events/[id]/route.ts  イベント更新・削除API
  api/admin/records/route.ts      参加実績作成API
  api/admin/records/[id]/route.ts 参加実績更新・削除API
components/
  EventTicketCard.tsx             イベント一覧カード
  ApplicationForm.tsx             応募フォーム（クライアント側）
  EventForm.tsx                   イベント作成・編集フォーム
  RecordForm.tsx                  参加実績の作成・編集フォーム
  StatusStamp.tsx                 「募集中／締切間近／受付終了」の判子風バッジ
  AdminNav.tsx                    管理者ページのタブナビゲーション
  LogoutButton.tsx                管理者ページのログアウトボタン
  DeleteButton.tsx                削除確認つきボタン（イベント・参加実績共通）
lib/
  types.ts                        型定義
  data.ts                         データアクセス層（events/records/applications すべてPostgres）
  db.ts                           Postgres(Neon)クライアント・テーブル定義・初期データ投入
  auth.ts                         管理者パスワード認証
  format.ts                       日付表示・datetime-local変換ユーティリティ（日本時間で統一）
data/
  events.json                     イベントの初期シードデータ
  records.json                    参加実績の初期シードデータ
```

## 今のバージョンの制約

- **メール送信はモック**：確認メール・商工会担当者への通知メールは、実際には送信されず
  サーバーのログに `[mock-mail]` として出力されるだけです。
- **管理者認証は簡易パスワード方式**：Cookieベースの簡易実装です。パスワードは環境変数
  `ADMIN_PASSWORD` で設定してください（弱いパスワードは避けてください）。
- 日時は常に日本時間（Asia/Tokyo）として入力・表示しています。

## 次に着手すると良いところ

- 応募の「採用／不採用／保留」をステータス変更できる操作を `/admin` に追加
- Resend等を使った実際のメール送信（確認メール・採否通知）
- Supabase Auth など、より堅牢な管理者認証への置き換え
