import Link from "next/link";
import { Product, formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const mainColor = product.colors[0];

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div
        className="relative overflow-hidden"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1c1c1c",
          transition: "border-color 0.3s ease",
        }}
      >
        {/* Tag */}
        {product.tag && (
          <div
            className="absolute top-3 left-3 z-10 px-2 py-1 text-xs font-black tracking-widest"
            style={{
              background: product.tag === "LIMITED" ? "#E040FB" : product.tag === "NEW" ? "#fff" : "#E040FB",
              color: "#000",
              letterSpacing: "0.15em",
              fontSize: "9px",
            }}
          >
            {product.tag}
          </div>
        )}

        {/* Image placeholder */}
        <div
          className="aspect-square flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: mainColor.name === "CREAM" || mainColor.name === "NATURAL"
              ? "#1a1712"
              : "#0d0d0d",
            transition: "transform 0.5s ease",
          }}
        >
          {/* Geometric product placeholder */}
          <div
            className="flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-500"
          >
            {/* Hoodie silhouette */}
            <svg
              viewBox="0 0 120 140"
              width="100"
              height="120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {product.category === "HOODIE" && (
                <>
                  <path
                    d="M35 25 C35 25, 50 20, 60 20 C70 20, 85 25, 85 25 L95 50 L80 55 L80 120 L40 120 L40 55 L25 50 Z"
                    fill={mainColor.hex === "#0a0a0a" ? "#151515" : "#e8dcc8"}
                    stroke={mainColor.hex === "#0a0a0a" ? "#2a2a2a" : "#ccc0a8"}
                    strokeWidth="1"
                  />
                  <path
                    d="M50 20 C50 20, 55 30, 60 30 C65 30, 70 20, 70 20"
                    fill={mainColor.hex === "#0a0a0a" ? "#1a1a1a" : "#ddd0b8"}
                    stroke={mainColor.hex === "#0a0a0a" ? "#2a2a2a" : "#ccc0a8"}
                    strokeWidth="1"
                  />
                  {/* NE logo */}
                  <text
                    x="52"
                    y="75"
                    fill="#E040FB"
                    fontSize="10"
                    fontWeight="900"
                    fontFamily="monospace"
                    opacity="0.8"
                  >
                    NE
                  </text>
                </>
              )}
              {product.category === "TEE" && (
                <>
                  <path
                    d="M30 30 L20 50 L35 55 L35 120 L85 120 L85 55 L100 50 L90 30 L72 40 C72 40, 65 45, 60 45 C55 45, 48 40, 48 40 Z"
                    fill={mainColor.hex === "#0a0a0a" ? "#151515" : "#f5f5f5"}
                    stroke={mainColor.hex === "#0a0a0a" ? "#2a2a2a" : "#ddd"}
                    strokeWidth="1"
                  />
                  <text x="48" y="80" fill="#E040FB" fontSize="10" fontWeight="900" fontFamily="monospace" opacity="0.8">NE</text>
                </>
              )}
              {product.category === "CAP" && (
                <>
                  <ellipse cx="60" cy="80" rx="40" ry="20" fill={mainColor.hex === "#0a0a0a" ? "#151515" : "#f5f5f5"} stroke="#2a2a2a" strokeWidth="1" />
                  <path d="M20 80 C20 60, 40 50, 60 50 C80 50, 100 60, 100 80 Z" fill={mainColor.hex === "#0a0a0a" ? "#151515" : "#f5f5f5"} stroke="#2a2a2a" strokeWidth="1" />
                  <ellipse cx="60" cy="80" rx="40" ry="8" fill="none" stroke="#2a2a2a" strokeWidth="1" />
                  <path d="M60 80 L80 90" stroke="#2a2a2a" strokeWidth="1" />
                  <text x="50" y="70" fill="#E040FB" fontSize="8" fontWeight="900" fontFamily="monospace">NE</text>
                </>
              )}
              {product.category === "BAG" && (
                <>
                  <rect x="25" y="40" width="70" height="80" rx="2" fill={mainColor.hex === "#0a0a0a" ? "#151515" : "#c8b080"} stroke="#2a2a2a" strokeWidth="1" />
                  <path d="M40 40 C40 25, 80 25, 80 40" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
                  <text x="47" y="85" fill="#E040FB" fontSize="10" fontWeight="900" fontFamily="monospace" opacity="0.8">NE</text>
                </>
              )}
            </svg>
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(224,64,251,0.05)" }}
          >
            <span
              className="text-xs font-black tracking-widest px-4 py-2"
              style={{
                border: "1px solid #E040FB",
                color: "#E040FB",
                letterSpacing: "0.2em",
                background: "rgba(0,0,0,0.8)",
              }}
            >
              VIEW
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4" style={{ borderTop: "1px solid #1c1c1c" }}>
          <p className="text-xs font-bold tracking-widest mb-1" style={{ color: "#444", letterSpacing: "0.2em" }}>
            {product.category}
          </p>
          <h3 className="font-black text-sm tracking-wide mb-1" style={{ letterSpacing: "0.05em" }}>
            {product.name}
          </h3>
          <p className="text-sm" style={{ color: "#666" }}>
            {product.nameJa}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-black text-sm" style={{ color: "#E040FB" }}>
              {formatPrice(product.price)}
            </span>
            <div className="flex gap-1.5">
              {product.colors.map((c) => (
                <div
                  key={c.name}
                  className="w-3 h-3 rounded-full border"
                  style={{
                    background: c.hex,
                    borderColor: c.hex === "#0a0a0a" ? "#333" : "transparent",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
