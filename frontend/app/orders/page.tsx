"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  productIds: string[];
  totalPrice: number;
  customerId: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    productIds: [""],
    totalPrice: "",
    customerId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/orders`);
      if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductIdChange = (index: number, value: string) => {
    const newProductIds = [...form.productIds];
    newProductIds[index] = value;
    setForm((prev) => ({ ...prev, productIds: newProductIds }));
  };

  const addProductId = () => {
    setForm((prev) => ({
      ...prev,
      productIds: [...prev.productIds, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const body = {
        productIds: form.productIds.filter(Boolean),
        totalPrice: Number(form.totalPrice),
        customerId: form.customerId,
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `${API_URL}/orders/${editingId}`
        : `${API_URL}/orders`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed (${res.status})`);
      }

      setForm({ productIds: [""], totalPrice: "", customerId: "" });
      setEditingId(null);
      loadOrders();
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    }
  };

  const handleEdit = (order: Order) => {
    setForm({
      productIds: order.productIds,
      totalPrice: String(order.totalPrice),
      customerId: order.customerId,
    });
    setEditingId(order.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      loadOrders();
    } catch (err: any) {
      setError(err.message ?? "Delete failed");
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link
          href="/products"
          className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        >
          Products
        </Link>
      </header>

      {error && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div>
          <h2 className="mb-2 text-lg font-medium">Orders List</h2>
          {loading && orders.length === 0 ? (
            <p>Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between rounded border p-3 text-sm"
                >
                  <div>
                    <span className="font-medium">
                      {order.productIds.slice(0, 2).join(", ")}
                      {order.productIds.length > 2 && (
                        <span>… +{order.productIds.length - 2}</span>
                      )}
                    </span>
                    <div className="text-xs text-slate-500">
                      Customer: {order.customerId.slice(0, 8)}… |{" "}
                      {order.totalPrice} €
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded border p-4">
          <h2 className="text-lg font-medium">
            {editingId ? "Edit Order" : "Create Order"}
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product IDs
            </label>
            {form.productIds.map((id, index) => (
              <div key={index} className="flex gap-2 mb-1">
                <input
                  name={`productId-${index}`}
                  className="flex-1 rounded border px-2 py-1 text-sm"
                  value={id}
                  onChange={(e) => handleProductIdChange(index, e.target.value)}
                  placeholder="product-id"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newIds = form.productIds.filter(
                        (_, i) => i !== index
                      );
                      setForm((prev) => ({ ...prev, productIds: newIds }));
                    }}
                    className="rounded bg-gray-200 px-2 py-1 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addProductId}
              className="text-xs text-blue-600 underline"
            >
              + Add Product ID
            </button>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="totalPrice">
              Total Price
            </label>
            <input
              id="totalPrice"
              name="totalPrice"
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded border px-3 py-2 text-sm"
              value={form.totalPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="customerId">
              Customer ID
            </label>
            <input
              id="customerId"
              name="customerId"
              className="w-full rounded border px-3 py-2 text-sm"
              value={form.customerId}
              onChange={handleChange}
              placeholder="customer-uuid"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            {editingId ? "Update Order" : "Create Order"}
          </button>
        </form>
      </section>
    </main>
  );
}
