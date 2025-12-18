import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House of Edtech - CRUD App",
  description: "A CRUD application for managing courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

