"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";
import { useAuthStore } from "../stores/auth-store";

type Props = {
  productId: string;
  ownerId?: string | null;
  onDeleted?: () => void;
};

export function DeleteProductButton({ productId, ownerId, onDeleted }: Props) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser || (ownerId && ownerId !== currentUser.id)) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await apiFetch(`/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete product (${res.status})`);
      }

      if (onDeleted) onDeleted();
    } catch (err: any) {
      setError(err.message ?? "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:opacity-60"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-[10px] text-red-700">{error}</span>}
    </div>
  );
}
