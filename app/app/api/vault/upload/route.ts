import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { saveFile, hashBuffer, safeFilename } from "@/lib/vault";

const VALID_CLASSIFICATIONS = [
  "RESTRICTED",
  "CONFIDENTIAL",
  "INTERNAL",
  "PUBLIC",
] as const;

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  // FS-005/SEC-001: el acceso se resuelve server-side, nunca se confía en
  // lo que mande el cliente.
  const access = await getUserAccess(user.id);
  const entityIds = accessibleEntityIds(access);

  const formData = await req.formData();
  const file = formData.get("file");
  const entityId = formData.get("entityId");
  const title = formData.get("title");
  const classificationRaw = formData.get("classification");

  if (
    !(file instanceof File) ||
    typeof entityId !== "string" ||
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    return NextResponse.json(
      { error: "Faltan datos: archivo, empresa y título son obligatorios." },
      { status: 400 },
    );
  }

  if (!entityIds.includes(entityId)) {
    return NextResponse.json(
      { error: "No tenés acceso a esa empresa." },
      { status: 403 },
    );
  }

  const classification = VALID_CLASSIFICATIONS.includes(
    classificationRaw as (typeof VALID_CLASSIFICATIONS)[number],
  )
    ? (classificationRaw as (typeof VALID_CLASSIFICATIONS)[number])
    : "CONFIDENTIAL";

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentHash = hashBuffer(buffer);
  const documentId = randomUUID();
  const storagePath = `${documentId}-${safeFilename(file.name)}`;

  await saveFile(buffer, storagePath);

  const doc = await prisma.document.create({
    data: {
      id: documentId,
      title: title.trim(),
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.length,
      contentHash,
      storagePath,
      classification,
      uploadedBy: user.id,
      entityLinks: { create: { entityId } },
      accessLog: { create: { accessedBy: user.id, action: "upload" } },
    },
  });

  return NextResponse.json({ id: doc.id, title: doc.title }, { status: 201 });
}
