"use server";

import { db } from "@/lib/TaxDecisions/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
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
  const jurisdictions = formData.getAll("jurisdictions") as string[];

  if (!title || !summary || !rationale || !taxType || jurisdictions.length === 0) {
    throw new Error("Missing required fields: title, summary, rationale, taxType, and jurisdictions are mandatory.");
  }

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

  /* ✅ FIX: Get session user instead of DB lookup */
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const userEmail = session?.user?.email || "Unknown"; 

  await db.decision.create({
    data: {
      title,
      summary,
      rationale,
      status: status || "DRAFT",
      taxType,
      authorId: userEmail, // ✅ Simply set the string ID (or "Unknown")
      createdBy: userEmail,
      updatedBy: userEmail,
      jurisdictionCodes: jurisdictions.join(","),
      evidence: evidenceData.length
        ? { create: evidenceData } // ✅ array form
        : undefined,
    },
  });

  revalidatePath("/dashboard/getTaxDecisions");
  redirect("/dashboard/getTaxDecisions");
}

/* ✅ NEW: Update Decision Action */
export async function updateDecision(id: string, formData: FormData) {
  const session = await getServerSession(authOptions as any);

  console.log("session: ", session); 
  // @ts-ignore
  const userRole = session?.user?.role;
  // @ts-ignore
  const userEmail = session?.user?.email || "Unknown";

  if (userRole !== "TAX_TECH") {
    throw new Error("Unauthorized: Only TAX_TECH can update decisions");
  }

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const rationale = formData.get("rationale") as string;
  const status = formData.get("status") as string;
  const taxType = formData.get("taxType") as string;
  const jurisdictions = formData.getAll("jurisdictions") as string[];

  if (!title || !summary || !rationale || !taxType || jurisdictions.length === 0) {
    throw new Error("Missing required fields: title, summary, rationale, taxType, and jurisdictions are mandatory.");
  }

  /*
   Note: For simplicity in this implementation, we are NOT handling new file uploads 
   during update in this specific action yet, or assuming they are handled separately.
   If reusing DecisionForm, it might send files. Handling file updates + deletions 
   complex logic (delta updates). For now we focus on fields.
   */

  await db.decision.update({
    where: { id },
    data: {
      title,
      summary,
      rationale,
      status,
      taxType,
      jurisdictionCodes: jurisdictions.join(","),
      updatedBy: userEmail,
      // updatedAt is auto-handled by Prisma @updatedAt
    },
  });

  revalidatePath(`/dashboard/getTaxDecisions/${id}`);
  revalidatePath("/dashboard/getTaxDecisions");
  redirect(`/dashboard/getTaxDecisions/${id}`);
}
