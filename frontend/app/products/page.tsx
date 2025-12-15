"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
      }),
    });
    setForm({ name: "", description: "", price: "" });
    await loadProducts();
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Products</h1>
        <div className="rounded-md bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="border-b px-3 py-2 text-left">Name</th>
                <th className="border-b px-3 py-2 text-left">Description</th>
                <th className="border-b px-3 py-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="border-b px-3 py-2">{p.name}</td>
                  <td className="border-b px-3 py-2 text-slate-600">
                    {p.description}
                  </td>
                  <td className="border-b px-3 py-2 text-right">
                    {Number(p.price).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-md bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">Add Product</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Name
            </label>
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Description
            </label>
            <textarea
              className="h-20 w-full rounded border px-2 py-1 text-sm"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Price
            </label>
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
