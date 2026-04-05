export default function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid #1c1c1c" }}
      className="mt-24 py-12 px-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <p
            className="font-black tracking-widest text-sm mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            <span style={{ color: "#E040FB" }}>NEVER</span>
            <span style={{ color: "#666" }}>_</span>
            <span style={{ color: "#E040FB" }}>ENDING</span>
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#555" }}>
            終わらない夢をストリートという<br />
            世界観に落とし込んだブランド。
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "#444" }}>
            NAVIGATE
          </p>
          <ul className="space-y-2">
            {[
              { href: "/products", label: "SHOP" },
              { href: "/about", label: "ABOUT" },
              { href: "/cart", label: "CART" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-xs tracking-widest transition-colors duration-200 hover:text-white"
                  style={{ color: "#555" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "#444" }}>
            FOLLOW
          </p>
          <a
            href="https://www.instagram.com/_____never_ending_____/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest transition-colors duration-200 hover:text-white"
            style={{ color: "#555" }}
          >
            @_____never_ending_____
          </a>
          <p className="text-xs mt-6" style={{ color: "#333" }}>
            © {new Date().getFullYear()} NEVER ENDING. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
