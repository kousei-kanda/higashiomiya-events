import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Vercel の Neon 連携（Storage → Create Database → Neon）を追加すると、
// DATABASE_URL が自動でVercelの環境変数に設定されます。
// ローカル開発では .env.local に同じ値を設定してください。
//
// neon() の生成自体を関数呼び出し時まで遅延させることで、
// DATABASE_URL 未設定の状態でも `next build` のビルド時解析でエラーにならないようにしています。

let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "[db] DATABASE_URL が設定されていません。VercelでNeon連携を追加するか、" +
          ".env.local に DATABASE_URL を設定してください。"
      );
    }
    client = neon(connectionString);
  }
  return client;
}

// neon() が返すタグ付きテンプレート関数を、遅延初期化した上でそのまま使えるようにするラッパー
export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  return getClient()(strings, ...values);
}) as NeonQueryFunction<false, false>;

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        group_name TEXT NOT NULL,
        representative_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        content TEXT NOT NULL,
        group_intro TEXT NOT NULL,
        pr_comment TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  return schemaReady;
}
