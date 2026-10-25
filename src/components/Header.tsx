export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-4"
      style={{
        background: "rgba(249, 245, 240, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "18px" }}>🏠</span>
        <span
          className="font-bold tracking-wide"
          style={{ fontSize: "17px", color: "var(--text)" }}
        >
          まつだ家
        </span>
      </div>
    </header>
  );
}
