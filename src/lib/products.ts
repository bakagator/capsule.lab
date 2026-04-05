export type Product = {
  id: string;
  name: string;
  nameJa: string;
  price: number;
  category: string;
  colors: { name: string; hex: string; images: string[] }[];
  sizes: string[];
  description: string;
  descriptionJa: string;
  tag?: string;
};

export const products: Product[] = [
  {
    id: "ne-hoodie-black",
    name: "NE GRAFFITI HOODIE",
    nameJa: "グラフィティフーディー",
    price: 18000,
    category: "HOODIE",
    colors: [
      {
        name: "BLACK",
        hex: "#0a0a0a",
        images: ["/images/hoodie-black-front.jpg", "/images/hoodie-black-back.jpg"],
      },
      {
        name: "CREAM",
        hex: "#e8e0d0",
        images: ["/images/hoodie-cream-front.jpg", "/images/hoodie-cream-back.jpg"],
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Oversized heavyweight hoodie with hand-drawn graffiti logo. 420gsm cotton fleece. Dropped shoulders, kangaroo pocket.",
    descriptionJa:
      "ハンドドロウンのグラフィティロゴを施したオーバーサイズヘビーウェイトフーディー。420gsmコットンフリース。ドロップショルダー、カンガルーポケット。",
    tag: "BESTSELLER",
  },
  {
    id: "ne-hoodie-small-logo",
    name: "NE SMALL LOGO HOODIE",
    nameJa: "スモールロゴフーディー",
    price: 16000,
    category: "HOODIE",
    colors: [
      {
        name: "BLACK",
        hex: "#0a0a0a",
        images: ["/images/hoodie-small-black.jpg"],
      },
      {
        name: "CREAM",
        hex: "#e8e0d0",
        images: ["/images/hoodie-small-cream.jpg"],
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Clean silhouette with embroidered NE logo on chest. 380gsm premium cotton. Regular fit.",
    descriptionJa:
      "胸元に刺繍のNEロゴを施したクリーンシルエット。380gsmプレミアムコットン。レギュラーフィット。",
    tag: "NEW",
  },
  {
    id: "ne-tee-graffiti",
    name: "NE GRAFFITI TEE",
    nameJa: "グラフィティTシャツ",
    price: 9000,
    category: "TEE",
    colors: [
      {
        name: "BLACK",
        hex: "#0a0a0a",
        images: ["/images/tee-black.jpg"],
      },
      {
        name: "WHITE",
        hex: "#f5f5f5",
        images: ["/images/tee-white.jpg"],
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Heavyweight 240gsm cotton tee with oversized graffiti back print. Boxy fit.",
    descriptionJa:
      "240gsm ヘビーウェイトコットン。バックに大判グラフィティプリント。ボックスシルエット。",
  },
  {
    id: "ne-cap",
    name: "NE LOGO CAP",
    nameJa: "ロゴキャップ",
    price: 7500,
    category: "CAP",
    colors: [
      {
        name: "BLACK",
        hex: "#0a0a0a",
        images: ["/images/cap-black.jpg"],
      },
    ],
    sizes: ["ONE SIZE"],
    description:
      "6-panel structured cap with embroidered NE bird logo. Adjustable strap.",
    descriptionJa:
      "NE バードロゴ刺繍の6パネルキャップ。アジャスタブルストラップ。",
    tag: "NEW",
  },
  {
    id: "ne-bag",
    name: "NE TOTE BAG",
    nameJa: "トートバッグ",
    price: 5500,
    category: "BAG",
    colors: [
      {
        name: "BLACK",
        hex: "#0a0a0a",
        images: ["/images/bag-black.jpg"],
      },
      {
        name: "NATURAL",
        hex: "#c8b99a",
        images: ["/images/bag-natural.jpg"],
      },
    ],
    sizes: ["ONE SIZE"],
    description:
      "Heavy canvas tote with screen-printed NE graffiti logo. 12oz canvas.",
    descriptionJa:
      "スクリーンプリントのNEグラフィティロゴ入りヘビーキャンバストート。12ozキャンバス。",
  },
  {
    id: "ne-hoodie-pink",
    name: "NE BIRD HOODIE",
    nameJa: "バードフーディー",
    price: 19500,
    category: "HOODIE",
    colors: [
      {
        name: "BLACK/PINK",
        hex: "#0a0a0a",
        images: ["/images/hoodie-bird.jpg"],
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Limited edition hoodie featuring the iconic NE bird logo in neon pink. 420gsm cotton. Oversized fit.",
    descriptionJa:
      "ネオンピンクのNEバードロゴを施したリミテッドエディションフーディー。420gsmコットン。オーバーサイズフィット。",
    tag: "LIMITED",
  },
];

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}
