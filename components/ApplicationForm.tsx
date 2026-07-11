"use client";

import { useState, type FormEvent } from "react";

const FIELD_CLASS =
  "w-full rounded-lg border border-line bg-night px-4 py-2.5 text-paper placeholder:text-paper-dim/60 focus:border-lantern outline-none transition-colors";
const LABEL_CLASS = "block text-sm font-bold text-paper mb-1.5";

export default function ApplicationForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      event_id: eventId,
      group_name: String(data.get("group_name") || ""),
      representative_name: String(data.get("representative_name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      content: String(data.get("content") || ""),
      group_intro: String(data.get("group_intro") || ""),
      pr_comment: String(data.get("pr_comment") || ""),
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "応募の送信に失敗しました。");
      }

      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "予期しないエラーが発生しました。"
      );
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-lantern bg-night-2 p-8 text-center">
        <p className="text-3xl mb-3" aria-hidden>
          🏮
        </p>
        <h3 className="font-display font-bold text-xl text-paper mb-2">
          応募を受け付けました
        </h3>
        <p className="text-paper-dim text-sm leading-relaxed">
          ご入力いただいたメールアドレスに確認メールを送信しました。
          商工会担当者が内容を確認のうえ、採否についてあらためてご連絡します。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="group_name" className={LABEL_CLASS}>
            団体名 <span className="text-lantern">*</span>
          </label>
          <input
            id="group_name"
            name="group_name"
            required
            placeholder="例：大道芸サークル PIERROT"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="representative_name" className={LABEL_CLASS}>
            代表者名 <span className="text-lantern">*</span>
          </label>
          <input
            id="representative_name"
            name="representative_name"
            required
            placeholder="例：山田 太郎"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            メールアドレス <span className="text-lantern">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="example@saitama-u.ac.jp"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>
            電話番号 <span className="text-lantern">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="090-1234-5678"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className={LABEL_CLASS}>
          出演・展示内容 <span className="text-lantern">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={3}
          placeholder="例：ジャグリングとバルーンアートを合わせた15分程度のステージパフォーマンス"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="group_intro" className={LABEL_CLASS}>
          団体紹介 <span className="text-lantern">*</span>
        </label>
        <textarea
          id="group_intro"
          name="group_intro"
          required
          rows={3}
          placeholder="活動年数、部員数、これまでの活動実績など"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="pr_comment" className={LABEL_CLASS}>
          PRコメント
        </label>
        <textarea
          id="pr_comment"
          name="pr_comment"
          rows={2}
          placeholder="意気込みやアピールポイントがあればご記入ください"
          className={FIELD_CLASS}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-lantern-2" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-full bg-lantern hover:bg-lantern-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-8 py-3 font-bold text-night"
      >
        {status === "submitting" ? "送信中…" : "この内容で応募する"}
      </button>
    </form>
  );
}
