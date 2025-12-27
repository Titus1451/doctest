import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function AuditsPage() {
  const audits = await db.auditExplanation.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <Header title="Audit Explanations">
        <Link href="/audits/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Explanation
          </Button>
        </Link>
      </Header>

      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
             <Input placeholder="Search audit explanations..." className="pl-10" />
           </div>
        </div>

        <div className="grid gap-4">
           {audits.length === 0 ? (
               <div className="p-12 text-center border rounded-lg bg-white border-dashed">
                 <p className="text-slate-500">No audit explanations recorded yet.</p>
               </div>
           ) : (
             audits.map(audit => (
               <Card key={audit.id} className="hover:border-indigo-200 transition-colors cursor-pointer">
                 <CardHeader className="py-4">
                   <div className="flex items-start justify-between">
                     <div className="flex items-start gap-4">
                       <div className="p-2 bg-indigo-50 rounded-lg">
                         <ShieldCheck className="h-6 w-6 text-indigo-600" />
                       </div>
                       <div>
                         <CardTitle className="text-lg">{audit.title}</CardTitle>
                         <p className="text-sm text-slate-500 mt-1 line-clamp-2">{audit.context}</p>
                       </div>
                     </div>
                     <span className="text-xs text-slate-400">
                       {format(audit.createdAt, "MMM d, yyyy")}
                     </span>
                   </div>
                 </CardHeader>
               </Card>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
