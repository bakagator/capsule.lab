import Link from "next/link";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(249, 245, 240, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span style={{ fontSize: "18px" }}>🏠</span>
        <span
          className="font-bold tracking-wide"
          style={{ fontSize: "17px", color: "var(--text)" }}
        >
          まつだ家
        </span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-full px-3 py-1"
          style={{ color: "var(--text-muted)" }}
        >
          つぶやき
        </Link>
        <Link
          href="/papa"
          className="rounded-full px-3 py-1 font-bold"
          style={{ background: "var(--husband-bg)", color: "var(--husband)" }}
        >
          👨‍🍼 パパクエスト
        </Link>
      </nav>
    </header>
  );
}
