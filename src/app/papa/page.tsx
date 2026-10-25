import type { Metadata } from "next";
import PapaQuest from "@/components/papa/PapaQuest";

export const metadata: Metadata = {
  title: "パパクエスト | まつだ家",
  description: "子育てパパのための、ゲームで学ぶ育児準備アプリ",
};

export default function PapaPage() {
  return <PapaQuest />;
}
