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

// Límite de tamaño — el storage v1 es disco local del servidor (ver
// lib/vault.ts), así que hay que cuidar el disco activamente en vez de
// confiar en un límite impuesto por una plataforma de hosting. 25MB cubre
// cómodamente PDFs escaneados, contratos, fotos de documentos; archivos más
// grandes (videos, planos CAD) van a necesitar el object storage real
// pendiente de decidir (ver nota en schema.prisma).
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

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

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)}MB. El límite actual es ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB (storage local — ver nota en schema.prisma sobre object storage real).`,
      },
      { status: 413 },
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
