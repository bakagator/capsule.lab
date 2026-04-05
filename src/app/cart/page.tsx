"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p
          className="text-xs font-black tracking-widest mb-6"
          style={{ color: "#333", letterSpacing: "0.4em" }}
        >
          YOUR CART
        </p>
        <p className="text-sm mb-2" style={{ color: "#444" }}>
          カートは空です
        </p>
        <p className="text-xs mb-10" style={{ color: "#333" }}>
          Your cart is empty.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-10 py-4 text-xs font-black tracking-widest transition-all duration-200"
          style={{
            background: "#E040FB",
            color: "#000",
            letterSpacing: "0.2em",
          }}
        >
          SHOP NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p
        className="text-xs font-black tracking-widest mb-2"
        style={{ color: "#E040FB", letterSpacing: "0.4em" }}
      >
        CART
      </p>
      <h1
        className="text-4xl font-black mb-12"
        style={{ letterSpacing: "0.05em" }}
      >
        YOUR CART
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-1" style={{ background: "#1c1c1c" }}>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex gap-4 p-5"
              style={{ background: "#000" }}
            >
              {/* Product image placeholder */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "#0a0a0a",
                  border: "1px solid #1c1c1c",
                }}
              >
                <span
                  className="text-xs font-black"
                  style={{ color: "#E040FB" }}
                >
                  NE
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm tracking-wide" style={{ letterSpacing: "0.05em" }}>
                  {item.name}
                </p>
                <p className="text-xs mt-1" style={{ color: "#555" }}>
                  {item.color} / {item.size}
                </p>
                <p className="text-xs mt-1 font-black" style={{ color: "#E040FB" }}>
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  {/* Qty */}
                  <div className="flex items-center border" style={{ borderColor: "#1c1c1c" }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-sm transition-colors hover:bg-white hover:text-black"
                      style={{ color: "#555" }}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-sm transition-colors hover:bg-white hover:text-black"
                      style={{ color: "#555" }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    className="text-xs tracking-widest transition-colors hover:text-white"
                    style={{ color: "#333", letterSpacing: "0.1em" }}
                  >
                    REMOVE
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right flex-shrink-0">
                <p className="font-black text-sm" style={{ color: "#fff" }}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div
            className="p-6 sticky top-24"
            style={{ background: "#0a0a0a", border: "1px solid #1c1c1c" }}
          >
            <p
              className="text-xs font-black tracking-widest mb-6"
              style={{ color: "#444", letterSpacing: "0.3em" }}
            >
              ORDER SUMMARY
            </p>

            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: "#555" }}>Subtotal / 小計</span>
              <span className="font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm mb-6">
              <span style={{ color: "#555" }}>Shipping / 送料</span>
              <span className="font-bold" style={{ color: "#E040FB" }}>
                FREE
              </span>
            </div>

            <div
              className="flex justify-between font-black text-lg mb-8 pt-6"
              style={{ borderTop: "1px solid #1c1c1c" }}
            >
              <span>TOTAL</span>
              <span style={{ color: "#E040FB" }}>{formatPrice(totalPrice)}</span>
            </div>

            <button
              className="w-full py-4 text-xs font-black tracking-widest transition-all duration-200 hover:brightness-110"
              style={{
                background: "#E040FB",
                color: "#000",
                letterSpacing: "0.2em",
              }}
            >
              CHECKOUT / 購入へ進む
            </button>

            <Link
              href="/products"
              className="block text-center mt-4 text-xs tracking-widest transition-colors hover:text-white"
              style={{ color: "#333", letterSpacing: "0.15em" }}
            >
              ← CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
