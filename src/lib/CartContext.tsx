"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === newItem.productId &&
          i.color === newItem.color &&
          i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId &&
          i.color === newItem.color &&
          i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, color: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.productId === productId && i.color === color && i.size === size)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    color: string,
    size: string,
    qty: number
  ) => {
    if (qty <= 0) return removeItem(productId, color, size);
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.color === color && i.size === size
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
