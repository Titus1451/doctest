"use server";

import { db } from "@/lib/TaxDecisions/db";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function uploadEvidence(formData: FormData) {
  const file = formData.get("file") as File;
  const notes = formData.get("notes") as string;
  const decisionId = formData.get("decisionId") as string;
  // const auditId = formData.get("auditId") as string;

  if (!file) return;

  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const userEmail = session?.user?.email || "Unknown";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // In a real app, upload to S3. Here, save to public/uploads
  const uploadDir = join(process.cwd(), "public/uploads");
  const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
  const filePath = join(uploadDir, uniqueName);
  
  try {
    // Ensure dir exists (or rely on it being there)
    // await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
  } catch (e) {
    console.error("Upload error", e);
    return;
  }

  await db.evidence.create({
    data: {
      fileName: file.name,
      fileUrl: `/uploads/${uniqueName}`,
      fileType: file.type,
      notes,
      decisionId: decisionId || undefined,
      createdBy: userEmail,
      // auditExplanationId: auditId || undefined,
    }
  });

  revalidatePath("/dashboard/getTaxDecisions");
  revalidatePath(`/dashboard/getTaxDecisions/${decisionId}`);
}

export async function updateEvidence(
  evidenceId: string, 
  updates: { notes?: string }, 
  decisionId: string
) {
  const session = await getServerSession(authOptions as any) as any;
  
  // Check authorization - simplified to check if logged in for now, or match role
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

    // @ts-ignore
  const userEmail = session.user.email || "Unknown";

  await db.evidence.update({
    where: { id: evidenceId },
    data: {
      ...updates,
      updatedBy: userEmail,
    }
  });

  revalidatePath("/dashboard/getTaxDecisions");
  revalidatePath(`/dashboard/getTaxDecisions/${decisionId}`);
}
