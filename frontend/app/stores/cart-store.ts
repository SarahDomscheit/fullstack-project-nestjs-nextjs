"use client";
import { create } from "zustand";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  getTotal: () => number;
  clear: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    })),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  clear: () => set({ items: [] }),
}));
