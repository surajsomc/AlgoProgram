import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AlgoPrep - DSA Interview Prep",
  description: "Master data structures and algorithms for coding interviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <main className="pt-14 lg:pt-0 lg:ml-64 min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  );
}
