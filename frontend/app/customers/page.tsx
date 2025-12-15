"use client";

import { useEffect, useState } from "react";
import { Customer } from "../types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/customers`);
      if (!res.ok) {
        throw new Error(`Failed to load customers (${res.status})`);
      }
      const data: Customer[] = await res.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Customers</h1>

      {error && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div>
          <h2 className="mb-2 text-lg font-medium">Customer list</h2>
          {loading ? (
            <p>Loading…</p>
          ) : customers.length === 0 ? (
            <p className="text-sm text-slate-500">No customers yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">ID</th>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Orders</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="py-1 pr-2">{c.id}</td>
                    <td className="py-1 pr-2">{c.name}</td>
                    <td className="py-1 pr-2">{c.email}</td>
                    <td className="py-1 pr-2">
                      {c.orderIds && c.orderIds.length > 0
                        ? c.orderIds.join(", ")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <CreateCustomerForm onCreated={loadCustomers} />
      </section>
    </main>
  );
}

type FormProps = {
  onCreated?: () => void;
};

function CreateCustomerForm({ onCreated }: FormProps) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create customer (${res.status})`);
      }
      setForm({ name: "", email: "" });
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded border p-4 shadow-sm"
    >
      <h2 className="text-lg font-medium">Add customer</h2>

      {error && (
        <p className="rounded bg-red-100 px-3 py-2 text-xs text-red-800">
          {error}
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
        <label className="block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded border px-3 py-2 text-sm"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
      >
        {submitting ? "Saving…" : "Create customer"}
      </button>
    </form>
  );
}
