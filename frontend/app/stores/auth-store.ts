"use client";

import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AuthState = {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: null,

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
    const data = await res.json();
    set({ token: data.access_token, email });
  },

  logout() {
    set({ token: null, email: null });
  },
}));
