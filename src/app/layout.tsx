import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/provider";

export const metadata: Metadata = {
  title: "Grocery Delivery App",
  description:
    "Grocery Delivery App built with Next.js, MongoDB, and NextAuth.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
