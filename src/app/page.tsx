import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = products.filter((p) =>
    ["ne-hoodie-black", "ne-hoodie-pink", "ne-hoodie-small-logo"].includes(p.id)
  );

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
        style={{ background: "#000" }}
      >
        {/* Background grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(224,64,251,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(224,64,251,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(224,64,251,0.07) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo SVG */}
        <div className="relative mb-8 fade-up" style={{ animationDelay: "0.1s" }}>
          <svg
            viewBox="0 0 500 220"
            width="240"
            height="105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80 150 C55 105, 75 60, 120 72 C95 48, 130 25, 165 52 C188 30, 235 36, 245 70 C295 45, 360 52, 390 82 C420 100, 435 130, 408 142 C372 158, 315 130, 290 118 C268 140, 244 162, 220 140 C196 162, 170 172, 148 150 C125 170, 95 185, 80 150 Z"
              fill="#E040FB"
              opacity="0.95"
            />
            <path
              d="M408 82 C432 70, 462 75, 468 98 C445 92, 418 104, 408 106 Z"
              fill="#E040FB"
            />
            <path
              d="M80 150 C60 168, 38 180, 26 168 C44 160, 70 155, 80 150 Z"
              fill="#E040FB"
            />
          </svg>
        </div>

        <h1
          className="relative font-black tracking-wider leading-none fade-up"
          style={{
            fontSize: "clamp(40px, 9vw, 100px)",
            letterSpacing: "0.12em",
            animationDelay: "0.2s",
          }}
        >
          <span style={{ color: "#fff" }}>NEVER</span>
          <br />
          <span style={{ color: "#E040FB" }}>ENDING</span>
        </h1>

        <p
          className="mt-6 font-light tracking-widest fade-up"
          style={{
            color: "#444",
            fontSize: "11px",
            letterSpacing: "0.45em",
            animationDelay: "0.4s",
          }}
        >
          終わらない夢をストリートに
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-10 py-4 text-xs font-black tracking-widest transition-all duration-200 hover:brightness-110"
            style={{
              background: "#E040FB",
              color: "#000",
              letterSpacing: "0.2em",
            }}
          >
            SHOP NOW
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-10 py-4 text-xs font-bold tracking-widest border transition-all duration-200 hover:border-white hover:text-white"
            style={{
              borderColor: "#2a2a2a",
              color: "#555",
              letterSpacing: "0.2em",
            }}
          >
            OUR STORY
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "#2a2a2a" }}
        >
          <span className="text-xs tracking-widest" style={{ letterSpacing: "0.4em", fontSize: "9px" }}>
            SCROLL
          </span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #2a2a2a, transparent)" }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div
        className="overflow-hidden py-3"
        style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111", background: "#000" }}
      >
        <div className="marquee-track flex gap-0 whitespace-nowrap">
          {Array(10).fill(null).map((_, i) => (
            <span
              key={i}
              className="text-xs font-black tracking-widest inline-flex items-center"
              style={{ color: "#1e1e1e", letterSpacing: "0.3em" }}
            >
              <span className="px-8">NEVER ENDING</span>
              <span style={{ color: "#E040FB" }}>✦</span>
              <span className="px-8">終わらない夢</span>
              <span style={{ color: "#E040FB" }}>✦</span>
              <span className="px-8">STREET APPAREL</span>
              <span style={{ color: "#E040FB" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-xs font-black tracking-widest mb-2"
              style={{ color: "#E040FB", letterSpacing: "0.35em" }}
            >
              FEATURED
            </p>
            <h2
              className="text-3xl md:text-4xl font-black"
              style={{ letterSpacing: "0.05em" }}
            >
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold tracking-widest border-b pb-0.5"
            style={{ color: "#444", borderColor: "#2a2a2a", letterSpacing: "0.2em" }}
          >
            VIEW ALL →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "#1c1c1c" }}>
          {featured.map((p) => (
            <div key={p.id} style={{ background: "#000" }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND STATEMENT ── */}
      <section
        className="relative py-36 px-6 text-center overflow-hidden"
        style={{ background: "#050505", borderTop: "1px solid #111" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(224,64,251,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <p
            className="text-xs font-black tracking-widest mb-10"
            style={{ color: "#333", letterSpacing: "0.5em" }}
          >
            — OUR ETHOS —
          </p>
          <blockquote
            className="font-black leading-tight"
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "0.05em",
              color: "#fff",
            }}
          >
            "終わらない夢"
          </blockquote>
          <p
            className="mt-4 font-black tracking-widest"
            style={{
              fontSize: "clamp(13px, 2vw, 20px)",
              color: "#2a2a2a",
              letterSpacing: "0.25em",
            }}
          >
            THE DREAM THAT NEVER ENDS
          </p>
          <p
            className="mt-10 text-sm max-w-xl mx-auto"
            style={{ color: "#444", lineHeight: "2.2" }}
          >
            私たちは「終わらない夢」をストリートという世界観に落とし込んだブランドです。
            <br />
            夢を持ち続けること、諦めないこと。
            <br />
            そのエネルギーをすべてのピースに込めています。
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center mt-10 px-8 py-3.5 text-xs font-black tracking-widest border transition-all duration-200 hover:border-white hover:text-white"
            style={{ borderColor: "#222", color: "#555", letterSpacing: "0.2em" }}
          >
            READ MORE
          </Link>
        </div>
      </section>

      {/* ── INSTAGRAM TEASER ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: "#E040FB", letterSpacing: "0.35em" }}>
              INSTAGRAM
            </p>
            <h2 className="text-xl font-black tracking-wider" style={{ letterSpacing: "0.08em" }}>
              @_____never_ending_____
            </h2>
          </div>
          <a
            href="https://www.instagram.com/_____never_ending_____/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold tracking-widest"
            style={{ color: "#444", letterSpacing: "0.2em" }}
          >
            FOLLOW →
          </a>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-px" style={{ background: "#111" }}>
          {Array(6).fill(null).map((_, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center"
              style={{ background: i % 2 === 0 ? "#0a0a0a" : "#060606" }}
            >
              <span style={{ color: "#151515", fontSize: "20px" }}>✦</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs" style={{ color: "#333", letterSpacing: "0.2em" }}>
          FOLLOW US ON INSTAGRAM TO SEE THE LATEST
        </p>
      </section>
    </div>
  );
}
