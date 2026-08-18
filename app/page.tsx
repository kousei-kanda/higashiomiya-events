import { getEvents } from "@/lib/data";
import { formatDeadline } from "@/lib/format";
import EventPromoRow from "@/components/EventPromoRow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const events = await getEvents();
  const upcoming = events.slice(0, 2);

  return (
    <div>
      {/* ポスター */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/canble_poster.jpg"
          alt="出演者・展示物募集中！"
          className="w-full h-auto rounded-lg bg-line"
        />
      </section>

      {/* 出演者・展示物募集中！ */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 pt-10">
        <h2 className="bg-green text-white font-display font-bold text-lg sm:text-xl px-5 py-3 rounded-md">
          出演者・展示物募集中！
        </h2>
        <p className="mt-5 text-sm sm:text-base text-text leading-relaxed">
          東大宮商工会が開催する夏祭りなどのイベントに応募しませんか。「パフォーマンス」から「展示」まで幅広くOK！サークル、部活、研究室など問わず興味がある方は気軽に応募してください！
        </p>
      </section>

      {/* 募集中のイベント一覧 */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 pt-12 pb-20">
        <h2 className="bg-green text-white font-display font-bold text-lg sm:text-xl px-5 py-3 rounded-md">
          募集中のイベント一覧
        </h2>
        <div className="divide-y divide-line">
          {upcoming.map((event, index) => (
            <EventPromoRow
              key={event.id}
              imageSrc={index === 0 ? "/images/sf_2026.jpg" : "/images/illumi_2026.jpg"}
              imageAlt={event.name}
              title={event.name}
              deadlineText={formatDeadline(event.deadline)}
              description={event.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
