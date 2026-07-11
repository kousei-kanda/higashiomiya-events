import Link from "next/link";
import type { EventRecord } from "@/lib/types";
import { getEventStatus } from "@/lib/data";
import { formatEventDate, formatDeadline, daysUntil } from "@/lib/format";
import StatusStamp from "./StatusStamp";

export default function EventTicketCard({ event }: { event: EventRecord }) {
  const status = getEventStatus(event);
  const days = daysUntil(event.deadline);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex overflow-hidden rounded-2xl border border-line bg-night-2 hover:bg-night-3 transition-colors"
    >
      {/* 本券部分 */}
      <div className="flex-1 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-paper-dim mb-1.5">
              {formatEventDate(event.event_date)}
            </p>
            <h3 className="font-display font-bold text-lg sm:text-xl text-paper group-hover:text-lantern-2 transition-colors">
              {event.name}
            </h3>
          </div>
          <span className="text-3xl shrink-0" aria-hidden>
            {event.image_emoji}
          </span>
        </div>
        <p className="mt-3 text-sm text-paper-dim">📍 {event.venue}</p>
        <p className="mt-1 text-sm text-paper-dim">🙋 募集内容：{event.recruit_content}</p>
      </div>

      {/* 切り取り線 */}
      <div className="ticket-notch ticket-perforation w-px shrink-0" />

      {/* 半券部分 */}
      <div
        className="flex w-28 sm:w-36 shrink-0 flex-col items-center justify-center gap-2 p-3 sm:p-4 text-center"
        style={{ fontFamily: "var(--font-ticket)" }}
      >
        <StatusStamp status={status} />
        <p className="text-[11px] text-paper-dim leading-tight" style={{ fontFamily: "var(--font-body)" }}>
          締切
          <br />
          {formatDeadline(event.deadline)}
        </p>
        {status !== "closed" && (
          <p className="text-lg text-gold">残{Math.max(days, 0)}日</p>
        )}
      </div>
    </Link>
  );
}
