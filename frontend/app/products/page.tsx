"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
};

const API_URL = "http://localhost:3001/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const loadProducts = async () => {
    const res = await fetch(API_URL);
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
    await fetch(API_URL, {
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
    <main style={{ padding: 24 }}>
      <h1>Products</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
        </div>

        <div>
          <label>
            Price
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button type="submit">Add product</button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> – {p.description} – {p.price} €
          </li>
        ))}
      </ul>
    </main>
  );
}
