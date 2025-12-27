"use server";

import { db } from "@/lib/TaxDecisions/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
/* ✅ Explicit type instead of Prisma internal types */
type EvidenceCreateInput = {
  fileName: string;
  fileUrl: string;
  fileType: string;
  notes: string;
};

export async function createDecision(formData: FormData) {
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const rationale = formData.get("rationale") as string;
  const status = formData.get("status") as string;
  const taxType = formData.get("taxType") as string;

  const links = formData.getAll("links") as string[];
  const files = formData.getAll("files") as File[];

  /* ✅ FIX: typed array (no more `never[]`) */
  const evidenceData: EvidenceCreateInput[] = [];

  // ===== Process Links =====
  for (const link of links) {
    if (link && link.trim() !== "") {
      evidenceData.push({
        fileName: link,
        fileUrl: link,
        fileType: "LINK",
        notes: "External Link",
      });
    }
  }

  // ===== Process Files =====
  if (files.length > 0) {
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (file.size === 0) continue;

      const bytes = await file.arrayBuffer();
      const uint8Array = new Uint8Array(bytes); // ✅ FIX

      const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
      const filePath = join(uploadDir, uniqueName);

      await writeFile(filePath, uint8Array);

      evidenceData.push({
        fileName: file.name,
        fileUrl: `/uploads/${uniqueName}`,
        fileType: file.type,
        notes: "Uploaded during creation",
      });
    }
  }

  const jurisdictions = formData.getAll("jurisdictions") as string[];

  /* ✅ FIX: Get session user instead of DB lookup */
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const userId = session?.user?.id || "Unknown"; 

  await db.decision.create({
    data: {
      title,
      summary,
      rationale,
      status: status || "DRAFT",
      taxType,
      authorId: userId, // ✅ Simply set the string ID (or "Unknown")
      createdBy: userId,
      updatedBy: userId,
      jurisdictionCodes: jurisdictions.join(","),
      evidence: evidenceData.length
        ? { create: evidenceData } // ✅ array form
        : undefined,
    },
  });

  revalidatePath("/dashboard/getTaxDecisions");
  redirect("/dashboard/getTaxDecisions");
}
