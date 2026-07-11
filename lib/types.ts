// 将来 Supabase のテーブル定義にそのまま対応させる想定の型
// events テーブル
export type EventStatus = "open" | "closing_soon" | "closed";

export interface EventRecord {
  id: string;
  name: string; // イベント名
  event_date: string; // 開催日時 (ISO文字列)
  venue: string; // 会場
  recruit_content: string; // 募集内容
  description: string; // 詳細説明
  deadline: string; // 募集締切 (ISO文字列)
  capacity: number | null; // 募集人数
  image_emoji: string; // 簡易アイコン代わり
}

// applications テーブル
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface ApplicationRecord {
  id: string;
  event_id: string;
  group_name: string; // 団体名
  representative_name: string; // 代表者名
  email: string;
  phone: string;
  content: string; // 出演・展示内容
  group_intro: string; // 団体紹介
  pr_comment: string; // PRコメント
  status: ApplicationStatus;
  created_at: string;
}

// 参加実績（過去のイベント参加団体）
export interface ParticipationRecord {
  id: string;
  event_name: string;
  event_year: number;
  group_name: string;
  content: string;
}

export interface ApplicationInput {
  event_id: string;
  group_name: string;
  representative_name: string;
  email: string;
  phone: string;
  content: string;
  group_intro: string;
  pr_comment: string;
}
