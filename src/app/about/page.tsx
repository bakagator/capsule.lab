import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-40 px-6 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ background: "#000" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(224,64,251,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(224,64,251,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(224,64,251,0.06) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="relative">
          <p
            className="text-xs font-black tracking-widest mb-6"
            style={{ color: "#E040FB", letterSpacing: "0.5em" }}
          >
            — ABOUT US —
          </p>
          <h1
            className="font-black leading-none"
            style={{
              fontSize: "clamp(48px, 10vw, 120px)",
              letterSpacing: "0.1em",
              color: "#fff",
            }}
          >
            NEVER
            <br />
            <span style={{ color: "#E040FB" }}>ENDING</span>
          </h1>
          <p
            className="mt-6 text-sm"
            style={{ color: "#444", letterSpacing: "0.2em" }}
          >
            終わらない夢をストリートに
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="space-y-20">

          {/* Brand Story */}
          <div>
            <p
              className="text-xs font-black tracking-widest mb-6"
              style={{ color: "#E040FB", letterSpacing: "0.4em" }}
            >
              01 / STORY
            </p>
            <h2
              className="text-2xl font-black mb-8"
              style={{ letterSpacing: "0.05em" }}
            >
              終わらない夢
            </h2>
            <div className="space-y-5 text-sm" style={{ color: "#555", lineHeight: "2.2" }}>
              <p>
                NEVER ENDINGは、「終わらない夢」をストリートという世界観に落とし込んだアパレルブランドです。
              </p>
              <p>
                夢を諦めない人たちへ。道を信じ続ける人たちへ。
                ストリートは単なるスタイルではなく、生き様そのものです。
              </p>
              <p style={{ color: "#444" }}>
                We are a street apparel brand built on one idea: the dream never ends.
                Every piece we make carries that energy — the refusal to quit, the drive to keep going,
                the belief that what you're chasing is worth chasing forever.
              </p>
            </div>
          </div>

          <div style={{ height: "1px", background: "#111" }} />

          {/* Logo story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-black tracking-widest mb-6"
                style={{ color: "#E040FB", letterSpacing: "0.4em" }}
              >
                02 / THE MARK
              </p>
              <h2
                className="text-2xl font-black mb-6"
                style={{ letterSpacing: "0.05em" }}
              >
                バードロゴ
              </h2>
              <div className="space-y-4 text-sm" style={{ color: "#555", lineHeight: "2.2" }}>
                <p>
                  ロゴに込めたのは「飛び続ける鳥」のイメージ。
                  止まることを知らず、空を駆け続ける姿が私たちの精神と重なります。
                </p>
                <p style={{ color: "#444" }}>
                  The swallow — swift, relentless, never settling.
                  Our bird mark embodies the spirit of endless pursuit.
                </p>
              </div>
            </div>
            <div
              className="flex items-center justify-center aspect-square"
              style={{ background: "#050505", border: "1px solid #111" }}
            >
              <svg
                viewBox="0 0 500 220"
                width="220"
                height="98"
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
          </div>

          <div style={{ height: "1px", background: "#111" }} />

          {/* Values */}
          <div>
            <p
              className="text-xs font-black tracking-widest mb-10"
              style={{ color: "#E040FB", letterSpacing: "0.4em" }}
            >
              03 / VALUES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "#111" }}>
              {[
                {
                  en: "DREAM",
                  ja: "夢",
                  desc: "夢を持ち続けること。それが全ての出発点。",
                },
                {
                  en: "STREET",
                  ja: "ストリート",
                  desc: "ストリートは文化。フィールドは全ての道。",
                },
                {
                  en: "NEVER STOP",
                  ja: "諦めない",
                  desc: "止まらない。終わらない。それが私たちの誓い。",
                },
              ].map((v) => (
                <div key={v.en} className="p-8" style={{ background: "#000" }}>
                  <p
                    className="text-xl font-black mb-1"
                    style={{ color: "#E040FB", letterSpacing: "0.05em" }}
                  >
                    {v.en}
                  </p>
                  <p className="text-xs mb-4" style={{ color: "#333" }}>
                    {v.ja}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#444", lineHeight: "2" }}>
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-32 px-6 text-center"
        style={{ background: "#050505", borderTop: "1px solid #111" }}
      >
        <p
          className="text-xs font-black tracking-widest mb-8"
          style={{ color: "#E040FB", letterSpacing: "0.5em" }}
        >
          JOIN THE DREAM
        </p>
        <h2
          className="text-3xl md:text-5xl font-black mb-10"
          style={{ letterSpacing: "0.05em" }}
        >
          終わらない夢を、着る。
        </h2>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-12 py-5 text-xs font-black tracking-widest transition-all duration-200 hover:brightness-110"
          style={{
            background: "#E040FB",
            color: "#000",
            letterSpacing: "0.25em",
          }}
        >
          SHOP NOW
        </Link>
      </section>
    </div>
  );
}
