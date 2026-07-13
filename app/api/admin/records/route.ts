import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createParticipationRecord } from "@/lib/data";
import type { ParticipationRecordInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  let body: Partial<ParticipationRecordInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  if (!body.event_name || !body.group_name || !body.content || !body.event_year) {
    return NextResponse.json({ error: "入力が不足しています。" }, { status: 400 });
  }

  const record = await createParticipationRecord({
    event_name: body.event_name,
    event_year: Number(body.event_year),
    group_name: body.group_name,
    content: body.content,
  });

  return NextResponse.json({ record }, { status: 201 });
}
