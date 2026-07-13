import { requireAdminPage } from "@/lib/auth";
import { getApplications, getEvents } from "@/lib/data";
import { APPLICATION_STATUS_LABEL } from "@/lib/types";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: "border-gold text-gold",
  accepted: "border-lantern text-lantern",
  rejected: "border-paper-dim text-paper-dim",
};

export default async function AdminPage() {
  await requireAdminPage();

  const [applications, events] = await Promise.all([getApplications(), getEvents()]);
  const eventNameById = new Map(events.map((e) => [e.id, e.name]));

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

      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-paper">応募一覧</h2>
        <p className="text-paper-dim mt-1 text-sm">
          全{applications.length}件の応募があります。
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-line bg-night-2 p-10 text-center text-paper-dim">
          まだ応募はありません。
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-line bg-night-2 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-paper-dim mb-1">
                    {eventNameById.get(app.event_id) ?? "（削除されたイベント）"}
                  </p>
                  <h2 className="font-display font-bold text-lg text-paper">
                    {app.group_name}
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold -rotate-3 ${STATUS_BADGE_CLASS[app.status]}`}
                >
                  {APPLICATION_STATUS_LABEL[app.status]}
                </span>
              </div>

              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-paper-dim text-xs mb-0.5">代表者</dt>
                  <dd className="text-paper">{app.representative_name}</dd>
                </div>
                <div>
                  <dt className="text-paper-dim text-xs mb-0.5">連絡先</dt>
                  <dd className="text-paper">
                    {app.email}｜{app.phone}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-paper-dim text-xs mb-0.5">出演・展示内容</dt>
                  <dd className="text-paper whitespace-pre-wrap">{app.content}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-paper-dim text-xs mb-0.5">団体紹介</dt>
                  <dd className="text-paper whitespace-pre-wrap">{app.group_intro}</dd>
                </div>
                {app.pr_comment && (
                  <div className="sm:col-span-2">
                    <dt className="text-paper-dim text-xs mb-0.5">PRコメント</dt>
                    <dd className="text-paper whitespace-pre-wrap">{app.pr_comment}</dd>
                  </div>
                )}
              </dl>

              <p
                className="mt-4 text-xs text-paper-dim"
                style={{ fontFamily: "var(--font-ticket)" }}
              >
                応募日時：
                {new Date(app.created_at).toLocaleString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
