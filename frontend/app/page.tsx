"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "./stores/auth-store";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const { currentUser, logout } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLatestProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`);
      }
      const data: Product[] = await res.json();
      const latest = data.slice(-5).reverse();
      setProducts(latest);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatestProducts();
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minimal Shop</h1>
          <p className="text-sm text-slate-600">
            A small demo-shop with Nestjs &amp; Next.js.
          </p>
          {currentUser && (
            <p className="mt-2 text-sm text-slate-700">
              Welcome back, {currentUser.name ?? currentUser.email}!
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!currentUser && (
            <>
              <Link
                href="/login"
                className="rounded border border-slate-300 px-3 py-2 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
              >
                Register
              </Link>
            </>
          )}

          {currentUser && (
            <button
              onClick={logout}
              className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest Products</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-slate-900 underline"
          >
            View all products
          </Link>
        </div>

        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {loading && products.length === 0 ? (
          <p>Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-500">No products available.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {products.map((p) => (
              <li key={p.id} className="rounded border p-4 shadow-sm">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-600">
                  {p.description || "Keine Beschreibung"}
                </p>
                <p className="mt-2 text-sm font-medium">{p.price} €</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        {!currentUser && (
          <>
            <h2 className="text-lg font-semibold">Get Started</h2>
            <p className="text-sm text-slate-600">
              Please log in or register to create and manage your own products.
            </p>
          </>
        )}

        <div className="flex gap-3">
          <Link
            href="/products"
            className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            Go to Products
          </Link>
        </div>
      </section>
    </main>
  );
}
