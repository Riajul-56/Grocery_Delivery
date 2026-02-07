import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";

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
      <body className="w-full min-h-[200vh] bg-linear-to-b from-green-50 to-white">
        <Provider>
          <StoreProvider>{children}</StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
