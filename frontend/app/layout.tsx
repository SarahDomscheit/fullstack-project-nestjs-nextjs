import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Minimal Shop",
  description: "Nest + Next Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        <header className="bg-white shadow-sm">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <span className="text-lg font-bold">Minimal Shop</span>
            <div className="flex gap-4 text-sm">
              <Link href="/">Products</Link>
              <Link href="/customers">Customers</Link>
              <Link href="/login">Login</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
