import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth";
import { getEventById } from "@/lib/data";
import AdminNav from "@/components/AdminNav";
import EventForm from "@/components/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-16">
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

      <Link href="/admin/events" className="text-sm text-paper-dim hover:text-paper">
        ← イベント管理に戻る
      </Link>
      <h2 className="font-display font-bold text-2xl text-paper mt-4 mb-6">
        イベントを編集：{event.name}
      </h2>

      <EventForm event={event} />
    </div>
  );
}
