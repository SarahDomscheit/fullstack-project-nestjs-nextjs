import Header from "./components/Header";
import "./globals.css";

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
          <Header />
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
