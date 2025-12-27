"use client";

import * as React from "react";
import { cn } from "@/lib";
import { updateDecision } from "@/app/components/TaxDecisions/actions/decisions";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Input } from "@/app/components/TaxDecisions/ui/input";
import { Textarea } from "@/app/components/TaxDecisions/ui/textarea";
import { Label } from "@/app/components/TaxDecisions/ui/label";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import { JURISDICTIONS } from "@/lib/TaxDecisions/constants";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

interface EditDecisionFormProps {
  decision: {
    id: string;
    title: string;
    summary: string;
    rationale: string;
    status: string;
    taxType: string | null;
    jurisdictionCodes: string | null;
  };
}

export function EditDecisionForm({ decision }: EditDecisionFormProps) {
  // Initial State from Props
  const [links, setLinks] = React.useState<string[]>([]); // We don't have links in decision model easily available without parsing evidence often
  // Simplification: For this task, we focus on editing main fields. Evidence editing is separate or complex.
  // The user asked to "edit details (e.g., notes)" for evidence in the previous task.
  // For the Decision itself, we likely want to edit Title, Summary, Rationale, Status, TaxType, Jurisdictions.
  
  const initialJurisdictions = decision.jurisdictionCodes ? decision.jurisdictionCodes.split(",") : [];
  const [selectedJurisdictions, setSelectedJurisdictions] = React.useState<string[]>(initialJurisdictions);
  
  const [isCustomTaxType, setIsCustomTaxType] = React.useState(false);
  const initialTaxType = decision.taxType || "";
  const isStandardTax = ["Sales Tax", "Meals Tax", "Alcohol Tax"].includes(initialTaxType);
  
  // If existing tax type is not standard and not empty, set custom mode
  React.useEffect(() => {
    if (initialTaxType && !isStandardTax) {
       setIsCustomTaxType(true);
    }
  }, [initialTaxType, isStandardTax]);

  const toggleJurisdiction = (code: string) => {
    if (selectedJurisdictions.includes(code)) {
      setSelectedJurisdictions(selectedJurisdictions.filter(c => c !== code));
    } else {
      setSelectedJurisdictions([...selectedJurisdictions, code]);
    }
  };

  const clientAction = async (formData: FormData) => {
     // Append jurisdictions
     selectedJurisdictions.forEach(code => {
       formData.append("jurisdictions", code);
     });

     await updateDecision(decision.id, formData);
  };

  return (
    <form action={clientAction} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={decision.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Input id="summary" name="summary" defaultValue={decision.summary} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Jurisdiction Selector */}
        <div className="space-y-2">
          <Label>Jurisdictions</Label>
          <div className="relative group">
             <div className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 cursor-pointer">
                <span className="truncate">
                  {selectedJurisdictions.length > 0 
                    ? selectedJurisdictions.join(", ")
                    : "Select jurisdictions..."}
                </span>
             </div>
             <div className="absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-950 shadow-md hidden group-hover:block hover:block">
                <div className="max-h-64 overflow-y-auto p-1">
                  {JURISDICTIONS.map((j) => (
                    <div 
                      key={j.code} 
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900",
                        selectedJurisdictions.includes(j.code) && "bg-slate-50 font-medium"
                      )}
                      onClick={() => toggleJurisdiction(j.code)}
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-slate-300",
                        selectedJurisdictions.includes(j.code) ? "bg-slate-900 border-slate-900 text-white" : "bg-transparent"
                      )}>
                        {selectedJurisdictions.includes(j.code) && <span className="h-2 w-2 bg-current rounded-sm" />}
                      </div>
                      <span>{j.name} <span className="text-xs text-slate-400 ml-1">({j.code})</span></span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="taxType">Tax Type</Label>
          {!isCustomTaxType ? (
            <select
              id="taxTypeSelect"
              className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              onChange={(e) => {
                if (e.target.value === "CUSTOM_PLUS") {
                  setIsCustomTaxType(true);
                }
              }}
              name={isCustomTaxType ? undefined : "taxType"}
              defaultValue={isStandardTax ? initialTaxType : ""}
            >
              <option value="" disabled>Select Tax Type...</option>
              <option value="Sales Tax">Sales Tax</option>
              <option value="Meals Tax">Meals Tax</option>
              <option value="Alcohol Tax">Alcohol Tax</option>
              <option value="CUSTOM_PLUS">+ Add Custom</option>
            </select>
          ) : (
            <div className="flex gap-2">
               <Input 
                 id="taxType" 
                 name="taxType" 
                 placeholder="Enter custom tax type..." 
                 defaultValue={initialTaxType}
                 autoFocus
               />
               <Button 
                 type="button" 
                 variant="ghost" 
                 size="icon" 
                 onClick={() => setIsCustomTaxType(false)}
                 title="Back to list"
               >
                 ✕
               </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select 
            id="status" 
            name="status" 
            defaultValue={decision.status}
            className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
          >
            <option value="DRAFT">Draft</option>
            <option value="FINAL">Final</option>
            <option value="DEPRECATED">Deprecated</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rationale">Rationale & Reasoning</Label>
        <Textarea 
          id="rationale" 
          name="rationale" 
          className="min-h-[200px]" 
          defaultValue={decision.rationale}
          required 
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Link href={`/dashboard/getTaxDecisions/${decision.id}`}>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
