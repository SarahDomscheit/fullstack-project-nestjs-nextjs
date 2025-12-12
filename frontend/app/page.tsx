"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="rounded border bg-white px-3 py-2">
            <div className="font-medium">{p.name}</div>
            {p.description && (
              <div className="text-sm text-slate-600">{p.description}</div>
            )}
            <div className="text-sm font-semibold">
              {Number(p.price).toFixed(2)} €
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
