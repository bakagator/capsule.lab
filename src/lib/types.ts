export type Scene = "仕事" | "家族" | "友達" | "ひとり" | "その他";

export const SCENES: Scene[] = ["仕事", "家族", "友達", "ひとり", "その他"];

export type Hitorigoto = {
  id: string;
  tatemae: string;
  honne: string;
  scene: Scene;
  gap: number; // 1〜5 ギャップ度
  timestamp: string;
};

export type Mode = "tatemae" | "honne";
