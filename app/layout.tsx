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
      <body className="min-h-full flex flex-col bg-night text-paper">
        <header className="border-b border-line">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-2xl" aria-hidden>
                🏮
              </span>
              <span className="font-display font-bold text-lg tracking-wide text-paper group-hover:text-lantern-2 transition-colors">
                東大宮商工会 × 学生団体
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/events"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                イベント一覧
              </Link>
              <Link
                href="/records"
                className="text-paper-dim hover:text-paper transition-colors"
              >
                参加実績
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 text-xs text-paper-dim flex flex-col sm:flex-row gap-2 sm:justify-between">
            <span>東大宮商工会 イベント参加オファーシステム（開発中プロトタイプ）</span>
            <span>© 東大宮商工会</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
