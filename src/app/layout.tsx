import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "マツダの『ホンネとタテマエ』",
  description: "松田の独り言アプリ。口に出したタテマエと、心の中のホンネを記録する。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
