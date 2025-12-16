"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth-store";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { currentUser, token, logout } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setForm({
        name: currentUser.name,
        email: currentUser.email,
        password: "",
      });
    }
  }, [currentUser, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const updateData: any = {
        name: form.name,
        email: form.email,
      };

      if (form.password) {
        updateData.password = form.password;
      }

      const res = await fetch(`${API_URL}/customers/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }

      const updatedCustomer = await res.json();

      // Update the currentUser in the store
      useAuthStore.setState({
        currentUser: {
          id: updatedCustomer.id,
          name: updatedCustomer.name,
          email: updatedCustomer.email,
        },
      });

      setSuccess(true);
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err: any) {
      setError(err.message ?? "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <button
          onClick={logout}
          className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded border p-6 shadow-sm"
      >
        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-800">
            Profile updated successfully!
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

        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="password">
            New Password (optional)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border px-3 py-2 text-sm"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave empty to keep current password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {loading ? "Saving…" : "Update Profile"}
        </button>
      </form>
    </main>
  );
}
