import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "パパクエスト",
  description: "子育てパパのための、ゲームで学ぶ育児準備アプリ",
};

export const viewport: Viewport = {
  themeColor: "#5B86C5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <header
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center px-6 py-4"
          style={{
            background: "rgba(246, 249, 253, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "18px" }}>👨‍🍼</span>
          <span className="ml-2 font-bold tracking-wide" style={{ fontSize: "17px" }}>
            パパクエスト
          </span>
        </header>
        <main className="flex-1 pt-16">{children}</main>
      </body>
    </html>
  );
}
