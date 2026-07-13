import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { getParticipationRecords } from "@/lib/data";
import AdminNav from "@/components/AdminNav";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminRecordsPage() {
  await requireAdminPage();
  const records = await getParticipationRecords();

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <p
        className="text-gold text-xs tracking-[0.3em] mb-3"
        style={{ fontFamily: "var(--font-ticket)" }}
      >
        ADMIN DASHBOARD
      </p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper mb-8">
        管理者ページ
      </h1>

      <AdminNav />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-paper">参加実績管理</h2>
          <p className="text-paper-dim mt-1 text-sm">全{records.length}件の参加実績</p>
        </div>
        <Link
          href="/admin/records/new"
          className="rounded-full bg-lantern hover:bg-lantern-2 transition-colors px-5 py-2.5 text-sm font-bold text-night whitespace-nowrap"
        >
          ＋ 新規追加
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="rounded-2xl border border-line bg-night-2 p-10 text-center text-paper-dim">
          参加実績がまだありません。「新規追加」から登録してください。
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-night-2 divide-y divide-line">
          {records.map((r) => (
            <div
              key={r.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            >
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
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={`/admin/records/${r.id}/edit`}
                  className="text-sm text-gold hover:text-paper transition-colors"
                >
                  編集
                </Link>
                <DeleteButton
                  endpoint={`/api/admin/records/${r.id}`}
                  confirmMessage={`「${r.group_name}」の参加実績を削除します。よろしいですか？`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
