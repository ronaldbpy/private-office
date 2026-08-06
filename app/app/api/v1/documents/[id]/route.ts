import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    // Verificar acceso al documento (via entityLinks)
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        entityLinks: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verificar que al menos una entidad del documento sea accesible
    const hasAccess = document.entityLinks.some((link) =>
      entityIds.includes(link.entityId)
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Registrar acceso (auditoría — FS-016 / SEC-002)
    await prisma.documentAccessLog.create({
      data: {
        documentId: document.id,
        accessedBy: userId,
        action: "download",
      },
    });

    // Leer archivo del storage local
    const filePath = join(process.cwd(), document.storagePath);
    const fileContent = readFileSync(filePath);

    // Retornar con headers apropiados
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${document.filename}"`,
        "Content-Length": document.sizeBytes.toString(),
      },
    });
  } catch (error) {
    console.error(`GET /api/v1/documents/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET de metadata (sin descargar archivo)
export async function HEAD(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        entityLinks: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hasAccess = document.entityLinks.some((link) =>
      entityIds.includes(link.entityId)
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return new NextResponse(null, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Length": document.sizeBytes.toString(),
      },
    });
  } catch (error) {
    console.error(`HEAD /api/v1/documents/${params.id} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
