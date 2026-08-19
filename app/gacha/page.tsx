import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ガチャ | 東大宮商工会 × 学生団体",
};

const GACHA_URL = "https://h-gatya.github.io/higaomesi/";

export default function GachaPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="bg-green text-white font-display font-bold text-lg sm:text-xl px-5 py-3 rounded-md">
          東大宮グルメガチャ
        </h2>
        <a
          href={GACHA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-text-dim hover:text-green transition-colors"
        >
          新しいタブで開く ↗
        </a>
      </div>
      <p className="mt-5 text-sm sm:text-base text-text leading-relaxed">
        今日どこで食べるか迷ったら、ガチャを回して東大宮のお店を決めよう！
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-surface overflow-hidden">
        <iframe
          src={GACHA_URL}
          title="東大宮ガチャ"
          className="w-full h-[75vh] min-h-[500px] bg-surface"
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-xs text-text-dim">
        うまく表示されない場合は、上の「新しいタブで開く」からアクセスしてください。
      </p>
    </div>
  );
}
