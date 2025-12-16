"use client";

import Link from "next/link";
import { useAuthStore } from "../stores/auth-store";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <Link href="/">
        <span className="text-lg font-bold">Minimal Shop</span>
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/products">Products</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/customers">Edit Profile</Link>
        <Link href="/checkout">Checkout</Link>

        {currentUser ? (
          <>
            <span className="text-slate-600">{currentUser.name}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-slate-900 px-3 py-1 text-xs font-medium text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded bg-slate-900 px-3 py-1 text-xs font-medium text-white"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
export default NavBar;
