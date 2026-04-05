"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartIcon from "./CartIcon";

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/products", label: "SHOP" },
    { href: "/about", label: "ABOUT" },
  ];

  return (
    <>
      <nav
        style={{ borderBottom: "1px solid #1c1c1c" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Backdrop blur */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 font-black tracking-widest text-sm"
          style={{ letterSpacing: "0.3em" }}
        >
          <span style={{ color: "#fff" }}>_____</span>
          <span style={{ color: "#E040FB" }}>NEVER</span>
          <span style={{ color: "#fff" }}>_</span>
          <span style={{ color: "#E040FB" }}>ENDING</span>
          <span style={{ color: "#fff" }}>_____</span>
        </Link>

        {/* Desktop links */}
        <div className="relative z-10 hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs tracking-widest transition-colors duration-200"
              style={{
                color: pathname === l.href ? "#E040FB" : "#888",
                fontWeight: 600,
              }}
            >
              {l.label}
            </Link>
          ))}
          <CartIcon />
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="relative z-10 flex md:hidden items-center gap-4">
          <CartIcon />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: "#fff",
                transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "",
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: "#fff",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: "#fff",
                transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 transition-all duration-300 md:hidden"
        style={{
          background: "#000",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-black tracking-widest"
            style={{ color: "#E040FB" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
