"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAudit(formData: FormData) {
  const title = formData.get("title") as string;
  const context = formData.get("context") as string;
  const narrative = formData.get("narrative") as string;
  const outcome = formData.get("outcome") as string;

  await db.auditExplanation.create({
    data: {
      title,
      context,
      narrative,
      outcome,
    },
  });

  revalidatePath("/audits");
  redirect("/audits");
}
