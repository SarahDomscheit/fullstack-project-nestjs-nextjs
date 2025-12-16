"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../stores/cart-store";
import { useAuthStore } from "../stores/auth-store";
import { apiFetch } from "../lib/api";

export default function CheckoutPage() {
  const { currentUser } = useAuthStore();
  const cart = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          productIds: cart.items.map((i) => i.productId),
          totalPrice: cart.getTotal(),
          customerId: currentUser.id,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      cart.clear();
      router.push("/orders");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <p>Your cart is empty.</p>
        <a href="/products" className="text-blue-500 underline">
          Continue shopping
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="space-y-2">
        {cart.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{(item.price * item.quantity).toFixed(2)} €</span>
          </div>
        ))}
        <div className="border-t pt-2 font-semibold">
          Total: {cart.getTotal().toFixed(2)} €
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded bg-slate-900 px-4 py-2 text-white font-medium disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </main>
  );
}
