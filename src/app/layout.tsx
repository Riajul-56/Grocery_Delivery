import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glocery Delivery App",
  description: "Grocery Delivery App built with Next.js, MongoDB, and NextAuth.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-200 to-white">
        {children}
      </body>
    </html>
  );
}
