"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function uploadEvidence(formData: FormData) {
  const file = formData.get("file") as File;
  const notes = formData.get("notes") as string;
  const decisionId = formData.get("decisionId") as string;
  // const auditId = formData.get("auditId") as string;

  if (!file) return;

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
      // auditExplanationId: auditId || undefined,
    }
  });

  revalidatePath("/decisions");
  revalidatePath(`/decisions/${decisionId}`);
}
