"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-sm" style={{ color: "#444" }}>
          Product not found.
        </p>
        <Link
          href="/products"
          className="text-xs font-black tracking-widest"
          style={{ color: "#E040FB", letterSpacing: "0.2em" }}
        >
          ← BACK TO SHOP
        </Link>
      </div>
    );
  }

  const color = product.colors[selectedColor];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      color: color.name,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs" style={{ color: "#333", letterSpacing: "0.15em" }}>
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">SHOP</Link>
          <span>/</span>
          <span style={{ color: "#555" }}>{product.name}</span>
        </nav>
      </div>

      {/* Product */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image */}
          <div>
            <div
              className="aspect-square flex items-center justify-center relative"
              style={{
                background: color.name === "CREAM" || color.name === "NATURAL" ? "#1a1712" : "#0a0a0a",
                border: "1px solid #1c1c1c",
              }}
            >
              {/* Tag */}
              {product.tag && (
                <div
                  className="absolute top-4 left-4 px-2.5 py-1 text-xs font-black tracking-widest"
                  style={{
                    background: "#E040FB",
                    color: "#000",
                    letterSpacing: "0.15em",
                    fontSize: "9px",
                  }}
                >
                  {product.tag}
                </div>
              )}

              {/* Product SVG */}
              <svg
                viewBox="0 0 160 200"
                width="200"
                height="250"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {product.category === "HOODIE" && (
                  <>
                    <path
                      d="M45 38 C45 38, 65 30, 80 30 C95 30, 115 38, 115 38 L135 75 L110 82 L110 170 L50 170 L50 82 L25 75 Z"
                      fill={color.hex === "#0a0a0a" ? "#1a1a1a" : "#e8dcc8"}
                      stroke={color.hex === "#0a0a0a" ? "#2e2e2e" : "#ccc0a8"}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M63 30 C63 30, 70 44, 80 44 C90 44, 97 30, 97 30"
                      fill={color.hex === "#0a0a0a" ? "#151515" : "#ddd0b8"}
                      stroke={color.hex === "#0a0a0a" ? "#2e2e2e" : "#ccc0a8"}
                      strokeWidth="1.5"
                    />
                    {/* Graffiti logo text */}
                    <text x="66" y="115" fill="#E040FB" fontSize="16" fontWeight="900" fontFamily="monospace" opacity="0.9">NE</text>
                    {/* Pocket line */}
                    <line x1="50" y1="140" x2="110" y2="140" stroke={color.hex === "#0a0a0a" ? "#222" : "#bbb"} strokeWidth="1" />
                  </>
                )}
                {product.category === "TEE" && (
                  <>
                    <path
                      d="M40 45 L22 72 L45 80 L45 170 L115 170 L115 80 L138 72 L120 45 L98 58 C98 58, 88 65, 80 65 C72 65, 62 58, 62 58 Z"
                      fill={color.hex === "#0a0a0a" ? "#1a1a1a" : "#f5f5f5"}
                      stroke={color.hex === "#0a0a0a" ? "#2e2e2e" : "#ddd"}
                      strokeWidth="1.5"
                    />
                    <text x="66" y="115" fill="#E040FB" fontSize="16" fontWeight="900" fontFamily="monospace" opacity="0.9">NE</text>
                  </>
                )}
                {product.category === "CAP" && (
                  <>
                    <ellipse cx="80" cy="120" rx="60" ry="30" fill={color.hex === "#0a0a0a" ? "#1a1a1a" : "#f5f5f5"} stroke="#2a2a2a" strokeWidth="1.5" />
                    <path d="M20 120 C20 85, 48 65, 80 65 C112 65, 140 85, 140 120 Z" fill={color.hex === "#0a0a0a" ? "#1a1a1a" : "#f5f5f5"} stroke="#2a2a2a" strokeWidth="1.5" />
                    <ellipse cx="80" cy="120" rx="60" ry="12" fill="none" stroke="#2a2a2a" strokeWidth="1" />
                    <path d="M80 120 L115 135" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
                    <text x="68" y="105" fill="#E040FB" fontSize="14" fontWeight="900" fontFamily="monospace">NE</text>
                  </>
                )}
                {product.category === "BAG" && (
                  <>
                    <rect x="30" y="60" width="100" height="110" rx="3" fill={color.hex === "#0a0a0a" ? "#1a1a1a" : "#c8b080"} stroke="#2a2a2a" strokeWidth="1.5" />
                    <path d="M50 60 C50 35, 110 35, 110 60" fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
                    <text x="62" y="125" fill="#E040FB" fontSize="16" fontWeight="900" fontFamily="monospace" opacity="0.9">NE</text>
                  </>
                )}
              </svg>

              {/* Glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(224,64,251,0.04) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Color swatches row */}
            <div className="flex gap-2 mt-4">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(i)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest transition-all"
                  style={{
                    border: `1px solid ${selectedColor === i ? "#E040FB" : "#1c1c1c"}`,
                    color: selectedColor === i ? "#E040FB" : "#444",
                    letterSpacing: "0.1em",
                    background: "transparent",
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: c.hex,
                      border: c.hex === "#0a0a0a" ? "1px solid #333" : "none",
                    }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <p
              className="text-xs font-black tracking-widest mb-2"
              style={{ color: "#444", letterSpacing: "0.3em" }}
            >
              {product.category}
            </p>
            <h1
              className="text-3xl font-black mb-1"
              style={{ letterSpacing: "0.05em" }}
            >
              {product.name}
            </h1>
            <p className="text-sm mb-6" style={{ color: "#555" }}>
              {product.nameJa}
            </p>

            <p
              className="text-2xl font-black mb-8"
              style={{ color: "#E040FB" }}
            >
              {formatPrice(product.price)}
              <span className="text-xs ml-2" style={{ color: "#444" }}>
                (税込)
              </span>
            </p>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-xs font-black tracking-widest"
                  style={{ color: "#555", letterSpacing: "0.2em" }}
                >
                  SIZE
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-14 h-10 text-xs font-black tracking-widest transition-all duration-200"
                    style={{
                      letterSpacing: "0.1em",
                      border: `1px solid ${selectedSize === size ? "#E040FB" : "#1c1c1c"}`,
                      background: selectedSize === size ? "#E040FB" : "transparent",
                      color: selectedSize === size ? "#000" : "#444",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full py-4 text-xs font-black tracking-widest transition-all duration-200"
              style={{
                background: added ? "#fff" : selectedSize ? "#E040FB" : "#111",
                color: added || selectedSize ? "#000" : "#333",
                border: `1px solid ${added ? "#fff" : selectedSize ? "#E040FB" : "#1c1c1c"}`,
                letterSpacing: "0.25em",
                cursor: selectedSize ? "pointer" : "not-allowed",
              }}
            >
              {added ? "✓ ADDED TO CART" : selectedSize ? "ADD TO CART / カートに追加" : "SELECT A SIZE"}
            </button>

            <Link
              href="/cart"
              className="mt-3 w-full py-4 text-center text-xs font-black tracking-widest border transition-all duration-200 hover:border-white hover:text-white block"
              style={{
                borderColor: "#1c1c1c",
                color: "#333",
                letterSpacing: "0.25em",
              }}
            >
              VIEW CART
            </Link>

            {/* Description */}
            <div className="mt-10 pt-10" style={{ borderTop: "1px solid #111" }}>
              <p
                className="text-xs font-black tracking-widest mb-4"
                style={{ color: "#333", letterSpacing: "0.25em" }}
              >
                DETAILS
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#666", lineHeight: "1.9" }}>
                {product.description}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#444", lineHeight: "1.9" }}>
                {product.descriptionJa}
              </p>
            </div>

            {/* Shipping note */}
            <div
              className="mt-8 p-4"
              style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}
            >
              <p className="text-xs font-black tracking-widest mb-2" style={{ color: "#333", letterSpacing: "0.2em" }}>
                SHIPPING / 配送
              </p>
              <p className="text-xs" style={{ color: "#444", lineHeight: "1.8" }}>
                全国送料無料 / Free shipping Japan-wide
                <br />
                ご注文から3〜5営業日以内に発送
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ borderTop: "1px solid #111" }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <p
              className="text-xs font-black tracking-widest mb-10"
              style={{ color: "#E040FB", letterSpacing: "0.4em" }}
            >
              YOU MIGHT ALSO LIKE
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: "#1c1c1c" }}
            >
              {related.map((p) => (
                <div key={p.id} style={{ background: "#000" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
