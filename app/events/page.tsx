import type { Metadata } from "next";
import { getEvents } from "@/lib/data";
import EventTicketCard from "@/components/EventTicketCard";

export const metadata: Metadata = {
  title: "イベント一覧 | 東大宮商工会 × 学生団体",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <p
        className="text-gold text-xs tracking-[0.3em] mb-3"
        style={{ fontFamily: "var(--font-ticket)" }}
      >
        EVENT LIST
      </p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper mb-3">
        イベント一覧
      </h1>
      <p className="text-paper-dim mb-10 max-w-2xl">
        東大宮商工会が募集しているイベントです。気になるイベントの券をめくって詳細を確認し、そのまま出店・出演の応募ができます。
      </p>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-line bg-night-2 p-10 text-center text-paper-dim">
          現在募集中のイベントはありません。しばらくしてから再度ご確認ください。
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <EventTicketCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
