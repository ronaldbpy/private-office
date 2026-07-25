import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { readFile } from "@/lib/vault";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { documentId } = await params;

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: { entityLinks: true },
  });

  const access = await getUserAccess(user.id);
  const entityIds = accessibleEntityIds(access);
  const hasAccess =
    !!doc && doc.entityLinks.some((l) => entityIds.includes(l.entityId));

  if (!doc || !hasAccess) {
    // FS-016: los resultados de búsqueda/acceso nunca revelan a un usuario
    // sin permiso que el documento existe — mismo 404 en ambos casos.
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  // FS-016 / SEC-002: toda lectura de un documento queda auditada.
  await prisma.documentAccessLog.create({
    data: { documentId: doc.id, accessedBy: user.id, action: "download" },
  });

  const bytes = await readFile(doc.storagePath);

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(doc.filename)}"`,
    },
  });
}
