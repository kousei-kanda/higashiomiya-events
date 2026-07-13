import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createEvent } from "@/lib/data";
import type { EventInput } from "@/lib/types";

const REQUIRED_FIELDS: (keyof EventInput)[] = [
  "name",
  "event_date",
  "venue",
  "recruit_content",
  "description",
  "deadline",
];

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  let body: Partial<EventInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  const missing = REQUIRED_FIELDS.filter((field) => !body[field]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `入力が不足しています: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const event = await createEvent({
    name: body.name!,
    event_date: body.event_date!,
    venue: body.venue!,
    recruit_content: body.recruit_content!,
    description: body.description!,
    deadline: body.deadline!,
    capacity:
      body.capacity === null || body.capacity === undefined ? null : Number(body.capacity),
    image_emoji: body.image_emoji || "🏮",
  });

  return NextResponse.json({ event }, { status: 201 });
}
