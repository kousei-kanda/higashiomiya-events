"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ParticipationRecord } from "@/lib/types";

const FIELD_CLASS =
  "w-full rounded-lg border border-line bg-night px-4 py-2.5 text-paper placeholder:text-paper-dim/60 focus:border-lantern outline-none transition-colors";
const LABEL_CLASS = "block text-sm font-bold text-paper mb-1.5";

export default function RecordForm({ record }: { record?: ParticipationRecord }) {
  const router = useRouter();
  const isEdit = !!record;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      event_name: String(data.get("event_name") || ""),
      event_year: Number(data.get("event_year") || 0),
      group_name: String(data.get("group_name") || ""),
      content: String(data.get("content") || ""),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/records/${record!.id}` : "/api/admin/records",
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
      router.push("/admin/records");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラーが発生しました。");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-[1fr_auto] gap-5">
        <div>
          <label htmlFor="event_name" className={LABEL_CLASS}>
            イベント名 <span className="text-lantern">*</span>
          </label>
          <input
            id="event_name"
            name="event_name"
            required
            defaultValue={record?.event_name}
            placeholder="例：東大宮商工会 夏祭り 2025"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="event_year" className={LABEL_CLASS}>
            開催年 <span className="text-lantern">*</span>
          </label>
          <input
            id="event_year"
            name="event_year"
            type="number"
            required
            defaultValue={record?.event_year ?? new Date().getFullYear()}
            className={`${FIELD_CLASS} sm:w-28`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="group_name" className={LABEL_CLASS}>
          団体名 <span className="text-lantern">*</span>
        </label>
        <input
          id="group_name"
          name="group_name"
          required
          defaultValue={record?.group_name}
          placeholder="例：大道芸サークル PIERROT"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="content" className={LABEL_CLASS}>
          出演・展示内容 <span className="text-lantern">*</span>
        </label>
        <input
          id="content"
          name="content"
          required
          defaultValue={record?.content}
          placeholder="例：ジャグリング・バルーンアート披露"
          className={FIELD_CLASS}
        />
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
          {loading ? "保存中…" : isEdit ? "更新する" : "追加する"}
        </button>
      </div>
    </form>
  );
}
