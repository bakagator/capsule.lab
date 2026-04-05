import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "_____NEVER_ENDING_____ | 終わらない夢",
  description:
    "Street apparel brand rooted in the dream that never ends. 終わらない夢をストリートに。",
  keywords: ["streetwear", "never ending", "apparel", "hoodie", "japan"],
  openGraph: {
    title: "_____NEVER_ENDING_____",
    description: "終わらない夢をストリートに。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Nav />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
