import "server-only";
import fs from "fs/promises";
import path from "path";
import type {
  EventRecord,
  ApplicationRecord,
  ApplicationInput,
  ParticipationRecord,
  EventStatus,
} from "./types";

// ------------------------------------------------------------------
// これは「ローカルで動作確認するための仮のデータ層」です。
// events.json / applications.json / records.json を読み書きしています。
//
// 本番でSupabaseに繋ぐ際は、この関数のシグネチャ（引数・戻り値の型）は
// 変えずに、中身だけを Supabase クライアント呼び出しに置き換えれば
// ページ側のコードは一切変更不要になるように設計しています。
// 例: getEvents() → supabase.from("events").select("*")
// ------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_PATH = path.join(DATA_DIR, "events.json");
const APPLICATIONS_PATH = path.join(DATA_DIR, "applications.json");
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

export async function getApplications(): Promise<ApplicationRecord[]> {
  const applications = await readJson<ApplicationRecord[]>(APPLICATIONS_PATH);
  return applications.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createApplication(
  input: ApplicationInput
): Promise<ApplicationRecord> {
  const applications = await readJson<ApplicationRecord[]>(APPLICATIONS_PATH);

  const newApplication: ApplicationRecord = {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  applications.push(newApplication);

  try {
    await fs.writeFile(
      APPLICATIONS_PATH,
      JSON.stringify(applications, null, 2),
      "utf-8"
    );
  } catch {
    // 注意: Vercel等のサーバーレス環境ではデプロイ後のファイルシステムは
    // 読み取り専用のため、この書き込みは失敗します。
    // 本番運用時はSupabaseのapplicationsテーブルへのinsertに置き換えてください。
    console.warn(
      "[mock-db] applications.json への書き込みに失敗しました。" +
        "本番環境では Supabase 等の永続DBに置き換えてください。"
    );
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
