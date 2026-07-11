# 東大宮商工会 × 学生団体 イベント参加オファーシステム（プロトタイプ）

要件定義書の「3.1 学生向け機能」（イベント一覧閲覧・イベント応募・参加実績閲覧）を、
ローカルで動作確認できる形で実装したプロトタイプです。

データは Supabase ではなく `data/*.json` を読み書きするモック実装になっています。
関数のシグネチャは Supabase 版と揃えてあるので、`lib/data.ts` の中身だけ差し替えれば
ページ側のコードはほぼ無修正で本番DBに移行できます。

## できること

- `/` トップページ（サイトの紹介・直近イベントのハイライト）
- `/events` イベント一覧（開催日時・会場・募集内容・締切を「出店券」風カードで表示）
- `/events/[id]` イベント詳細＋応募フォーム（団体名・代表者名・メール・電話番号・出演内容・団体紹介・PRコメント）
- `/records` 過去の参加実績一覧
- `POST /api/applications` 応募データの受付（バリデーション＋確認メール送信のモック）
- `/admin/login` 管理者ログイン（パスワード認証）
- `/admin` 応募内容の一括確認（フッターの「商工会担当者の方はこちら」からもアクセス可）

## セットアップ

Node.js 20 以上を推奨します。

```bash
cd higashiomiya-events
npm install
npm run dev
```

`http://localhost:3000` で確認できます。

管理者ページ（`/admin`）のパスワードは環境変数 `ADMIN_PASSWORD` で設定します。
`.env.example` を `.env.local` にコピーして値を変更してください（未設定時の初期値は `toukyu2026`）。

```bash
cp .env.example .env.local
```

> 現在の認証はプロトタイプ用の簡易パスワード認証です。本番運用前に Supabase Auth 等の
> 正式な認証基盤に置き換えることを推奨します。

## ディレクトリ構成（要点）

```
app/
  page.tsx                    トップページ
  events/page.tsx             イベント一覧
  events/[id]/page.tsx        イベント詳細＋応募フォーム
  records/page.tsx            参加実績
  api/applications/route.ts   応募受付API
components/
  EventTicketCard.tsx         イベント一覧カード
  ApplicationForm.tsx         応募フォーム（クライアント側）
  StatusStamp.tsx             「募集中／締切間近／受付終了」の判子風バッジ
lib/
  types.ts                    型定義（将来のSupabaseテーブル定義と対応）
  data.ts                     データアクセス層（★ここをSupabaseに差し替える）
  format.ts                   日付表示のユーティリティ
data/
  events.json                 イベントのサンプルデータ
  records.json                参加実績のサンプルデータ
  applications.json           応募データの保存先（ローカルのみ）
```

## 今のバージョンの制約

- **応募データの永続化はローカルファイルのみ**：`data/applications.json` に書き込みますが、
  Vercel 等のサーバーレス環境ではデプロイ後のファイルシステムが読み取り専用のため書き込みは失敗します
  （コンソールに警告が出ますが、応募自体はエラーになりません）。本番運用前に Supabase に置き換えてください。
- **メール送信はモック**：確認メール・商工会担当者への通知メールは、実際には送信されず
  サーバーのログに `[mock-mail]` として出力されるだけです。

## 本番（Supabase + Vercel）へ移行する際の流れ

1. Supabase プロジェクトを作成し、`events` / `applications` テーブルを `lib/types.ts` の型に合わせて作成
   （応募の採否管理をするなら `applications.status` に `pending / accepted / rejected` を持たせる想定）
2. `lib/data.ts` の各関数の中身を Supabase クライアント呼び出しに置き換え
   （`getEvents()` → `supabase.from("events").select("*")` など。関数名・戻り値の型は変えない）
3. メール送信を Resend 等に接続し、`createApplication()` 内の `console.log` 部分を実際の送信処理に置き換え
4. 商工会向けの管理画面（イベント登録・応募一覧・採否管理）を追加実装
5. Vercel にデプロイし、環境変数（Supabase URL・キー、Resend APIキー）を設定

## 次に着手すると良いところ

要件定義書の 3.2（商工会向け機能）はまだ未着手です。
「応募管理（採用／不採用／保留）」と「イベント登録・編集」の管理画面から着手するのがおすすめです。
