import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "松田スタジオ — SNS/note 自動更新",
  description: "ニュースから松田さんらしい投稿文を生成し、承認して各SNSへ",
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
