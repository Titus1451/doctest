"use client";

import { cn } from "@/lib";

export function Header({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <header className="flex h-20 items-center justify-between border-b-2 border-slate-100 bg-white px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-custom-green" />
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-humanist uppercase">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
      </div>
    </header>
  );
}
