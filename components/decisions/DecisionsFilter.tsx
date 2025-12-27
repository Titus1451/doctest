"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function DecisionsFilter({ jurisdictions }: { jurisdictions: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleJurisdictionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "ALL") {
      params.set("jurisdiction", value);
    } else {
      params.delete("jurisdiction");
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

  return (
    <div className="flex gap-4">
      {/* Search Input handled here instead of page */}
      <div className="relative w-[300px]">
         <input 
           type="text"
           placeholder="Search decisions..." 
           className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 pl-9"
           defaultValue={searchParams.get("query")?.toString()}
           onChange={(e) => handleSearch(e.target.value)}
         />
         <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
      </div>

      <div className="w-[200px]">
        <Select value={currentJurisdiction} onValueChange={handleJurisdictionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Jurisdiction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Jurisdictions</SelectItem>
            {jurisdictions.map((j) => (
              <SelectItem key={j.id} value={j.code}>
                {j.code} - {j.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
