import type { EventStatus } from "@/lib/types";

const STAMP_LABEL: Record<EventStatus, string> = {
  open: "募集中",
  closing_soon: "締切間近",
  closed: "受付終了",
};

const STAMP_COLOR: Record<EventStatus, string> = {
  open: "border-lantern text-lantern",
  closing_soon: "border-gold text-gold",
  closed: "border-paper-dim text-paper-dim",
};

export default function StatusStamp({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 px-3 py-1 text-xs font-bold tracking-widest -rotate-6 ${STAMP_COLOR[status]}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {STAMP_LABEL[status]}
    </span>
  );
}
