import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth";
import { getParticipationRecordById } from "@/lib/data";
import AdminNav from "@/components/AdminNav";
import RecordForm from "@/components/RecordForm";

export const dynamic = "force-dynamic";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const record = await getParticipationRecordById(id);
  if (!record) notFound();

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

      <Link href="/admin/records" className="text-sm text-paper-dim hover:text-paper">
        ← 参加実績管理に戻る
      </Link>
      <h2 className="font-display font-bold text-2xl text-paper mt-4 mb-6">
        参加実績を編集：{record.group_name}
      </h2>

      <RecordForm record={record} />
    </div>
  );
}
