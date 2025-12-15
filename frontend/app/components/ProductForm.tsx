"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  onCreated?: () => void; // optional: Liste neu laden
};

export function CreateProductForm({ onCreated }: Props) {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price), // wichtig für DTO
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Failed to create product");
        return;
      }

      setForm({ name: "", description: "", price: "" });
      onCreated?.();
    } catch (err) {
      setError("Network error while creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-md bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Add Product</h2>

      {error && (
        <p className="mb-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700">
          {Array.isArray(error) ? error.join(", ") : error}
        </p>
      )}

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
          disabled={loading}
          className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving…" : "Save product"}
        </button>
      </form>
    </section>
  );
}
