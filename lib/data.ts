import "server-only";
import type {
  EventRecord,
  EventInput,
  ApplicationRecord,
  ApplicationInput,
  ApplicationStatus,
  ParticipationRecord,
  ParticipationRecordInput,
  EventStatus,
} from "./types";
import { sql, ensureReady } from "./db";
import * as localStore from "./localStore";

// ------------------------------------------------------------------
// events / participation_records / applications はすべて Postgres (Neon) に
// 保存しています。events・participation_records はテーブルが空のときだけ
// data/events.json・data/records.json の内容で初期化されます（lib/db.ts）。
//
// DATABASE_URL が未設定のローカル開発では、代わりに lib/localStore.ts の
// メモリ上のストア（data/events.json・data/records.json を初期値として使用）に
// フォールバックします。
// ------------------------------------------------------------------

const DB_ENABLED = !!process.env.DATABASE_URL;

export function getEventStatus(event: EventRecord): EventStatus {
  const now = Date.now();
  const deadline = new Date(event.deadline).getTime();
  const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "closed";
  if (diffDays <= 7) return "closing_soon";
  return "open";
}

type EventRow = {
  id: string;
  name: string;
  event_date: string | Date;
  venue: string;
  recruit_content: string;
  description: string;
  deadline: string | Date;
  capacity: number | null;
  image_emoji: string;
};

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function rowToEvent(row: EventRow): EventRecord {
  return {
    id: row.id,
    name: row.name,
    event_date: toIso(row.event_date),
    venue: row.venue,
    recruit_content: row.recruit_content,
    description: row.description,
    deadline: toIso(row.deadline),
    capacity: row.capacity,
    image_emoji: row.image_emoji,
  };
}

export async function getEvents(): Promise<EventRecord[]> {
  if (!DB_ENABLED) return localStore.getEvents();
  await ensureReady();
  const rows = (await sql`
    SELECT * FROM events ORDER BY event_date ASC
  `) as EventRow[];
  return rows.map(rowToEvent);
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  if (!DB_ENABLED) return localStore.getEventById(id);
  await ensureReady();
  const rows = (await sql`
    SELECT * FROM events WHERE id = ${id} LIMIT 1
  `) as EventRow[];
  return rows[0] ? rowToEvent(rows[0]) : null;
}

export async function createEvent(input: EventInput): Promise<EventRecord> {
  if (!DB_ENABLED) return localStore.createEvent(input);
  await ensureReady();
  const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const rows = (await sql`
    INSERT INTO events (id, name, event_date, venue, recruit_content, description, deadline, capacity, image_emoji)
    VALUES (${id}, ${input.name}, ${input.event_date}, ${input.venue}, ${input.recruit_content}, ${input.description}, ${input.deadline}, ${input.capacity}, ${input.image_emoji})
    RETURNING *
  `) as EventRow[];
  return rowToEvent(rows[0]);
}

export async function updateEvent(
  id: string,
  input: EventInput
): Promise<EventRecord | null> {
  if (!DB_ENABLED) return localStore.updateEvent(id, input);
  await ensureReady();
  const rows = (await sql`
    UPDATE events SET
      name = ${input.name},
      event_date = ${input.event_date},
      venue = ${input.venue},
      recruit_content = ${input.recruit_content},
      description = ${input.description},
      deadline = ${input.deadline},
      capacity = ${input.capacity},
      image_emoji = ${input.image_emoji}
    WHERE id = ${id}
    RETURNING *
  `) as EventRow[];
  return rows[0] ? rowToEvent(rows[0]) : null;
}

export async function deleteEvent(id: string): Promise<void> {
  if (!DB_ENABLED) return localStore.deleteEvent(id);
  await ensureReady();
  await sql`DELETE FROM events WHERE id = ${id}`;
}

type ParticipationRow = {
  id: string;
  event_name: string;
  event_year: number;
  group_name: string;
  content: string;
};

function rowToParticipation(row: ParticipationRow): ParticipationRecord {
  return { ...row };
}

export async function getParticipationRecords(): Promise<ParticipationRecord[]> {
  if (!DB_ENABLED) return localStore.getParticipationRecords();
  await ensureReady();
  const rows = (await sql`
    SELECT * FROM participation_records ORDER BY event_year DESC
  `) as ParticipationRow[];
  return rows.map(rowToParticipation);
}

export async function getParticipationRecordById(
  id: string
): Promise<ParticipationRecord | null> {
  if (!DB_ENABLED) return localStore.getParticipationRecordById(id);
  await ensureReady();
  const rows = (await sql`
    SELECT * FROM participation_records WHERE id = ${id} LIMIT 1
  `) as ParticipationRow[];
  return rows[0] ? rowToParticipation(rows[0]) : null;
}

export async function createParticipationRecord(
  input: ParticipationRecordInput
): Promise<ParticipationRecord> {
  if (!DB_ENABLED) return localStore.createParticipationRecord(input);
  await ensureReady();
  const id = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const rows = (await sql`
    INSERT INTO participation_records (id, event_name, event_year, group_name, content)
    VALUES (${id}, ${input.event_name}, ${input.event_year}, ${input.group_name}, ${input.content})
    RETURNING *
  `) as ParticipationRow[];
  return rowToParticipation(rows[0]);
}

export async function updateParticipationRecord(
  id: string,
  input: ParticipationRecordInput
): Promise<ParticipationRecord | null> {
  if (!DB_ENABLED) return localStore.updateParticipationRecord(id, input);
  await ensureReady();
  const rows = (await sql`
    UPDATE participation_records SET
      event_name = ${input.event_name},
      event_year = ${input.event_year},
      group_name = ${input.group_name},
      content = ${input.content}
    WHERE id = ${id}
    RETURNING *
  `) as ParticipationRow[];
  return rows[0] ? rowToParticipation(rows[0]) : null;
}

export async function deleteParticipationRecord(id: string): Promise<void> {
  if (!DB_ENABLED) return localStore.deleteParticipationRecord(id);
  await ensureReady();
  await sql`DELETE FROM participation_records WHERE id = ${id}`;
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
    created_at: toIso(row.created_at),
  };
}

export async function getApplications(): Promise<ApplicationRecord[]> {
  if (!DB_ENABLED) return localStore.getApplications();
  await ensureReady();
  const rows = (await sql`
    SELECT * FROM applications ORDER BY created_at DESC
  `) as ApplicationRow[];
  return rows.map(rowToApplication);
}

export async function createApplication(
  input: ApplicationInput
): Promise<ApplicationRecord> {
  let newApplication: ApplicationRecord;

  if (!DB_ENABLED) {
    newApplication = await localStore.createApplication(input);
  } else {
    await ensureReady();

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

    newApplication = rowToApplication(rows[0]);
  }

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
