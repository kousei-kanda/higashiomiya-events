import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { updateParticipationRecord, deleteParticipationRecord } from "@/lib/data";
import type { ParticipationRecordInput } from "@/lib/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const { id } = await params;

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

  const record = await updateParticipationRecord(id, {
    event_name: body.event_name,
    event_year: Number(body.event_year),
    group_name: body.group_name,
    content: body.content,
  });

  if (!record) {
    return NextResponse.json({ error: "参加実績が見つかりません。" }, { status: 404 });
  }

  return NextResponse.json({ record });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const { id } = await params;
  await deleteParticipationRecord(id);
  return NextResponse.json({ ok: true });
}
