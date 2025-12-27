import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { DecisionsFilter } from "@/components/decisions/DecisionsFilter";
import { cn } from "@/lib";
import { JURISDICTIONS } from "@/lib/constants";

async function getDecisions(jurisdictionFilter?: string, query?: string) {
  const where: any = {};
  
  if (jurisdictionFilter && jurisdictionFilter !== 'ALL') {
    where.jurisdictionCodes = {
      contains: jurisdictionFilter
    };
  }

  if (query) {
    where.OR = [
       { title: { contains: query } },
       { summary: { contains: query } }
    ];
  }

  return await db.decision.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { author: true }
  });
}

const getJurisdictionName = (code: string) => {
  return JURISDICTIONS.find(j => j.code === code)?.name || code;
}

export default async function DecisionsPage({ searchParams }: { searchParams: { jurisdiction?: string, query?: string } }) {
  const decisions = await getDecisions(searchParams.jurisdiction, searchParams.query);

  return (
    <div>
      <Header title="Decisions">
        <div className="flex gap-2">
           <a href="/api/decisions/export" download>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
           </a>
           <Link href="/decisions/new">
             <Button className="flex items-center gap-2">
               <Plus className="h-4 w-4" />
               New Decision
             </Button>
           </Link>
        </div>
      </Header>
      
      <div className="p-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between">
          <DecisionsFilter />
        </div>

        {/* Decisions List */}
        <div className="grid gap-4">
          {decisions.length === 0 ? (
             <div className="p-12 text-center border rounded-lg bg-white border-dashed">
                 <p className="text-slate-500">No decisions found matching your criteria.</p>
             </div>
          ) : (
            decisions.map((decision) => (
               <Link href={`/decisions/${decision.id}`} key={decision.id}>
                 <Card className="hover:border-indigo-200 transition-colors cursor-pointer group h-full">
                   <CardHeader className="py-4">
                     <div className="flex items-start justify-between gap-4">
                       <div className="space-y-1">
                         <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">{decision.title}</CardTitle>
                         <p className="text-sm text-slate-500 line-clamp-2">{decision.summary}</p>
                         
                         <div className="flex flex-wrap gap-2 mt-2">
                           {decision.jurisdictionCodes?.split(',').filter(Boolean).map((code) => (
                             <span key={code} className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                               {code}
                             </span>
                           ))}
                         </div>

                         <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                            <span>Created {new Date(decision.createdAt).toLocaleDateString()}</span>
                            {decision.author && (
                                <>
                                    <span>•</span>
                                    <span>{decision.author.name}</span>
                                </>
                            )}
                         </div>
                       </div>
                       
                       <div className="flex flex-col items-end gap-2 shrink-0">
                           <span className={cn(
                             "px-2 py-1 text-xs font-semibold rounded-full",
                             decision.status === 'FINAL' ? "bg-green-100 text-green-700" : 
                             decision.status === 'DRAFT' ? "bg-yellow-100 text-yellow-700" :
                             "bg-slate-100 text-slate-600"
                           )}>
                             {decision.status}
                           </span>
                           {decision.taxType && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                                  {decision.taxType}
                              </span>
                           )}
                       </div>
                     </div>
                   </CardHeader>
                 </Card>
               </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
