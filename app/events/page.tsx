import type { Metadata } from "next";
import { getEvents, getEventStatus } from "@/lib/data";
import { formatDeadline, formatEventDate } from "@/lib/format";
import { getEventImageSrc } from "@/lib/eventImages";
import EventPromoRow from "@/components/EventPromoRow";

export const metadata: Metadata = {
  title: "イベント一覧 | 東大宮商工会 × 学生団体",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  const recruiting = events.filter((event) => getEventStatus(event) !== "closed");
  const past = events.filter((event) => getEventStatus(event) === "closed");

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <section>
        <h2 className="bg-green text-white font-display font-bold text-lg sm:text-xl px-5 py-3 rounded-md">
          募集中のイベント一覧
        </h2>
        {recruiting.length === 0 ? (
          <p className="mt-5 text-sm text-text-dim">
            現在募集中のイベントはありません。しばらくしてから再度ご確認ください。
          </p>
        ) : (
          <div className="divide-y divide-line">
            {recruiting.map((event) => (
              <EventPromoRow
                key={event.id}
                eventId={event.id}
                imageSrc={getEventImageSrc(event.id)}
                imageAlt={event.name}
                title={event.name}
                eventDateText={formatEventDate(event.event_date)}
                venueText={event.venue}
                deadlineText={formatDeadline(event.deadline)}
                isClosed={getEventStatus(event) === "closed"}
                description={event.description}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="bg-green text-white font-display font-bold text-lg sm:text-xl px-5 py-3 rounded-md">
          過去のイベント一覧
        </h2>
        {past.length === 0 ? (
          <p className="mt-5 text-sm text-text-dim">過去のイベントはまだありません。</p>
        ) : (
          <div className="divide-y divide-line">
            {past.map((event) => (
              <EventPromoRow
                key={event.id}
                eventId={event.id}
                imageSrc={getEventImageSrc(event.id)}
                imageAlt={event.name}
                title={event.name}
                eventDateText={formatEventDate(event.event_date)}
                venueText={event.venue}
                deadlineText={formatDeadline(event.deadline)}
                isClosed={getEventStatus(event) === "closed"}
                description={event.description}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
