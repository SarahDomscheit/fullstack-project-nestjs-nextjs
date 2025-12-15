"use client";

import { create } from "zustand";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type Customer = {
  id: string;
  name: string;
  email: string;
  orderIds: number[];
};

type CustomersState = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (input: { name: string; email: string }) => Promise<void>;
};

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_URL}/customers`);
      if (!res.ok) {
        throw new Error(`Failed to load customers (${res.status})`);
      }
      const data: Customer[] = await res.json();
      set({ customers: data });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: async ({ name, email }) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create customer (${res.status})`);
      }
      const created: Customer = await res.json();
      const { customers } = get();
      set({ customers: [...customers, created] });
    } catch (err: any) {
      set({ error: err.message ?? "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },
}));
