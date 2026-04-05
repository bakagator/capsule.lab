"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative flex items-center" aria-label="Cart">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {totalItems > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold"
          style={{ background: "#E040FB", color: "#000", fontSize: "9px" }}
        >
          {totalItems}
        </span>
      )}
    </Link>
  );
}
