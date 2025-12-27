import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BookOpen, FileText } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Decisions</CardTitle>
              <BookOpen className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-slate-500">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-slate-500">2 requiring attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Evidence</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-slate-500">files uploaded this week</p>
            </CardContent>
          </Card>
        </div>

        <div>
           <h3 className="mb-4 text-lg font-medium text-slate-900">Recent Activity</h3>
           <div className="rounded-md border bg-white p-4 text-center text-sm text-slate-500">
             No recent activity found.
           </div>
        </div>
      </div>
    </div>
  );
}

// Temporary Card Placeholder until we install shadcn/ui fully or create them manually. 
// Since I haven't installed the full shadcn/ui registry components yet, I will mock them inline or create a simple components/ui/card.tsx
