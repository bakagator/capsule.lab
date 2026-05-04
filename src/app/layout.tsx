import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import AiChat from "@/components/AiChat";

export const metadata: Metadata = {
  title: "まつだ家",
  description: "まつだ家のふたりのスペース",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <AiChat />
      </body>
    </html>
  );
}
