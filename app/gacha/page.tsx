import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ガチャ | 東大宮商工会 × 学生団体",
};

const GACHA_URL = "https://h-gatya.github.io/higaomesi/";

export default function GachaPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <p
        className="text-gold text-xs tracking-[0.3em] mb-3"
        style={{ fontFamily: "var(--font-ticket)" }}
      >
        GACHA
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper">
          東大宮ガチャ
        </h1>
        <a
          href={GACHA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-paper-dim hover:text-paper transition-colors"
        >
          新しいタブで開く ↗
        </a>
      </div>
      <p className="text-paper-dim mb-8 max-w-2xl">
        今日どこで食べるか迷ったら、ガチャを回して東大宮のお店を決めてみましょう。
      </p>

      <div className="rounded-2xl border border-line bg-night-2 overflow-hidden">
        <iframe
          src={GACHA_URL}
          title="東大宮ガチャ"
          className="w-full h-[75vh] min-h-[500px] bg-paper"
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-xs text-paper-dim">
        うまく表示されない場合は、上の「新しいタブで開く」からアクセスしてください。
      </p>
    </div>
  );
}
