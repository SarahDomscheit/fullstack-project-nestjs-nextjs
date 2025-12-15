"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await login(form.email, form.password);
      router.push("/products");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 rounded border p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-xs text-red-800">
            {error}
          </p>
        )}

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
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border px-3 py-2 text-sm"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </main>
  );
}
