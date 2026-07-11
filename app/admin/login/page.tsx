"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "ログインに失敗しました。");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期しないエラーが発生しました。");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20 sm:py-28">
      <p
        className="text-gold text-xs tracking-[0.3em] mb-3"
        style={{ fontFamily: "var(--font-ticket)" }}
      >
        STAFF ONLY
      </p>
      <h1 className="font-display font-bold text-2xl text-paper mb-2">管理者ログイン</h1>
      <p className="text-sm text-paper-dim mb-8">
        東大宮商工会 担当者用のページです。パスワードを入力してください。
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-paper mb-1.5">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line bg-night-2 px-4 py-2.5 text-paper focus:border-lantern outline-none transition-colors"
          />
        </div>

        {error && (
          <p className="text-sm text-lantern-2" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-lantern hover:bg-lantern-2 disabled:opacity-50 transition-colors px-6 py-3 font-bold text-night"
        >
          {loading ? "確認中…" : "ログイン"}
        </button>
      </form>
    </div>
  );
}
