import "./globals.css";
import type { Metadata } from "next";
import clsx from "clsx";

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
        className={clsx(
          "min-h-screen bg-[var(--background)] text-slate-900 antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
