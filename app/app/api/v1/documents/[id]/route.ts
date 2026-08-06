import { prisma } from "@/lib/prisma";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { getAuthUserId } from "@/lib/api-auth";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getUserAccess(userId);
    const entityIds = accessibleEntityIds(access);

    const document = await prisma.document.findUnique({
      where: { id },
      include: { entityLinks: { select: { entityId: true } } },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check access to at least one entity linked to this document
    const hasAccess = document.entityLinks.some((link) =>
      entityIds.includes(link.entityId)
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete file from storage
    try {
      const storagePath = join(process.cwd(), ".vault-storage", document.storagePath);
      await unlink(storagePath);
    } catch (err) {
      console.warn(`Could not delete file at ${document.storagePath}:`, err);
      // Don't fail the request if file deletion fails; DB record is what matters
    }

    // Delete document and all links
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/v1/documents/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
