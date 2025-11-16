import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "./providers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nawy Apartments",
  description: "Apartments listing task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
              <Link href="/" className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                Nawy Apartments
              </Link>
              <nav className="flex gap-4 text-sm">
                <Link href="/" className="hover:underline text-gray-700 hover:text-blue-600">
                  Listings
                </Link>
                <Link href="/add" className="hover:underline text-gray-700 hover:text-blue-600">
                  Add Apartment
                </Link>
              </nav>
            </header>
            {/* Main Content */}
            <main className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
