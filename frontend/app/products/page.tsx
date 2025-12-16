"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth-store";
import { apiFetch } from "../lib/api";
import { DeleteProductButton } from "../components/DeleteProductButton";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  ownerId?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ProductsPage() {
  const { currentUser, logout } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/products`); // public GET
      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`);
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    console.log("products", products);
    console.log("currentUser", currentUser);
  }, [products, currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Bitte zuerst einloggen.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const res = await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create product (${res.status})`);
      }
      const created: Product = await res.json();

      setProducts((prev) => [...prev, created]);
      setForm({ name: "", description: "", price: "" });
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          {currentUser && (
            <p className="text-sm text-slate-600">
              Willkommen {currentUser.name}
            </p>
          )}
        </div>

        {currentUser && (
          <button
            onClick={logout}
            className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            Logout
          </button>
        )}
      </header>

      {error && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div>
          <h2 className="mb-2 text-lg font-medium">Product list</h2>
          {loading && products.length === 0 ? (
            <p>Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-slate-500">No products yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="py-1 pr-2">{p.name}</td>
                    <td className="py-1 pr-2">{p.description || "—"}</td>
                    <td className="py-1 pr-2">{p.price}</td>
                    <td className="py-1 pr-2 text-right">
                      {currentUser && p.ownerId === currentUser.id && (
                        <DeleteProductButton
                          productId={p.id}
                          onDeleted={loadProducts}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {currentUser ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded border p-4 shadow-sm"
          >
            <h2 className="text-lg font-medium">Add product</h2>

            <div className="space-y-1">
              <label className="block text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                className="w-full rounded border px-3 py-2 text-sm"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <label
                className="block text-sm font-medium"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="w-full rounded border px-3 py-2 text-sm"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="w-full rounded border px-3 py-2 text-sm"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
            >
              {loading ? "Saving…" : "Create product"}
            </button>
          </form>
        ) : (
          <div className="rounded border p-4 text-sm text-slate-600">
            Bitte{" "}
            <a href="/login" className="text-slate-900 underline">
              einloggen
            </a>{" "}
            oder{" "}
            <a href="/register" className="text-slate-900 underline">
              registrieren
            </a>
            , um neue Produkte anzulegen.
          </div>
        )}
      </section>
    </main>
  );
}
