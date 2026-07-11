import Link from "next/link";
import { getEvents } from "@/lib/data";
import EventTicketCard from "@/components/EventTicketCard";

export default async function HomePage() {
  const events = await getEvents();
  const upcoming = events.slice(0, 2);

  return (
    <div>
      {/* ヒーロー */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <p
            className="text-gold text-sm tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-ticket)" }}
          >
            HIGASHIOMIYA SHOTENKAI
          </p>
          <h1 className="font-display font-black text-4xl sm:text-6xl leading-[1.2] text-paper max-w-3xl">
            商店街の灯りに、
            <br />
            <span className="text-lantern-2">学生の出番</span>を灯す。
          </h1>
          <p className="mt-6 text-paper-dim max-w-xl leading-relaxed">
            東大宮商工会が開催する夏祭りや月例イベントに、大学のサークル・ゼミが出店・出演できます。
            知られていなかった地域のイベントと、発表の場を探す学生団体を、このサイトがつなぎます。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full bg-lantern hover:bg-lantern-2 transition-colors px-6 py-3 font-bold text-night"
            >
              イベント一覧を見る →
            </Link>
            <Link
              href="/records"
              className="inline-flex items-center gap-2 rounded-full border border-line hover:border-paper-dim transition-colors px-6 py-3 text-paper"
            >
              過去の参加実績
            </Link>
          </div>
        </div>

        {/* 提灯が並ぶ装飾ライン */}
        <div
          className="flex justify-center gap-8 text-3xl opacity-70 select-none pb-4"
          aria-hidden
        >
          <span>🏮</span>
          <span>🏮</span>
          <span>🏮</span>
          <span>🏮</span>
          <span>🏮</span>
        </div>
      </section>

      {/* 直近のイベント */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-20">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display font-bold text-2xl text-paper">直近の募集</h2>
          <Link href="/events" className="text-sm text-paper-dim hover:text-paper">
            すべて見る →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {upcoming.map((event) => (
            <EventTicketCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
