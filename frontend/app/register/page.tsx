"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setSuccess(false);

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Registrierung fehlgeschlagen (${res.status})`);
      }

      setSuccess(true);
      // optional: gleich zur Login-Seite
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: any) {
      setError(err.message ?? "Registrierung fehlgeschlagen");
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
        <h1 className="text-xl font-semibold">Registrieren</h1>

        {error && (
          <p className="rounded bg-red-100 px-3 py-2 text-xs text-red-800">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded bg-green-100 px-3 py-2 text-xs text-green-800">
            Registrierung erfolgreich, du wirst weitergeleitet…
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
            Passwort
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

        <div className="space-y-1">
          <label
            className="block text-sm font-medium"
            htmlFor="passwordConfirm"
          >
            Passwort bestätigen
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            className="w-full rounded border px-3 py-2 text-sm"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {loading ? "Registriere…" : "Account erstellen"}
        </button>

        <p className="text-xs text-slate-600">
          Du hast schon einen Account?{" "}
          <a href="/login" className="text-slate-900 underline">
            Zum Login
          </a>
        </p>
      </form>
    </main>
  );
}
