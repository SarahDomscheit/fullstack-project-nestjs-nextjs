"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuthStore } from "../../stores/auth-store";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  ownerId?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, logout } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiFetch(`/products/${id}`);
        if (!res.ok) {
          if (res.status === 401) {
            logout();
            router.push("/login");
            return;
          }
          const text = await res.text();
          throw new Error(text || `Failed to load product (${res.status})`);
        }

        const data: Product = await res.json();

        // Optional: prüfen, ob der aktuelle User Owner ist
        if (data.ownerId && data.ownerId !== currentUser.id) {
          setError("Du darfst dieses Produkt nicht bearbeiten.");
          return;
        }

        setForm({
          name: data.name,
          description: data.description ?? "",
          price: String(data.price),
        });
      } catch (err: any) {
        setError(err.message ?? "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, currentUser, logout, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const res = await apiFetch(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update failed (${res.status})`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 800);
    } catch (err: any) {
      setError(err.message ?? "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Produkt bearbeiten</h1>

      {loading ? (
        <p>Loading…</p>
      ) : error && !success ? (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded border p-4 shadow-sm"
        >
          {error && success && (
            <p className="rounded bg-red-100 px-3 py-2 text-xs text-red-800">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded bg-green-100 px-3 py-2 text-xs text-green-800">
              Produkt aktualisiert.
            </p>
          )}

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
            <label className="block text-sm font-medium" htmlFor="description">
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
            disabled={saving}
            className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
          >
            {saving ? "Speichere…" : "Speichern"}
          </button>
        </form>
      )}
    </main>
  );
}
