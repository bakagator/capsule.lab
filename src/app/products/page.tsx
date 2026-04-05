"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["ALL", "HOODIE", "TEE", "CAP", "BAG"];

export default function ProductsPage() {
  const [active, setActive] = useState("ALL");

  const filtered =
    active === "ALL" ? products : products.filter((p) => p.category === active);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p
          className="text-xs font-black tracking-widest mb-3"
          style={{ color: "#E040FB", letterSpacing: "0.4em" }}
        >
          SHOP
        </p>
        <h1
          className="text-4xl md:text-5xl font-black"
          style={{ letterSpacing: "0.05em" }}
        >
          ALL PRODUCTS
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#444", letterSpacing: "0.05em" }}>
          全商品
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 mb-12 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-5 py-2 text-xs font-black tracking-widest transition-all duration-200"
            style={{
              letterSpacing: "0.2em",
              background: active === cat ? "#E040FB" : "transparent",
              color: active === cat ? "#000" : "#444",
              border: `1px solid ${active === cat ? "#E040FB" : "#1c1c1c"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{ background: "#1c1c1c" }}
      >
        {filtered.map((p) => (
          <div key={p.id} style={{ background: "#000" }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <p className="text-sm" style={{ color: "#333" }}>
            No products found.
          </p>
        </div>
      )}
    </div>
  );
}
