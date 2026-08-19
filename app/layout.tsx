import type { Metadata } from "next";
import { Noto_Serif_JP, Zen_Kaku_Gothic_New, DotGothic16 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dotGothic = DotGothic16({
  variable: "--font-dotgothic16",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "東大宮商工会 × 学生団体 | イベント出演オファー",
  description:
    "東大宮商工会が主催するイベントに、学生団体が出店・出演を応募できるサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${zenKaku.variable} ${dotGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <header className="bg-surface border-b border-line">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="font-display font-bold text-lg tracking-wide text-text">
                東大宮商工会
              </span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap justify-end">
              <Link
                href="/"
                className="text-text hover:text-green transition-colors"
              >
                ホーム
              </Link>
              <Link
                href="/events"
                className="text-text hover:text-green transition-colors"
              >
                イベント一覧
              </Link>
              <Link
                href="/records"
                className="text-text hover:text-green transition-colors"
              >
                参加実績
              </Link>
              <Link
                href="/gacha"
                className="text-text hover:text-green transition-colors"
              >
                ガチャ
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-surface border-t border-line mt-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 text-xs text-text-dim flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Link href="/privacy-policy" className="hover:text-green transition-colors">
              プライバシーポリシー
            </Link>
            <span>商工会の方はこちら</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
