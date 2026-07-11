import { NextRequest, NextResponse } from "next/server";
import { createApplication, getEventById } from "@/lib/data";
import type { ApplicationInput } from "@/lib/types";

const REQUIRED_FIELDS: (keyof ApplicationInput)[] = [
  "event_id",
  "group_name",
  "representative_name",
  "email",
  "phone",
  "content",
  "group_intro",
];

export async function POST(req: NextRequest) {
  let body: Partial<ApplicationInput>;
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

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(body.email!)) {
    return NextResponse.json(
      { error: "メールアドレスの形式が正しくありません。" },
      { status: 400 }
    );
  }

  const event = await getEventById(body.event_id!);
  if (!event) {
    return NextResponse.json(
      { error: "指定されたイベントが見つかりません。" },
      { status: 404 }
    );
  }

  const application = await createApplication({
    event_id: body.event_id!,
    group_name: body.group_name!,
    representative_name: body.representative_name!,
    email: body.email!,
    phone: body.phone!,
    content: body.content!,
    group_intro: body.group_intro!,
    pr_comment: body.pr_comment ?? "",
  });

  return NextResponse.json({ application }, { status: 201 });
}
