import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById, getEventStatus } from "@/lib/data";
import { formatEventDate, formatDeadline } from "@/lib/format";
import StatusStamp from "@/components/StatusStamp";
import ApplicationForm from "@/components/ApplicationForm";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const status = getEventStatus(event);

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <Link href="/events" className="text-sm text-paper-dim hover:text-paper">
        ← イベント一覧に戻る
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-paper-dim mb-2">
            {formatEventDate(event.event_date)}
          </p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper">
            {event.name}
          </h1>
        </div>
        <span className="text-4xl shrink-0" aria-hidden>
          {event.image_emoji}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <StatusStamp status={status} />
        <span className="text-sm text-paper-dim">
          応募締切：{formatDeadline(event.deadline)}
        </span>
        {event.capacity && (
          <span className="text-sm text-paper-dim">募集数：{event.capacity}枠</span>
        )}
      </div>

      <dl className="mt-8 grid sm:grid-cols-2 gap-5 rounded-2xl border border-line bg-night-2 p-6">
        <div>
          <dt className="text-xs text-paper-dim mb-1">会場</dt>
          <dd className="text-paper">{event.venue}</dd>
        </div>
        <div>
          <dt className="text-xs text-paper-dim mb-1">募集内容</dt>
          <dd className="text-paper">{event.recruit_content}</dd>
        </div>
      </dl>

      <p className="mt-8 text-paper-dim leading-relaxed whitespace-pre-wrap">
        {event.description}
      </p>

      <div className="mt-14 border-t border-line pt-10">
        <h2 className="font-display font-bold text-2xl text-paper mb-2">
          このイベントに応募する
        </h2>
        {status === "closed" ? (
          <p className="text-paper-dim">このイベントの募集は終了しました。</p>
        ) : (
          <>
            <p className="text-paper-dim text-sm mb-6">
              下記フォームからご応募ください。応募内容は商工会担当者が確認し、採否を追ってメールでご連絡します。
            </p>
            <ApplicationForm eventId={event.id} />
          </>
        )}
      </div>
    </div>
  );
}
