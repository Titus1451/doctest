"use client";

import * as React from "react";
import { cn } from "@/lib";
import { createDecision } from "@/app/actions/decisions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

import { JURISDICTIONS } from "@/lib/constants";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Decision"}
    </Button>
  );
}

export function DecisionForm() {
  const [links, setLinks] = React.useState<string[]>([]);
  const [currentLink, setCurrentLink] = React.useState("");
  const [selectedJurisdictions, setSelectedJurisdictions] = React.useState<string[]>([]);
  const [isCustomTaxType, setIsCustomTaxType] = React.useState(false);
  
  // File State
  const [files, setFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addLink = () => {
    if (currentLink && !links.includes(currentLink)) {
      setLinks([...links, currentLink]);
      setCurrentLink("");
    }
  };

  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter(l => l !== linkToRemove));
  };

  const toggleJurisdiction = (code: string) => {
    if (selectedJurisdictions.includes(code)) {
      setSelectedJurisdictions(selectedJurisdictions.filter(c => c !== code));
    } else {
      setSelectedJurisdictions([...selectedJurisdictions, code]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Intercept form action to append files manually
  const clientAction = async (formData: FormData) => {
     // Append manually managed files
     files.forEach(file => {
       formData.append("files", file);
     });
     
     // Append links
     links.forEach(link => {
       formData.append("links", link);
     });

     // Append jurisdictions
     selectedJurisdictions.forEach(code => {
       formData.append("jurisdictions", code);
     });

     await createDecision(formData);
  };

  return (
    <form action={clientAction} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="e.g. VAT treatment of digital services 2024" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Input id="summary" name="summary" placeholder="Brief overview of the decision" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Jurisdiction Selector */}
        <div className="space-y-2">
          <Label>Jurisdictions</Label>
          <div className="relative group">
             <div className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                <span className="truncate">
                  {selectedJurisdictions.length > 0 
                    ? selectedJurisdictions.join(", ")
                    : "Select jurisdictions..."}
                </span>
             </div>
             <div className="absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 hidden group-hover:block hover:block">
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
                  // Clear value so the input starts empty or user types afresh
                  // You might strictly rely on the input's own state if we were controlled fully, 
                  // but here we just switch modes.
                } else {
                  // For standard options, we let the select hold the value, 
                  // but we must ensure the FormData picks it up. 
                  // Actually, strictly speaking if we use a controlled component we can sync a hidden input.
                }
              }}
              name={isCustomTaxType ? undefined : "taxType"} // Only use this as name if NOT custom
              defaultValue=""
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
          placeholder="Detailed explanation of the decision, references to laws, etc." 
          required 
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-slate-900">Supporting Evidence</h3>
        
        <div className="space-y-2">
          <Label>Upload Files (PDF, Images, Docs)</Label>
          <div className="flex gap-2">
             <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Choose Files
             </Button>
             <input 
               ref={fileInputRef}
               type="file" 
               multiple 
               className="hidden" 
               onChange={handleFileChange}
             />
          </div>
          {files.length > 0 && (
            <div className="space-y-2 mt-2">
               {files.map((file, idx) => (
                 <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                   <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-medium text-slate-700 truncate">{file.name}</span>
                      <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                   </div>
                   <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 ml-2">
                     Remove
                   </button>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>External Links</Label>
          <div className="flex gap-2">
            <Input 
              value={currentLink} 
              onChange={(e) => setCurrentLink(e.target.value)} 
              placeholder="https://..." 
              type="url"
            />
            <Button type="button" onClick={addLink} variant="secondary">Add</Button>
          </div>
          
          {links.length > 0 && (
            <div className="space-y-2 mt-2">
              {links.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                  <span className="truncate flex-1">{link}</span>
                  <button type="button" onClick={() => removeLink(link)} className="text-red-500 hover:text-red-700 ml-2">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
