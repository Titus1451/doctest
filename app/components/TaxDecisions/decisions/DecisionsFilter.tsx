"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/app/components/TaxDecisions/ui/select";
import { Button } from "@/app/components/TaxDecisions/ui/button";

import { JURISDICTIONS } from "@/lib/TaxDecisions/constants";

export function DecisionsFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentJurisdiction = searchParams.get("jurisdiction") || "ALL";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentTaxType = searchParams.get("taxType") || "ALL";

  const taxTypes = ["Sales Tax", "Meals Tax", "Alcohol Tax"];
 
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative w-full lg:w-[350px]">
          <input 
            type="text"
            placeholder="Search title, tax type, evidence..." 
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-green/20 focus-visible:border-custom-green pl-10"
            defaultValue={searchParams.get("query")?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
      </div>

      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <div className="w-[110px]">
          <Select value={currentStatus} onValueChange={(v) => updateParams("status", v)}>
            <SelectTrigger className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="FINAL">Final</SelectItem>
              <SelectItem value="DEPRECATED">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tax Type Filter */}
        <div className="w-[140px]">
          <Select value={currentTaxType} onValueChange={(v) => updateParams("taxType", v)}>
            <SelectTrigger className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-700">
              <SelectValue placeholder="Tax Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {taxTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jurisdiction Filter */}
        <div className="w-[160px]">
          <Select value={currentJurisdiction} onValueChange={(v) => updateParams("jurisdiction", v)}>
            <SelectTrigger className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-700">
              <SelectValue placeholder="Jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Global</SelectItem>
              {JURISDICTIONS.map((j) => (
                <SelectItem key={j.code} value={j.code}>
                  {j.code} - {j.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(currentJurisdiction !== "ALL" || currentStatus !== "ALL" || currentTaxType !== "ALL" || searchParams.get("query")) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors h-10"
            onClick={() => router.replace(pathname)}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
