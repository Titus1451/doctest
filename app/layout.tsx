import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tax Knowledge Store",
  description:
    "Internal document store for tax decisions, audit explanations, and supporting evidence."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-slate-50 text-slate-900 antialiased",
          inter.className
        )}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
