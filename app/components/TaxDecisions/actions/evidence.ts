"use server";

import { db } from "@/lib/TaxDecisions/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function uploadEvidence(formData: FormData) {
  const files = formData.getAll("files") as File[];
  const links = formData.getAll("links") as string[];
  const decisionId = formData.get("decisionId") as string;

  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const userEmail = session?.user?.email || "Unknown";

  const uploadDir = join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const evidenceData = [];

  // Handle Links
  for (const link of links) {
    if (link && link.trim() !== "") {
      evidenceData.push({
        fileName: link,
        fileUrl: link,
        fileType: "LINK",
        notes: "External Link",
        decisionId,
        createdBy: userEmail,
      });
    }
  }

  // Handle Files
  for (const file of files) {
    if (file.size === 0) continue;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const filePath = join(uploadDir, uniqueName);
    
    await writeFile(filePath, buffer);

    evidenceData.push({
      fileName: file.name,
      fileUrl: `/uploads/${uniqueName}`,
      fileType: file.type,
      notes: "Uploaded during edit",
      decisionId,
      createdBy: userEmail,
    });
  }

  if (evidenceData.length > 0) {
    // Prisma createMany is useful here if supported by the provider, 
    // but for safety and specific fields, we can use a loop or transactional create.
    for (const data of evidenceData) {
      await db.evidence.create({ data });
    }
  }

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
