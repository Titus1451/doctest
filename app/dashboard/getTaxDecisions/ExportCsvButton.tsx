"use client";

import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Download } from "lucide-react";

export default function ExportCsvButton() {
  const handleExport = async () => {
    console.log("Exporting"); // ✅ will log

    const res = await fetch("/api/taxdecisions/export");

    if (!res.ok) {
      alert("Export failed");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tax_decisions_export.csv";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleExport}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
