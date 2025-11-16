import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nawy Task",
  description: "Monorepo with Next.js and Node.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
