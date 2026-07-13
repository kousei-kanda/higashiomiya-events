const WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"];

// サーバーの実行環境のタイムゾーンに関わらず、常に日本時間(Asia/Tokyo)で
// 表示するため、Intl.DateTimeFormat で明示的にタイムゾーンを指定しています。
function getJstParts(iso: string) {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") === "24" ? "00" : get("hour"),
    minute: get("minute"),
    weekday: WEEKDAY_JA[weekdayIndex] ?? "",
  };
}

export function formatEventDate(iso: string): string {
  const p = getJstParts(iso);
  return `${p.year}年${Number(p.month)}月${Number(p.day)}日（${p.weekday}）${p.hour}:${p.minute}〜`;
}

export function formatDeadline(iso: string): string {
  const p = getJstParts(iso);
  return `${p.year}/${p.month}/${p.day}`;
}

export function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// <input type="datetime-local"> ⇔ ISO文字列 の相互変換
// 常に「日本時間の壁時計時刻」として扱う（サーバーのタイムゾーンに依存しない）

export function jstLocalInputToIso(value: string): string {
  // value: "2026-08-15T16:00" (秒・タイムゾーンなし) を日本時間として解釈
  return `${value}:00+09:00`;
}

export function isoToJstLocalInput(iso: string): string {
  const p = getJstParts(iso);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
