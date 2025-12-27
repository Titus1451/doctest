"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/TaxDecisions/ui/card";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Plus, Link as LinkIcon, FileText, Trash2 } from "lucide-react";
import { uploadEvidence } from "@/app/components/TaxDecisions/actions/evidence";
import { Input } from "@/app/components/TaxDecisions/ui/input"; // Assuming you have an input component

export function EvidenceSection({ decisionId, initialEvidence }: { decisionId: string, initialEvidence: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Supporting Evidence</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <form action={async (formData) => {
              formData.append("decisionId", decisionId);
              await uploadEvidence(formData);
              setIsAdding(false);
          }} className="p-3 bg-slate-50 rounded-lg border space-y-3">
             <Input name="file" type="file" required className="text-xs" />
             <Input name="notes" placeholder="Description/Notes" className="text-xs" />
             <div className="flex justify-end gap-2">
               <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
               <Button size="sm" type="submit">Upload</Button>
             </div>
          </form>
        )}

        <div className="space-y-2">
          {initialEvidence.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No evidence attached.</p>
          ) : (
            initialEvidence.map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden">
                  {item.fileType === 'LINK' ? <LinkIcon className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-slate-400" />}
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-700 truncate">{item.fileName}</p>
                    {item.notes && <p className="text-xs text-slate-400">{item.notes}</p>}
                  </div>
                </a>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
