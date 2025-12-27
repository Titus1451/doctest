"use client";

import { cn } from "@/lib";

export function Header({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </header>
  );
}
