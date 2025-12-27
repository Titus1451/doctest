"use client";

import { createAudit } from "@/app/actions/audits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Explanation"}
    </Button>
  );
}

export function AuditForm() {
  return (
    <form action={createAudit} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="e.g. 2023 Payroll Tax Audit Response" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="context">Context/Authority</Label>
        <Input id="context" name="context" placeholder="e.g. IRS Notice CP-2000" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="narrative">Narrative & Defense</Label>
        <Textarea 
          id="narrative" 
          name="narrative" 
          className="min-h-[200px]" 
          placeholder="Detailed explanation of our position and defense." 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcome">Outcome (Optional)</Label>
        <Input id="outcome" name="outcome" placeholder="e.g. No Change / Settled" />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
