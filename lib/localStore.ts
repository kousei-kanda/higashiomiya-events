import "server-only";
import fs from "fs/promises";
import path from "path";
import type {
  EventRecord,
  EventInput,
  ApplicationRecord,
  ApplicationInput,
  ParticipationRecord,
  ParticipationRecordInput,
} from "./types";

// DATABASE_URL が未設定のローカル開発用フォールバック。
// data/events.json・data/records.json をメモリ上に読み込み、簡易的なCRUDを提供する。
// Next.js dev サーバーのモジュール再評価をまたいで状態を保つため globalThis に保持する
// （サーバープロセスを再起動すると、この変更内容はリセットされる）。

type Store = {
  events: EventRecord[];
  participationRecords: ParticipationRecord[];
  applications: ApplicationRecord[];
};

const globalForStore = globalThis as unknown as { __localStore?: Promise<Store> };

async function loadStore(): Promise<Store> {
  if (!globalForStore.__localStore) {
    globalForStore.__localStore = (async () => {
      const [eventsRaw, recordsRaw] = await Promise.all([
        fs.readFile(path.join(process.cwd(), "data", "events.json"), "utf-8"),
        fs.readFile(path.join(process.cwd(), "data", "records.json"), "utf-8"),
      ]);
      return {
        events: JSON.parse(eventsRaw) as EventRecord[],
        participationRecords: JSON.parse(recordsRaw) as ParticipationRecord[],
        applications: [] as ApplicationRecord[],
      };
    })();
  }
  return globalForStore.__localStore;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function getEvents(): Promise<EventRecord[]> {
  const store = await loadStore();
  return [...store.events].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const store = await loadStore();
  return store.events.find((e) => e.id === id) ?? null;
}

export async function createEvent(input: EventInput): Promise<EventRecord> {
  const store = await loadStore();
  const event: EventRecord = { id: generateId("evt"), ...input };
  store.events.push(event);
  return event;
}

export async function updateEvent(id: string, input: EventInput): Promise<EventRecord | null> {
  const store = await loadStore();
  const index = store.events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const updated: EventRecord = { id, ...input };
  store.events[index] = updated;
  return updated;
}

export async function deleteEvent(id: string): Promise<void> {
  const store = await loadStore();
  store.events = store.events.filter((e) => e.id !== id);
}

export async function getParticipationRecords(): Promise<ParticipationRecord[]> {
  const store = await loadStore();
  return [...store.participationRecords].sort((a, b) => b.event_year - a.event_year);
}

export async function getParticipationRecordById(
  id: string
): Promise<ParticipationRecord | null> {
  const store = await loadStore();
  return store.participationRecords.find((r) => r.id === id) ?? null;
}

export async function createParticipationRecord(
  input: ParticipationRecordInput
): Promise<ParticipationRecord> {
  const store = await loadStore();
  const record: ParticipationRecord = { id: generateId("rec"), ...input };
  store.participationRecords.push(record);
  return record;
}

export async function updateParticipationRecord(
  id: string,
  input: ParticipationRecordInput
): Promise<ParticipationRecord | null> {
  const store = await loadStore();
  const index = store.participationRecords.findIndex((r) => r.id === id);
  if (index === -1) return null;
  const updated: ParticipationRecord = { id, ...input };
  store.participationRecords[index] = updated;
  return updated;
}

export async function deleteParticipationRecord(id: string): Promise<void> {
  const store = await loadStore();
  store.participationRecords = store.participationRecords.filter((r) => r.id !== id);
}

export async function getApplications(): Promise<ApplicationRecord[]> {
  const store = await loadStore();
  return [...store.applications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createApplication(input: ApplicationInput): Promise<ApplicationRecord> {
  const store = await loadStore();
  const application: ApplicationRecord = {
    id: generateId("app"),
    ...input,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  store.applications.push(application);
  return application;
}
