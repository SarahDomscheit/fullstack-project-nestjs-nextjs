"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  currentUser: CurrentUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      currentUser: null,

      async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          throw new Error("Login failed");
        }
        const data = await res.json();
        set({
          token: data.access_token,
          currentUser: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        });
      },

      logout() {
        set({ token: null, currentUser: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
