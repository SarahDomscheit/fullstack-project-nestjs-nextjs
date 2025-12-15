"use client";

import { useAuthStore } from "../stores/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(input: string, init: RequestInit = {}) {
  const token = useAuthStore.getState().token;

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${input}`, {
    ...init,
    headers,
  });

  return res;
}
