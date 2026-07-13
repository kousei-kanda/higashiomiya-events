import "server-only";
import fs from "fs/promises";
import path from "path";
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

// ------------------------------------------------------------------
// テーブル作成 ＆ 初期データ投入（初回アクセス時のみ）
//
// events / participation_records は、テーブルが空の場合に限り
// data/events.json・data/records.json の内容を初期データとして流し込みます。
// 一度でも管理者画面から編集・追加されるとテーブルに行が入るため、
// 以降このシード処理は実行されません（の判定は「件数が0件かどうか」で行う）。
// ------------------------------------------------------------------

type CountRow = { count: number };

async function seedEventsIfEmpty(): Promise<void> {
  const rows = (await sql`SELECT COUNT(*)::int as count FROM events`) as CountRow[];
  if (rows[0].count > 0) return;

  const raw = await fs.readFile(path.join(process.cwd(), "data", "events.json"), "utf-8");
  const seed = JSON.parse(raw) as Array<{
    id: string;
    name: string;
    event_date: string;
    venue: string;
    recruit_content: string;
    description: string;
    deadline: string;
    capacity: number | null;
    image_emoji: string;
  }>;

  for (const e of seed) {
    await sql`
      INSERT INTO events (id, name, event_date, venue, recruit_content, description, deadline, capacity, image_emoji)
      VALUES (${e.id}, ${e.name}, ${e.event_date}, ${e.venue}, ${e.recruit_content}, ${e.description}, ${e.deadline}, ${e.capacity}, ${e.image_emoji})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

async function seedRecordsIfEmpty(): Promise<void> {
  const rows = (await sql`SELECT COUNT(*)::int as count FROM participation_records`) as CountRow[];
  if (rows[0].count > 0) return;

  const raw = await fs.readFile(path.join(process.cwd(), "data", "records.json"), "utf-8");
  const seed = JSON.parse(raw) as Array<{
    id: string;
    event_name: string;
    event_year: number;
    group_name: string;
    content: string;
  }>;

  for (const r of seed) {
    await sql`
      INSERT INTO participation_records (id, event_name, event_year, group_name, content)
      VALUES (${r.id}, ${r.event_name}, ${r.event_year}, ${r.group_name}, ${r.content})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

let readyPromise: Promise<void> | null = null;

export function ensureReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      await sql`
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
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          event_date TIMESTAMPTZ NOT NULL,
          venue TEXT NOT NULL,
          recruit_content TEXT NOT NULL,
          description TEXT NOT NULL,
          deadline TIMESTAMPTZ NOT NULL,
          capacity INTEGER,
          image_emoji TEXT NOT NULL DEFAULT '🏮'
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS participation_records (
          id TEXT PRIMARY KEY,
          event_name TEXT NOT NULL,
          event_year INTEGER NOT NULL,
          group_name TEXT NOT NULL,
          content TEXT NOT NULL
        )
      `;
      await seedEventsIfEmpty();
      await seedRecordsIfEmpty();
    })();
  }
  return readyPromise;
}

// 旧名（applications関連のコードから参照されていた）を残しておく互換エイリアス
export const ensureSchema = ensureReady;
