import type { Metadata } from "next";
import RpgGame from "@/components/rpg/RpgGame";

export const metadata: Metadata = {
  title: "つむぎ堂クロニクル｜経営学RPG",
  description: "小さな和菓子店を舞台に、経営学の基礎から学べるRPG",
};

export default function RpgPage() {
  return <RpgGame />;
}
