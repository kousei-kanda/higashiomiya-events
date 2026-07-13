import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { getEvents, getEventStatus } from "@/lib/data";
import { formatEventDate, formatDeadline } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import DeleteButton from "@/components/DeleteButton";
import StatusStamp from "@/components/StatusStamp";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminPage();
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
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
          <h2 className="font-display font-bold text-xl text-paper">イベント管理</h2>
          <p className="text-paper-dim mt-1 text-sm">全{events.length}件のイベント</p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-full bg-lantern hover:bg-lantern-2 transition-colors px-5 py-2.5 text-sm font-bold text-night whitespace-nowrap"
        >
          ＋ 新規イベント作成
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-line bg-night-2 p-10 text-center text-paper-dim">
          イベントがまだありません。「新規イベント作成」から追加してください。
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-line bg-night-2 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-paper-dim mb-1">
                    {formatEventDate(event.event_date)}｜{event.venue}
                  </p>
                  <h3 className="font-display font-bold text-lg text-paper">
                    {event.image_emoji} {event.name}
                  </h3>
                  <p className="text-sm text-paper-dim mt-1">
                    募集内容：{event.recruit_content}
                  </p>
                </div>
                <StatusStamp status={getEventStatus(event)} />
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-line">
                <span className="text-xs text-paper-dim">
                  締切：{formatDeadline(event.deadline)}
                </span>
                <Link
                  href={`/events/${event.id}`}
                  target="_blank"
                  className="text-sm text-paper-dim hover:text-paper transition-colors"
                >
                  公開ページを見る ↗
                </Link>
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="text-sm text-gold hover:text-paper transition-colors"
                >
                  編集
                </Link>
                <DeleteButton
                  endpoint={`/api/admin/events/${event.id}`}
                  confirmMessage={`「${event.name}」を削除します。よろしいですか？`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
