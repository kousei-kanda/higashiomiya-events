import type { Metadata } from "next";
import { getParticipationRecords } from "@/lib/data";

export const metadata: Metadata = {
  title: "参加実績 | 東大宮商工会 × 学生団体",
};

export default async function RecordsPage() {
  const records = await getParticipationRecords();

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16">
      <p
        className="text-gold text-xs tracking-[0.3em] mb-3"
        style={{ fontFamily: "var(--font-ticket)" }}
      >
        PAST PARTICIPATION
      </p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper mb-3">
        参加実績（仮）
      </h1>
      <p className="text-paper-dim mb-10 max-w-2xl">
        過去に東大宮商工会のイベントへ参加した学生団体の一覧です。応募を検討する際の参考にしてください。
      </p>

      <div className="rounded-2xl border border-line bg-night-2 divide-y divide-line">
        {records.map((r) => (
          <div key={r.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span
              className="text-gold text-sm shrink-0 sm:w-16"
              style={{ fontFamily: "var(--font-ticket)" }}
            >
              {r.event_year}
            </span>
            <div className="flex-1">
              <p className="font-bold text-paper">{r.group_name}</p>
              <p className="text-sm text-paper-dim">
                {r.event_name}｜{r.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
