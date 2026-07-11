import "server-only";
import fs from "fs/promises";
import path from "path";
import type {
  EventRecord,
  ApplicationRecord,
  ApplicationInput,
  ApplicationStatus,
  ParticipationRecord,
  EventStatus,
} from "./types";
import { sql, ensureSchema } from "./db";

// ------------------------------------------------------------------
// イベント情報・参加実績はまだ data/*.json を読んでいるモック実装です
// （将来ここもSupabase等に差し替え可能）。
//
// 応募データ（applications）だけは Postgres (Neon) に保存しています。
// Vercel はデプロイ後のファイルシステムが読み取り専用のため、
// JSONファイルへの書き込みが本番で永続化されないことに対応しています。
// ------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_PATH = path.join(DATA_DIR, "events.json");
const RECORDS_PATH = path.join(DATA_DIR, "records.json");

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getEventStatus(event: EventRecord): EventStatus {
  const now = Date.now();
  const deadline = new Date(event.deadline).getTime();
  const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "closed";
  if (diffDays <= 7) return "closing_soon";
  return "open";
}

export async function getEvents(): Promise<EventRecord[]> {
  const events = await readJson<EventRecord[]>(EVENTS_PATH);
  return events.sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const events = await getEvents();
  return events.find((e) => e.id === id) ?? null;
}

export async function getParticipationRecords(): Promise<ParticipationRecord[]> {
  const records = await readJson<ParticipationRecord[]>(RECORDS_PATH);
  return records.sort((a, b) => b.event_year - a.event_year);
}

type ApplicationRow = {
  id: string;
  event_id: string;
  group_name: string;
  representative_name: string;
  email: string;
  phone: string;
  content: string;
  group_intro: string;
  pr_comment: string;
  status: ApplicationStatus;
  created_at: string | Date;
};

function rowToApplication(row: ApplicationRow): ApplicationRecord {
  return {
    ...row,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

export async function getApplications(): Promise<ApplicationRecord[]> {
  await ensureSchema();
  const rows = (await sql`
    SELECT * FROM applications ORDER BY created_at DESC
  `) as ApplicationRow[];
  return rows.map(rowToApplication);
}

export async function createApplication(
  input: ApplicationInput
): Promise<ApplicationRecord> {
  await ensureSchema();

  const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const rows = (await sql`
    INSERT INTO applications (
      id, event_id, group_name, representative_name, email, phone,
      content, group_intro, pr_comment, status
    ) VALUES (
      ${id}, ${input.event_id}, ${input.group_name}, ${input.representative_name},
      ${input.email}, ${input.phone}, ${input.content}, ${input.group_intro},
      ${input.pr_comment}, 'pending'
    )
    RETURNING *
  `) as ApplicationRow[];

  const newApplication = rowToApplication(rows[0]);

  // 学生への確認メール送信のモック（本番は Resend 等に置き換え）
  console.log(
    `[mock-mail] ${newApplication.email} 宛に応募確認メールを送信しました（応募ID: ${newApplication.id}）`
  );
  // 商工会担当者への通知メールのモック
  console.log(
    `[mock-mail] 商工会担当者へ新規応募通知を送信しました（団体名: ${newApplication.group_name}）`
  );

  return newApplication;
}
