"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { 
  LayoutDashboard, 
  BookOpen, 
  Scale, 
  Settings, 
  FileText 
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/decisions", label: "Decisions", icon: BookOpen },
    { href: "/audits", label: "Audit Explanations", icon: Scale },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white text-slate-800">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <FileText className="h-6 w-6 text-indigo-600" />
          <span>TaxDocs</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 px-3">
          <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          <div>
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-slate-500">Viewer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
