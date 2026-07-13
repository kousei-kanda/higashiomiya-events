"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EventRecord } from "@/lib/types";
import { jstLocalInputToIso, isoToJstLocalInput } from "@/lib/format";

const FIELD_CLASS =
  "w-full rounded-lg border border-line bg-night px-4 py-2.5 text-paper placeholder:text-paper-dim/60 focus:border-lantern outline-none transition-colors";
const LABEL_CLASS = "block text-sm font-bold text-paper mb-1.5";

export default function EventForm({ event }: { event?: EventRecord }) {
  const router = useRouter();
  const isEdit = !!event;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const capacityRaw = String(data.get("capacity") || "").trim();

    const payload = {
      name: String(data.get("name") || ""),
      event_date: jstLocalInputToIso(String(data.get("event_date") || "")),
      venue: String(data.get("venue") || ""),
      recruit_content: String(data.get("recruit_content") || ""),
      description: String(data.get("description") || ""),
      deadline: jstLocalInputToIso(String(data.get("deadline") || "")),
      capacity: capacityRaw === "" ? null : Number(capacityRaw),
      image_emoji: String(data.get("image_emoji") || "🏮"),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/events/${event!.id}` : "/api/admin/events",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "保存に失敗しました。");
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラーが発生しました。");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className={LABEL_CLASS}>
          イベント名 <span className="text-lantern">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={event?.name}
          placeholder="例：東大宮商工会 夏祭り 2026"
          className={FIELD_CLASS}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="event_date" className={LABEL_CLASS}>
            開催日時 <span className="text-lantern">*</span>
          </label>
          <input
            id="event_date"
            name="event_date"
            type="datetime-local"
            required
            defaultValue={event ? isoToJstLocalInput(event.event_date) : undefined}
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="deadline" className={LABEL_CLASS}>
            募集締切 <span className="text-lantern">*</span>
          </label>
          <input
            id="deadline"
            name="deadline"
            type="datetime-local"
            required
            defaultValue={event ? isoToJstLocalInput(event.deadline) : undefined}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="venue" className={LABEL_CLASS}>
          会場 <span className="text-lantern">*</span>
        </label>
        <input
          id="venue"
          name="venue"
          required
          defaultValue={event?.venue}
          placeholder="例：東大宮駅前通り 特設会場"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="recruit_content" className={LABEL_CLASS}>
          募集内容 <span className="text-lantern">*</span>
        </label>
        <input
          id="recruit_content"
          name="recruit_content"
          required
          defaultValue={event?.recruit_content}
          placeholder="例：出店（食品・雑貨）／ステージパフォーマンス"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="description" className={LABEL_CLASS}>
          詳細説明 <span className="text-lantern">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={event?.description}
          placeholder="イベントの内容や見どころ、応募者へのメッセージなど"
          className={FIELD_CLASS}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="capacity" className={LABEL_CLASS}>
            募集人数（枠）
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={0}
            defaultValue={event?.capacity ?? undefined}
            placeholder="例：15"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="image_emoji" className={LABEL_CLASS}>
            アイコン（絵文字）
          </label>
          <input
            id="image_emoji"
            name="image_emoji"
            defaultValue={event?.image_emoji ?? "🏮"}
            maxLength={4}
            placeholder="🏮"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-lantern-2" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-lantern hover:bg-lantern-2 disabled:opacity-50 transition-colors px-8 py-3 font-bold text-night"
        >
          {loading ? "保存中…" : isEdit ? "更新する" : "作成する"}
        </button>
      </div>
    </form>
  );
}
