"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/TaxDecisions/ui/card";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Plus, Link as LinkIcon, FileText, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import { uploadEvidence, updateEvidence } from "@/app/components/TaxDecisions/actions/evidence";
import { Input } from "@/app/components/TaxDecisions/ui/input";
import { Label } from "@/app/components/TaxDecisions/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function EvidenceSection({ 
  decisionId, 
  initialEvidence, 
  editable = false 
}: { 
  decisionId: string; 
  initialEvidence: any[]; 
  editable?: boolean; 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data: session } = useSession();
  // @ts-ignore - role might not be typed in default session
  const isAuthorized = session?.user?.role === 'TAX_TECH';

  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState("");

  const addLink = () => {
    if (currentLink && !links.includes(currentLink)) {
      setLinks([...links, currentLink]);
      setCurrentLink("");
    }
  };

  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter(l => l !== linkToRemove));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

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
    <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
      <div className="h-1 bg-custom-green" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase text-slate-400 font-humanist tracking-widest">Supporting Evidence</CardTitle>
        {editable && isAuthorized && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-custom-green hover:text-white transition-all rounded-full" onClick={() => {
            setIsAdding(!isAdding);
            setFiles([]);
            setLinks([]);
            setCurrentLink("");
          }}>
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="p-4 bg-slate-50 rounded-lg border border-custom-green/20 space-y-4 shadow-inner">
             {/* Files Section */}
             <div className="space-y-2">
               <Label className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Upload Files</Label>
               <div className="flex gap-2">
                 <Button size="sm" variant="outline" className="w-full text-xs border-dashed border-custom-green/30 hover:border-custom-green hover:bg-custom-green-light/5" onClick={() => document.getElementById('sidebar-file-upload')?.click()}>
                   Choose Files
                 </Button>
                 <input 
                   id="sidebar-file-upload"
                   type="file" 
                   multiple 
                   className="hidden" 
                   onChange={handleFileChange}
                 />
               </div>
               {files.length > 0 && (
                 <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100 text-[10px] font-medium">
                        <span className="truncate flex-1 text-slate-600">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                 </div>
               )}
             </div>

             {/* Links Section */}
             <div className="space-y-2">
               <Label className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">External Links</Label>
               <div className="flex gap-1">
                 <Input 
                   value={currentLink} 
                   onChange={(e) => setCurrentLink(e.target.value)} 
                   placeholder="https://..." 
                   className="text-xs h-9 border-slate-200 focus:ring-custom-green"
                 />
                 <Button size="sm" variant="secondary" className="h-9" onClick={addLink}>Add</Button>
               </div>
               {links.length > 0 && (
                 <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                    {links.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100 text-[10px] font-medium">
                        <span className="truncate flex-1 text-slate-600">{link}</span>
                        <button type="button" onClick={() => removeLink(link)} className="text-red-500 hover:text-red-700 ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                 </div>
               )}
             </div>

             <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
               <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
               <Button 
                 size="sm" 
                 variant="default"
                 disabled={files.length === 0 && links.length === 0}
                 onClick={async () => {
                    const formData = new FormData();
                    formData.append("decisionId", decisionId);
                    files.forEach(f => formData.append("files", f));
                    links.forEach(l => formData.append("links", l));
                    setIsUpdating(true);
                    await uploadEvidence(formData);
                    setIsUpdating(false);
                    setIsAdding(false);
                    toast.success("Evidence added successfully");
                 }}
               >
                 {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upload All"}
               </Button>
             </div>
          </div>
        )}

        <div className="space-y-3">
          {initialEvidence.length === 0 ? (
            <div className="text-center py-6 px-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <p className="text-[10px] text-slate-400 uppercase font-black font-humanist">No evidence attached yet</p>
            </div>
          ) : (
            initialEvidence.map((item) => (
              <div key={item.id} className="group flex flex-col p-3 rounded-lg border border-slate-100 hover:border-custom-green/20 hover:bg-custom-green-light/5 transition-all duration-300">
                <div className="flex items-center justify-between">
                  {editingId === item.id ? (
                    <div className="flex-1 flex gap-2 items-center mr-2">
                      <Input 
                        value={editNotes} 
                        onChange={(e) => setEditNotes(e.target.value)} 
                        className="text-xs h-8 border-custom-green/20 focus:ring-custom-green" 
                        placeholder="Edit notes..."
                      />
                    </div>
                  ) : (
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100 group-hover:border-custom-green/30 transition-colors">
                        {item.fileType === 'LINK' ? <LinkIcon className="h-4 w-4 text-custom-orange flex-shrink-0" /> : <FileText className="h-4 w-4 text-custom-green flex-shrink-0" />}
                      </div>
                      <div className="truncate">
                        <p className="text-[11px] font-black text-slate-700 truncate font-humanist uppercase tracking-tight">{item.fileName}</p>
                        {item.notes && <p className="text-[10px] text-slate-400 font-medium italic">{item.notes}</p>}
                      </div>
                    </a>
                  )}

                  {editable && isAuthorized && (
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
                
                <div className="mt-2 pl-10 flex flex-wrap gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                   {item.createdBy && (
                     <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                       <span className="text-custom-green opacity-70">By</span>
                       <span>{item.createdBy.split('@')[0]}</span>
                     </div>
                   )}
                   {item.updatedBy && (
                     <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                       <span className="text-custom-orange opacity-70">Mod</span>
                       <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                     </div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
