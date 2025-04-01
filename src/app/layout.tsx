import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AutofillCard } from "@/components/autofillCard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Wanderly.ai",
  description: "Your AI-powered travel companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-white dark:bg-[#1e1e1e] text-black dark:text-white font-inter">
        <main className="pb-20">{children}</main>

        {/* Bottom Navbar */}
        <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="flex justify-around items-center h-16 relative px-4">
            <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Explore
            </Link>

            {/* Floating + Button */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <AutofillCard/>
            </div>

            <Link href="/saved" className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Saved
            </Link>
            <Link href="/profile" className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Profile
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}

