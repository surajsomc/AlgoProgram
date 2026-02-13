import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

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
      <body className={`${inter.variable} font-sans`}>
        {/* Subtle top gradient */}
        <div className="fixed top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-accent/[0.02] via-transparent to-transparent pointer-events-none z-0" />
        <Sidebar />
        <main className="relative z-10 pt-14 lg:pt-0 lg:ml-72 min-h-screen p-5 sm:p-8 lg:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
