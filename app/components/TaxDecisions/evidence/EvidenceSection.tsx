"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/TaxDecisions/ui/card";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Plus, Link as LinkIcon, FileText, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import { uploadEvidence, updateEvidence } from "@/app/components/TaxDecisions/actions/evidence";
import { Input } from "@/app/components/TaxDecisions/ui/input";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function EvidenceSection({ decisionId, initialEvidence }: { decisionId: string, initialEvidence: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data: session } = useSession();
  // @ts-ignore - role might not be typed in default session
  const isAuthorized = session?.user?.role === 'TAX_TECH';

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditNotes(item.notes || "");
    setConfirmingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNotes("");
    setConfirmingId(null);
  };

  const handleSave = async (item: any) => {
    if (confirmingId !== item.id) {
      setConfirmingId(item.id);
      return;
    }

    setIsUpdating(true);
    try {
      await updateEvidence(item.id, { notes: editNotes }, decisionId);
      toast.success("Evidence updated successfully");
      setEditingId(null);
      setConfirmingId(null);
    } catch (error) {
      toast.error("Failed to update evidence");
    } finally {
      setIsUpdating(false);
    }
  };
  
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
               <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
               <Button size="sm" type="submit">Upload</Button>
             </div>
          </form>
        )}

        <div className="space-y-2">
          {initialEvidence.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No evidence attached.</p>
          ) : (
            initialEvidence.map((item) => (
              <div key={item.id} className="group flex flex-col p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center justify-between">
                  {editingId === item.id ? (
                    <div className="flex-1 flex gap-2 items-center mr-2">
                      <Input 
                        value={editNotes} 
                        onChange={(e) => setEditNotes(e.target.value)} 
                        className="text-xs h-8" 
                        placeholder="Edit notes..."
                      />
                    </div>
                  ) : (
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden flex-1">
                      {item.fileType === 'LINK' ? <LinkIcon className="h-4 w-4 text-blue-500 flex-shrink-0" /> : <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.fileName}</p>
                        {item.notes && <p className="text-xs text-slate-400">{item.notes}</p>}
                      </div>
                    </a>
                  )}

                  {isAuthorized && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === item.id ? (
                        <>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-green-600" onClick={() => handleSave(item)} disabled={isUpdating}>
                             {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : (confirmingId === item.id ? <Check className="h-3 w-3 text-red-500 font-bold" /> : <Check className="h-3 w-3" />)}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={cancelEdit} disabled={isUpdating}>
                            <X className="h-3 w-3" />
                          </Button>
                          {confirmingId === item.id && <span className="text-[10px] text-red-500 font-medium ml-1">Confirm?</span>}
                        </>
                      ) : (
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-blue-600" onClick={() => handleEdit(item)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-1 pl-6 flex gap-3 text-[10px] text-slate-300">
                   {item.createdBy && <span>Added by: {item.createdBy}</span>}
                   {item.updatedBy && <span>Updated by: {item.updatedBy} at {new Date(item.updatedAt).toLocaleTimeString()}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
